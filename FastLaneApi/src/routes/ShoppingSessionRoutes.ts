import  * as express from "express";
import * as jwt from "express-jwt";
import { ShoppingSessionController } from "../controllers/ShoppingSessionController";
import * as dotenv from "dotenv";


dotenv.config();

const router = express["Router"]();
const auth = jwt({ secret: process.env.JWT_SECRET, userProperty: "payload" });
const shoppingSessionController = new ShoppingSessionController();

router.get("/shopping_sessions", auth, shoppingSessionController.readAllShoppingSessions);
router.get("/shopping_sessions/:shoppingSessionId", auth, shoppingSessionController.readOneShoppingSession);
router.post("/shopping_sessions", auth, shoppingSessionController.createOneShoppingSession);
router.put("/shopping_sessions/:shoppingSessionId", auth, shoppingSessionController.replaceOneShoppingSession);
router.patch("/shopping_sessions/:shoppingSessionId", auth, shoppingSessionController.updateOneShoppingSession);
router.delete("/shopping_sessions/:shoppingSessionId", auth, shoppingSessionController.deleteOneShoppingSession);

export = router;