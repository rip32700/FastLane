import { Request, Response } from "express";
import { sendJSONresponse } from "../common/Utils";
import { Store } from "../models/StoreModel";
const axios = require("axios");

/**
 * Controller for the product resource and endpoint /products
 */
export class ProductController {

    /**
     * GET /products/:barcode
     * Retrieves a single product
     *
     * Requires the store ID to be passed along
     * with the query so that the product querying
     * can be forwarded to the corresponding store
     * api.
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readOneProduct(req: any, res: any) {
        // validate the parameters
        req.checkParams("barcode", "Barcode needs to be numeric").isNumeric();
        req.checkQuery("store", "Store ID needs to be alphanumeric").isAlphanumeric();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // delegate to Store API

        Store.findById(req.query.store).exec().then((store: any) => {
            if (!store) {
                sendJSONresponse(res, 404, {"message": "store ID not found"});
            }

            // find the product by calling the Store API
            axios.get(store.apiUrl + "products/" + req.params.barcode).then((response: any) => {
                if (!response.data) {
                    sendJSONresponse(res, 404, {"message": "product ID not found"});
                }
                sendJSONresponse(res, 200, response.data);
            }).catch((err: Error) => {
                sendJSONresponse(res, 500, err);
            });

        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    /**
     * GET /carts
     * Retrieves all carts
     *
     * Requires the store ID to be passed along
     * with the query so that the product querying
     * can be forwarded to the corresponding store
     * api.
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readAllProducts(req: any, res: any) {
        // validate the parameters
        req.checkQuery("store", "Store ID needs to be alphanumeric").isAlphanumeric();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // delegate to Store API

        Store.findById(req.query.store).then((store: any) => {
            if (!store) {
                sendJSONresponse(res, 404, {"message": "store ID not found"});
            }

            // find the products by calling the Store API
            axios.get(store.apiUrl + "products/").then((response: any) => {
                if (!response.data || response.data.length < 1) {
                    sendJSONresponse(res, 404, {"message": "No products found for this store"});
                }
                sendJSONresponse(res, 200, response.data);
            }).catch((err: Error) => {
                sendJSONresponse(res, 500, err);
            });

        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    createOneProduct(req: any, res: any) {
        // TODO
    }

    replaceOneProduct(req: any, res: any) {
        // TODO
    }

    updateOneProduct(req: any, res: any) {
        // TODO
    }

    deleteOneProduct(req: any, res: any) {
        // TODO
    }

}