const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Cart model
 * @type {"mongoose".Schema}
 */
const cartSchema = new Schema({
    qrCode: {
        type: String,
        required: true,
        unique: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: [true, "Store is required"]
    },
    model: {
        type: String,
        enum: ["BASKET", "CART"],
        required: true,
        default: "CART"
    }
});

cartSchema.index({ qrCode: 1, store: 1}, { unique: true });

export const Cart = mongoose.model("Cart", cartSchema );