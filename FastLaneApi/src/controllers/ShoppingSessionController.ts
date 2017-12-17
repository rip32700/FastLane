import { Request, Response } from "express";
import { sendJSONresponse } from "../common/Utils";
import { ShoppingSession } from "../models/ShoppingSessionModel";
import { User } from "../models/UserModel";
import { Cart } from "../models/CartModel";
import { Store } from "../models/StoreModel";
const axios = require("axios");
const xssFilters = require("xss-filters");


/**
 * Controller for the shopping session resource and endpoint /shopping_sessions
 */
export class ShoppingSessionController {

    /**
     * GET /shopping_sessions/:shoppingSessionId
     * Retrieves a single shopping session
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readOneShoppingSession(req: any, res: any) {

        // validate the parameters
        req.checkParams("shoppingSessionId", "Shopping session ID needs to be alphanumeric").isAlphanumeric();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // find the store object
        ShoppingSession.findById(req.params.shoppingSessionId)
            .populate("user", "firstName lastName email")
            .populate("cart")
            .exec().then((session: any) => {
                if (!session) {
                    sendJSONresponse(res, 404, "Shopping sessions could not be found");
                }
                sendJSONresponse(res, 200, session);
            }).catch((err: Error) => {
                sendJSONresponse(res, 500, err);
            });
    }

    /**
     * GET /shopping_sessions
     * Retrieves all shopping sessions
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readAllShoppingSessions = (req: any, res: any) => {

        // validate query parameters
        req.checkQuery("paid", "Paid needs to be either true or false").optional().isBoolean();
        req.checkQuery("user", "User ID needs to be alphanumeric").optional().isAlphanumeric();
        req.checkQuery("cart", "Cart ID needs to be alphanumeric").optional().isAlphanumeric();
        req.checkQuery("email", "Email needs to be a valid email").optional().isEmail();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        this._buildQueryFromParameters(req).then((query: any) => {
            ShoppingSession.find(query)
                .populate("user", "firstName lastName email")
                .populate("cart")
                .then((sessions: any) => {
                    sendJSONresponse(res, 200, sessions);
                }).catch((err: Error) => {
                sendJSONresponse(res, 500, err);
            });
        });
    };

    /**
     * POST /shopping_sessions
     * Creates a new shopping session. Initially without any products contained.
     *
     * @param {e.Request} req
     * @param {Response} res
     */
    createOneShoppingSession(req: any, res: any) {
        // validate the parameters
        req.checkBody("user", "User ID needs to be alphanumeric").isAlphanumeric();
        req.checkBody("cart", "Cart ID needs to be alphanumeric").isAlphanumeric();
        req.checkBody("store", "Store ID needs to be alphanumeric").isAlphanumeric();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // sanitation
        const data = {
            user: xssFilters.inHTMLData(req.body.user),
            cart: xssFilters.inHTMLData(req.body.cart),
            store: xssFilters.inHTMLData(req.body.store),
            payment: {paid: false}
        };

        // check that the IDs are valid
        const p1 = User.findById(data.user);
        const p2 = Cart.findById(data.cart);
        const p3 = Store.findById(data.store);
        Promise.all([p1, p2, p3]).then(([user, cart, store]) => {
            if (!user) {
                sendJSONresponse(res, 404, {"message": "User referenced by user ID not found"});
            }
            if (!cart) {
                sendJSONresponse(res, 404, {"message": "Cart referenced by cart ID not found"});
            }
            if (!store) {
                sendJSONresponse(res, 404, {"message": "Store referenced by store ID not found"});
            }
            data.user = user._id;
            data.cart = cart._id;
            data.store = store._id;

            // save session
            new ShoppingSession(data).save().then((session: any) => {
                sendJSONresponse(res, 201, session);
            }).catch((err: Error) => {
                if (err.message.includes("duplicate key")) {
                    sendJSONresponse(res, 409, err);
                    return;
                }
                sendJSONresponse(res, 500, err);
            });
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    replaceOneShoppingSession(req: any, res: any) {
        // TODO
    }

    /**
     * PATCH to /shopping_session/:shoppingSessionId
     * Adds products, pays or finishes the session
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    updateOneShoppingSession = (req: any, res: any) => {
        // validate the parameters
        req.checkParams("shoppingSessionId", "Shopping Session ID needs to be alphanumeric").isAlphanumeric();
        req.checkBody("action", "Action must a valid action command (addProduct, pay)").isIn(["addProduct", "pay", "finish"]);
        if (req.body && req.params.action === "addProduct") {
            req.checkBody("barcode", "Barcode needs to be numeric").isNumeric();
            req.checkBody("amount", "amount needs to be numeric").isNumeric();
        } else if (req.body && req.params.action === "pay") {
            req.checkBody("paymentMethod", "Payment method must a valid method (visa, paypal)").isIn(["visa", "paypal"]);
        }
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // sanitation
        const action = xssFilters.inHTMLData(req.body.action);
        const sessionId = xssFilters.inHTMLData(req.params.shoppingSessionId);

        // call correct sub function according to the action flag
        if (action === "addProduct") {
            const barcode = xssFilters.inHTMLData(req.body.barcode);
            const amount = xssFilters.inHTMLData(req.body.amount);
            this._addProduct(barcode, amount, sessionId, res);
        } else if (action === "pay") {
            const paymentMethod = xssFilters.inHTMLData(req.body.paymentMethod);
            this._paySession(sessionId, paymentMethod, res);
        } else if (action === "finish") {
            this._finishSession(sessionId, res);
        }
    };

    /**
     * Adds a product to the session
     *
     * @param {string} barcode
     * @param amount
     * @param sessionId
     * @param res
     * @private
     */
    private _addProduct(barcode: string, amount: any, sessionId: any, res: any) {
        ShoppingSession.findById(sessionId).then((session: any) => {
            if (!session) {
                sendJSONresponse(res, 404, {"message": "Session referenced by session ID not found"});
            }
            Store.findById(session.store).then((store: any) => {
                axios.get(store.apiUrl + "products/" + barcode).then((response: any) => {
                    if (response.data && response.data.length === 1) {
                        const product = response.data[0];

                        let contained = false;
                        // if contained, update the amount
                        session.products.map((entry: any) => {
                            if (entry.productBarcode === product.barcode) {
                                entry.amount += Number(amount);
                                contained = true;
                            }
                        });
                        // if not contained yet, push it into list
                        if (!contained) {
                            session.products.push({
                                productBarcode: product.barcode,
                                amount: Number(amount)
                            });
                        }

                        // calculate new total
                        session.total += (amount * product.price);

                        session.status = "IN_PROGRESS";
                        session.save();

                        sendJSONresponse(res, 200, session);
                    } else {
                        sendJSONresponse(res, 404, {"message": "Product referenced by barcode not found"});
                    }
                });
            });
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    /**
     * Pays the session.
     *
     * @param sessionId
     * @param paymentMethod
     * @param res
     * @private
     */
    private _paySession(sessionId: any, paymentMethod: any, res: any) {
        ShoppingSession.findByIdAndUpdate(sessionId, {
            payment: {
              paid: true,
              timestamp: Date.now(),
              method: paymentMethod
            },
            status: "PAID"
        }, {"new": true}).then((session: any) => {
            if (!session) {
                sendJSONresponse(res, 404, {"message": "Session referenced by session ID not found"});
            }
            sendJSONresponse(res, 200, session);
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    /**
     * Finishes the session.
     *
     * @param sessionId
     * @param res
     * @private
     */
    private _finishSession(sessionId: any, res: any) {
        ShoppingSession.findByIdAndUpdate(sessionId, {status: "FINISHED"}, {"new": true}).then((session: any) => {
            if (!session) {
                sendJSONresponse(res, 404, {"message": "Session referenced by session ID not found"});
            }
            sendJSONresponse(res, 200, session);
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    deleteOneShoppingSession(req: any, res: any) {
        // TODO
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Extracts the query parameters that are present
     *
     * @param {Request} req
     * @returns {any}
     */
    private _buildQueryFromParameters(req: any) {
        const query: any = {};
        if (req.query.paid) {
            query.paid = req.query.paid;
        }
        if (req.query.user) {
            query.user = req.query.user;
        }
        if (req.query.cart) {
            query.cart = req.query.cart;
        }
        if (req.query.email) {
            return User.findOne({email: req.query.email}).then((user: any) => {
                query.user = user._id;
                return query;
            });
        } else {
            return Promise.resolve(query);
        }
    }

}