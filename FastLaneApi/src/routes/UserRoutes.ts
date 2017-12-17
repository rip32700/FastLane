import  * as express from "express";
import * as jwt from "express-jwt";
import { UserController } from "../controllers/UserController";
import * as dotenv from "dotenv";


dotenv.config();

const router = express["Router"]();
const auth = jwt({ secret: process.env.JWT_SECRET, userProperty: "payload" });
const userController = new UserController();

router.get("/users", auth, userController.readAllUsers);
router.get("/users/:userId", auth, userController.readOneUser);

export = router;