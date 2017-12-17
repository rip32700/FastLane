import  * as express from "express";
import { AuthController } from "../controllers/AuthController";
import * as productRouter from "./ProductRoutes";
import * as shoppingSessionRouter from "./ShoppingSessionRoutes";
import * as cartRouter from "./CartRoutes";
import * as storeRouter from "./StoreRoutes";
import * as userRouter from "./UserRoutes";

const router = express["Router"]();

// load controllers
const authController = new AuthController();

// URLs for the user management
router.post("/register", authController.register);
router.post("/login", authController.login);

// define the routes
router.use(productRouter);
router.use(shoppingSessionRouter);
router.use(cartRouter);
router.use(storeRouter);
router.use(userRouter);


export {
    router
};