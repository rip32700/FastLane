import { Request, Response } from "express";
import { sendJSONresponse} from "../common/Utils";
import * as passport from "passport";
import { User } from "../models/UserModel";
const xssFilters = require("xss-filters");


/**
 * Controller for authentication and endpoints /login and /register
 */
export class AuthController {

    /**
     * Handles login for the endpoint
     * @param {Request} req
     * @param {e.Response} res
     * @param next
     */
    public login = (req: any, res: any, next: any) => {
        // validate the parameters
        req.checkBody("email", "Email needs to be a valid email address").isEmail();
        req.checkBody("password", "Password must be at least 6 characters long").isLength({min: 6});
        if (req.validationErrors()) {
            sendJSONresponse(res, 400, req.validationErrors());
            return;
        }

        // authenticate using passport (returns JWT token)
        passport.authenticate("local", function(err: Error, user: any, info: any) {
            if (err) {
                sendJSONresponse(res, 500, err.message);
                return;
            }
            if (!user) {
                sendJSONresponse(res, 401, info);
                return;
            }
            sendJSONresponse(res, 200, {"token" : user.generateJwt()});
        })(req, res, next);
    };

    /**
     * Handles register for the endpoint
     * @param {Request} req
     * @param {e.Response} res
     */
    public register = (req: any, res: any) => {
        // validate the parameters
        const validationErrors = this._checkBodyParameters(req);
        if (validationErrors) {
            sendJSONresponse(res, 400, validationErrors);
            return;
        }

        // input sanitizing
        const data = this._sanitizeBodyParameters(req);

        // save new user
        new User(data).save().then((user: any) => {
            sendJSONresponse(res, 201, {"token": user.generateJwt()});
        }).catch((err: Error) => {
            if (err.message.includes("duplicate key")) {
                sendJSONresponse(res, 409, err);
                return;
            }
            sendJSONresponse(res, 500, err);
        });
    };

    // noinspection JSMethodCanBeStatic
    private _checkBodyParameters(req: any) {
        req.checkBody("email", "Enter a valid email address").isEmail();
        req.checkBody("firstName", "Enter a valid fist name (characters only)").isAscii();
        req.checkBody("lastName", "Enter a valid last name (characters only)").isAscii();
        req.checkBody("nickName", "Enter a valid nick name (characters only)").isAscii();
        req.checkBody("birthDate", "Enter a valid birth date").isDate();
        req.checkBody("password", "Enter a longer password").isLength({ min: 6 });
        req.checkBody("streetName", "Enter a valid street name (characters only)").isAscii();
        req.checkBody("streetNumber", "Enter a valid street number (digits only)").isNumeric();
        req.checkBody("cityName", "Enter a valid city name (characters only)").isAscii();
        req.checkBody("zip", "Enter a valid zip (digits only)").isNumeric();
        return req.validationErrors();
    }

    // noinspection JSMethodCanBeStatic
    private _sanitizeBodyParameters(req: any) {
        return {
            firstName: xssFilters.inHTMLData(req.body.firstName),
            lastName: xssFilters.inHTMLData(req.body.lastName),
            nickName: xssFilters.inHTMLData(req.body.nickName),
            birthDate: new Date(xssFilters.inHTMLData(req.body.birthDate)),
            email: xssFilters.inHTMLData(req.body.email),
            password: xssFilters.inHTMLData(req.body.password),
            address: {
                streetName: xssFilters.inHTMLData(req.body.streetName),
                streetNumber: xssFilters.inHTMLData(req.body.streetNumber),
                cityName: xssFilters.inHTMLData(req.body.cityName),
                zip: xssFilters.inHTMLData(req.body.zip)
            }
        };
    }
}