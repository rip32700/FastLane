import { Store } from "../src/models/StoreModel";
import { Cart } from "../src/models/CartModel";
import { expect } from "chai";
import "mocha";
const chai = require("chai");
const chaiHttp = require("chai-http");
import * as Promise from "bluebird";
import { app, token } from "./BaseTest.test";

// configure
chai.use(chaiHttp);

const cartData = {
    qrCode: "1234",
    storeId: ""
};
const storeData = {
    name: "Test Store",
    apiUrl: "http://localhost:9000/api"
};

describe("Test Cart Controller", () => {

    before(function(done) {
        // create store which is used to associate the cart with
        new Store(storeData).save().then((store: any) => {
            cartData.storeId = store._id;
            done();
        });
    });
    after(function(done) {
        const p1 = Store.findOneAndRemove(storeData);
        const p2 = Cart.findOneAndRemove(cartData);
        Promise.all([p1, p2]).then(() => {
           done();
        });
    });

    describe("tests POST to /carts to create a new cart", () => {
        it("creating a new cart with valid fields should yield 201", (done) => {
            chai.request(app)
                .post("/api/carts")
                .send(cartData)
                .set({"Authorization": "Bearer " + token })
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(201);
                    done();
                });
        });
        it("creating same cart again should result in 409", (done) => {
            chai.request(app)
                .post("/api/carts")
                .send(cartData)
                .set({"Authorization": "Bearer " + token })
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(409);
                    done();
                });
        });
        it("creating a cart with an invalid store ID should yield 404", (done) => {
            cartData.storeId = "abcdefg1234567";
            chai.request(app)
                .post("/api/carts")
                .send(cartData)
                .set({"Authorization": "Bearer " + token })
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(404);
                    done();
                });
        });
        it("creating a cart with a missing field should yield 400", (done) => {
            delete cartData.storeId;
            chai.request(app)
                .post("/api/carts")
                .send(cartData)
                .set({"Authorization": "Bearer " + token })
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
});