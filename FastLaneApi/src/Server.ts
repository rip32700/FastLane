import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as logger from "morgan";
import * as errorHandler from "errorhandler";
import { Database } from "./models/Database";
import { router } from "./routes/ApiRoutes";
import * as passport from "passport";
import * as cors from "cors";
import expressValidator = require("express-validator");
import * as winston from "winston";
import * as fs from "fs";
import  "./config/PassportConfig";

/**
 * Load environment variables from .env file
 */
dotenv.config();

const port = process.env.PORT || 8345;

export class Server {

    public app: any;
    public db: Database;


    constructor() {
        // create app
        this.app = express();

        // configure
        this._configureMiddleware();

        // setup database
        this._setupDatabase();

        // add routes
        this._addRoutes();

        // eventually start
        this._launch();
    }


    private _configureMiddleware() {
        this.app.set("port", port);
        this.app.use(logger("dev"));
        this.app.use(logger("common", {stream: fs.createWriteStream("./access.log", {flags: "a"})}));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(expressValidator());
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // configure winston logger
        winston.add(
            winston.transports.File, {
                filename: "fast_lane.log",
                level: "info",
                json: true,
                eol: "\r\n",
                timestamp: true
            }
        );

        // remove for production
        this.app.use(errorHandler());
    }

    private _setupDatabase() {
        const mongoURI = process.env.NODE_ENV === "test" ? process.env.MONGODB_URI_TEST : process.env.MONGODB_URI;
        this.db = new Database(mongoURI);
        this.db.connect();
    }

    private _addRoutes() {
        this.app.use("/api", router);
    }

    private _launch() {
        this.app.listen(this.app.get("port"), () => {
            winston.info(("App is running at http://localhost:%d in %s mode"), this.app.get("port"), this.app.get("env"));
            winston.info("Press CTRL-C to stop\n");
        });
    }
}


// new Server();


