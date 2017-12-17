import  * as express from "express";
import * as jwt from "express-jwt";
import { StoreController } from "../controllers/StoreController";
import * as dotenv from "dotenv";


dotenv.config();

const router = express["Router"]();
const auth = jwt({ secret: process.env.JWT_SECRET, userProperty: "payload" });
const storeController = new StoreController();

router.get("/stores", storeController.readAllStores);
router.get("/stores/:storeId", storeController.readOneStore);
router.post("/stores", auth, storeController.createOneStore);
router.put("/stores/:storeId", auth, storeController.replaceOneStore);
router.patch("/stores/:storeId", auth, storeController.updateOneStore);
router.delete("/stores/:storeId", auth, storeController.deleteOneStore);

export = router;