import { expect } from "chai";
import "mocha";
const chai = require("chai");
const chaiHttp = require("chai-http");
import { User } from "../src/models/UserModel";

import { app, testUserData } from "./BaseTest.test";

// configure
chai.use(chaiHttp);

// data dict that is used for registration
const data = {
    "firstName": "Tester First Name",
    "lastName": "Tester Last Name",
    "email": "tester@test.de",
    "password": "MySuperT3stPw",
    "nickName": "Tester Nick Name",
    "streetName": "Tester Street",
    "streetNumber": 1,
    "cityName": "Tester City",
    "zip": 10000,
    "birthDate": "01/01/2000"
};

describe("Test Authentication Controller", () => {

    before(function(done) {
        User.findOneAndRemove({email: "tester@test.de"}).then(() => {
            done();
        });
    });
    after(function(done) {
        User.findOneAndRemove({email: "tester@test.de"}).then(() => {
            done();
        });
    });

    describe("tests registering at /register", () => {
        it("registers a user with correct fields", (done) => {
            chai.request(app)
                .post("/api/register")
                .send(data)
                .end(function(err: Error, res: Response) {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property("token");
                    done();
                });
        });
        it("registering duplicate user should result in 409 error", (done) => {
            chai.request(app)
                .post("/api/register")
                .send(data)
                .end(function(err: Error, res: Response) {
                    expect(res).to.have.status(409);
                    done();
                });
        });
        it("login should now work with that user", (done) => {
            chai.request(app)
                .post("/api/login")
                .send({email: data.email, password: data.password})
                .end(function(err: Error, res: Response) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("token");
                    done();
                });
        });
        it("registering should fail with a 400 if a field is missing", (done) => {
            delete data.firstName;
            chai.request(app)
                .post("/api/register")
                .send(data)
                .end(function(err: Error, res: Response) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
        it("registering should fail with a 400 if a password is not long enough", (done) => {
            data.password = "1234";
            chai.request(app)
                .post("/api/register")
                .send(data)
                .end(function(err: Error, res: Response) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
    describe("tests logging in at /login", () => {
        it("logging in with valid user should result in 200", (done) => {
            chai.request(app)
                .post("/api/login")
                .send({email: testUserData.email, password: testUserData.password})
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("token");
                    done();
                });
        });
        it("logging in with invalid email should yield 400", (done) => {
            chai.request(app)
                .post("/api/login")
                .send({email: "bla", password: testUserData.password})
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
        it("logging in with invalid password should yield 400", (done) => {
            chai.request(app)
                .post("/api/login")
                .send({email: testUserData.email, password: "bla"})
                .end(function (err: Error, res: Response) {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });
});