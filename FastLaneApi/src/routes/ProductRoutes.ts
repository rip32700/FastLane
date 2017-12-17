import  * as express from "express";
import * as jwt from "express-jwt";
import { ProductController } from "../controllers/ProductController";
import * as dotenv from "dotenv";


dotenv.config();

const router = express["Router"]();
const auth = jwt({ secret: process.env.JWT_SECRET, userProperty: "payload" });
const productController = new ProductController();

router.get("/products", auth, productController.readAllProducts);
router.get("/products/:barcode", auth, productController.readOneProduct);
router.post("/procuts", auth, productController.createOneProduct);
router.put("/products/:barcode", auth, productController.replaceOneProduct);
router.patch("/products/:barcode", auth, productController.updateOneProduct);
router.delete("/products/:barcode", auth, productController.deleteOneProduct);

export = router;