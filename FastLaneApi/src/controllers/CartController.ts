import { Request, Response } from "express";
import { sendJSONresponse} from "../common/Utils";
import { Cart } from "../models/CartModel";
import { Store } from "../models/StoreModel";
const xssFilters = require("xss-filters");


/**
 * Controller for the carts resource and endpoint /carts
 */
export class CartController {

    /**
     * GET /carts/:cartId
     * Retrieves a single cart
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readOneCart(req: any, res: Response) {

        // validate the parameters
        req.checkParams("qrCode", "qrCode needs to be alphanumeric").isAlphanumeric();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // find the store object
        Cart.find({qrCode: req.params.qrCode}).populate("store").exec().then((cart: any) => {
            if (!cart) {
                sendJSONresponse(res, 404, "Cart could not be found");
            }
            sendJSONresponse(res, 200, cart);
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    /**
     * GET /carts
     * Retrieves all carts
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readAllCarts(req: any, res: Response) {
        Cart.find({}).populate("store").exec().then((carts: any) => {
            sendJSONresponse(res, 200, carts);
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    /**
     * POST /carts
     * Creates a new cart
     *
     * @param {e.Request} req
     * @param {Response} res
     */
    createOneCart(req: any, res: Response) {
        // validate the parameters
        req.checkBody("qrCode", "QR code needs to be alphanumeric").isAlphanumeric();
        req.checkBody("store", "Store ID needs to be alphanumeric").isAlphanumeric();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // sanitation
        const data = {
            qrCode: xssFilters.inHTMLData(req.body.qrCode),
            store: xssFilters.inHTMLData(req.body.store)
        };

        // get store for store ID
        Store.findById(data.store).then((store: any) => {
           if (!store) {
               sendJSONresponse(res, 404, {"message": "Store referenced by store ID not found"});
           }
           data.store = store._id;
           // save cart
           new Cart(data).save().then((cart: any) => {
               sendJSONresponse(res, 201, cart);
           }).catch((err: Error) => {
               if (err.message.includes("duplicate key")) {
                   sendJSONresponse(res, 409, err);
                   return;
               }
               sendJSONresponse(res, 500, err);
           });
        }).catch((err: Error) => {
            if (err.message.includes("Cast to ObjectId failed")) {
                sendJSONresponse(res, 404, {"message": "Store referenced by store ID not found"});
                return;
            }
            sendJSONresponse(res, 500, err);
        });
    }

    replaceOneCart(req: Request, res: Response) {
        // TODO
    }

    updateOneCart(req: Request, res: Response) {
        // TODO
    }

    deleteOneCart(req: Request, res: Response) {
        // TODO
    }

}