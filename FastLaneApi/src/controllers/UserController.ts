import { Request, Response } from "express";
import { sendJSONresponse} from "../common/Utils";
import { User } from "../models/UserModel";
const xssFilters = require("xss-filters");


/**
 * Controller for the carts resource and endpoint /carts
 */
export class UserController {

    /**
     * GET /users/:userId
     * Retrieves a single user
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readOneUser(req: any, res: any) {

        // validate the parameters
        req.checkParams("userId", "User ID needs to be alphanumeric").isAlphanumeric();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // find the store object
        User.findById(req.params.userId).select("-salt -password").then((user: any) => {
            if (!user) {
                sendJSONresponse(res, 404, "User could not be found");
            }
            sendJSONresponse(res, 200, user);
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }

    /**
     * GET /users
     * Retrieves all users
     *
     * @param {e.Request} req
     * @param {e.Response} res
     */
    readAllUsers(req: any, res: any) {

        // validate query input
        req.checkQuery("email", "Email needs to be a valid email address").optional().isEmail();
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // extract query parameters
        const query: any = {};
        if (req.query.email) {
            query.email = req.query.email;
        }

        User.find(query).select("-salt -password").then((users: any) => {
            sendJSONresponse(res, 200, users);
        }).catch((err: Error) => {
            sendJSONresponse(res, 500, err);
        });
    }
}