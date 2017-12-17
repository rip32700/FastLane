const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const dayOperationHoursSchema = new Schema({
    startHour: {
        type: Number,
        required: true
    },
    endHour: {
        type: Number,
        required: true
    }
});

const operationHoursSchema = new Schema({
    monday: dayOperationHoursSchema,
    tuesday: dayOperationHoursSchema,
    wednesday: dayOperationHoursSchema,
    thursday: dayOperationHoursSchema,
    friday: dayOperationHoursSchema,
    saturday: dayOperationHoursSchema,
});

const storeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    apiUrl: {
        type: String,
        required: true
    },
    impressum: String,
    operationHours: operationHoursSchema,
    location: {
        type: [Number],  // [<longitude>, <latitude>]
        index: "2d"
    },
    logo: {
        data: Buffer,
        contentType: String
    }
});

storeSchema.index({ name: 1, apiUrl: 1}, { unique: true });

export const Store = mongoose.model("Store", storeSchema );