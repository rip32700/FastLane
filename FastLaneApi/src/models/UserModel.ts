import * as mongoose from "mongoose";
import * as crypto from "crypto";

const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        require: [true, "Email is required"]
    },
    firstName: {
        type: String,
        require: [true, "First name is required"]
    },
    lastName: {
        type: String,
        require: [true, "Last name is required"]
    },
    nickName: String,
    birthDate: Date,
    registrationDate: {
        type: Date,
        default: Date.now
    },
    phoneNumber: {
        type: String
    },
    address: {
        streetName: String,
        streetNumber: Number,
        cityName: String,
        zip: Number
    },
    password: {
        type: String,
        required: true
    },
    salt: Buffer
});


// define methods for the schema

/**
 * Sets the password for a user. First generates a salt
 * and further uses it to hash the password.
 * @param {string} password of the user
 */
userSchema.methods.setPassword = function(password: string) {
    this.salt = new Buffer(crypto.randomBytes(16).toString("hex"));
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha1").toString("hex");
};

/**
 * Checks whether the given password is valid for the user
 * by comparing the hashes.
 * @param {string} password which should be checked
 * @returns flag that indicates if the password is correct
 */
userSchema.methods.validPassword = function(password: string) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha1").toString("hex");
    return this.password === hash;
};

/**
 * Generates a JWT token for the user.
 * @returns JWT token
 */
userSchema.methods.generateJwt = function() {

    // JWT token should expire after 1 hour
    const expirationInterval =  Math.floor(Date.now() / 1000) + (60 * 60);

    // create and return the JWT token with the payload (id, email, name)
    return jwt.sign({
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        exp: expirationInterval
    }, process.env.JWT_SECRET);
};


// events
userSchema.pre("save", function(next) {
    this.setPassword(this.password);
    next();
});


export const User = mongoose.model("User", userSchema );