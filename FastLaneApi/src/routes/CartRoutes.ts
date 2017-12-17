import  * as express from "express";
import * as jwt from "express-jwt";
import { CartController } from "../controllers/CartController";
import * as dotenv from "dotenv";


dotenv.config();

const router = express["Router"]();
const auth = jwt({ secret: process.env.JWT_SECRET, userProperty: "payload" });
const cartController = new CartController();

router.get("/carts", auth, cartController.readAllCarts);
router.get("/carts/:qrCode", auth, cartController.readOneCart);
router.post("/carts", auth, cartController.createOneCart);
router.put("/carts/:qrCode", auth, cartController.replaceOneCart);
router.patch("/carts/:qrCode", auth, cartController.updateOneCart);
router.delete("/carts/:qrCode", auth, cartController.deleteOneCart);

export = router;