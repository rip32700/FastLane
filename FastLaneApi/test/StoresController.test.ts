import { Store } from "../src/models/StoreModel";
import { expect } from "chai";
import "mocha";
const chai = require("chai");
const chaiHttp = require("chai-http");
import { app, token } from "./BaseTest.test";

// configure
chai.use(chaiHttp);

const storeData = {
    name: "Test Store",
    apiUrl: "https://localhost:9000/api/",
    impressum: "Test Impressum",
    /* location: [],
    operationHours: {
        // TODO
    }
    */
};

describe("Test Stores Controller", () => {

    before(function(done) {
        Store.findOneAndRemove(storeData).then(() => {
            done();
        });
    });
    after(function(done) {
        Store.findOneAndRemove(storeData).then(() => {
            done();
        });
    });

    describe("tests GET to retrieve all stores from /stores", () => {
        it("calling GET /carts with token should have status 200 and be an empty array", (done) => {
            chai.request(app)
                .get("/api/stores")
                .set({"Authorization": "Bearer " + token })
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
    describe("tests POST to create new store at /stores", () => {
        it("creating a store with valid fields should yield 201", (done) => {
            chai.request(app)
                .post("/api/stores")
                .send(storeData)
                .set({"Authorization": "Bearer " + token })
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property("name").that.equal(storeData.name);
                    expect(res.body).to.have.property("apiUrl").that.equal(storeData.apiUrl);
                    done();
                });
        });
        it("creating the same store again should yield 409", (done) => {
            chai.request(app)
                .post("/api/stores")
                .send(storeData)
                .set({"Authorization": "Bearer " + token })
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(409);
                    done();
                });
        });
        it("creating store with missing field should yield in 400", (done) => {
            delete storeData.name;
            chai.request(app)
                .post("/api/stores")
                .send(storeData)
                .set({"Authorization": "Bearer " + token })
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
});