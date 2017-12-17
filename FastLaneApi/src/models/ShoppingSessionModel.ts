const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Payment sub document for shopping session
 * @type {"mongoose".Schema}
 */
const paymentSchema = new Schema({
    paid: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
    },
    method: {
        type: String
    }
}, { _id : false });

const productsSchema = new Schema({
    productBarcode: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, { _id : false });

/**
 * Shopping session model
 * @type {"mongoose".Schema}
 */
const shoppingSessionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user ID is required"]
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: [true, "cart ID is required"]
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: [true, "store ID is required"]
    },
    shopping_date: {
        type: Date,
        default: Date.now
    },
    products: [productsSchema],
    total: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["CREATED", "IN_PROGRESS", "PAID", "FINISHED"],
        required: true,
        default: "CREATED"
    },
    payment: paymentSchema
});

// define methods for the schema

/**
 * Adds a product to the shopping schema
 * @param {string} product
 */
shoppingSessionSchema.methods.addProduct = (product: any) => {
    this.products.push(product);
    this.total += product.price;
};

export const ShoppingSession = mongoose.model("ShoppingSession", shoppingSessionSchema );