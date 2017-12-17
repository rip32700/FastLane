import { Request, Response } from "express";
import { sendJSONresponse } from "../common/Utils";
import { Store } from "../models/StoreModel";
const xssFilters = require("xss-filters");


/**
 * Controller for the store resource and endpoint /stores
 */
export class StoreController {

    /**
     * GET /stores/:storeId
     * Retrieves a single store
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readOneStore(req: any, res: any) {
        // validate the parameters
        req.checkParams("storeId", "StoreId needs to be alphanumeric").isAlphanumeric();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // find the store object
        Store.findById(req.params.storeId).exec().then((store: any) => {
           if (!store) {
               sendJSONresponse(res, 404, "Store could not be found");
           }
           sendJSONresponse(res, 200, store);
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    /**
     * GET /stores
     * Retrieves all stores
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readAllStores(req: any, res: any) {
        Store.find({}).exec().then((stores: any) => {
            sendJSONresponse(res, 200, stores);
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    /**
     * POST /stores
     * Creates a new store
     *
     * @param {e.Request} req
     * @param {Response} res
     */
    createOneStore(req: any, res: any) {
        // validate the parameters
        req.checkBody("name", "name needs to be ascii").isAscii();
        req.checkBody("apiUrl", "API URL needs to be a URL").isURL();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // sanitation
        const data = {
            name: xssFilters.inHTMLData(req.body.name),
            apiUrl: xssFilters.inHTMLData(req.body.apiUrl)
        };

        // save store
        new Store(data).save().then((store: any) => {
            sendJSONresponse(res, 201, store);
        }).catch((err: Error) => {
            if (err.message.includes("duplicate key")) {
                sendJSONresponse(res, 409, err);
                return;
            }
            sendJSONresponse(res, 500, err);
        });
    }

    replaceOneStore(req: any, res: any) {
        // TODO
    }

    updateOneStore(req: any, res: any) {
        // TODO
    }

    deleteOneStore(req: any, res: any) {
        // TODO
    }

}