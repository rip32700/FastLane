const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const indoorLocationSchema = new Schema({
    location: String        // TODO: which format exactly
});

const productSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    barcode: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description:   {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        data: Buffer,
        contentType: String
    },
    indoorLocation: indoorLocationSchema,
});

export const Product = mongoose.model("Product", productSchema );