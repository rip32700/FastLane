import { User } from "../src/models/UserModel";

process.env.NODE_ENV = "test";

import { Server } from "../src/Server";

const app = new Server().app;
const testUserData = {
    "firstName": "Test",
    "lastName": "Test",
    "email": "test@test.de",
    "password": "t3sting",
    "nickName": "Test",
    "streetName": "Test",
    "streetNumber": 1,
    "cityName": "Test",
    "zip": 10000,
    "birthDate": "01/01/2000"
};
let token: string;


before(function(done) {
    new User(testUserData).save().then((user: any) => {
        token = user.generateJwt();
        done();
    });
});
after(function(done) {
    User.findOneAndRemove({email: testUserData.email}).then(() => {
        done();
    });
});

export {
    app,
    testUserData,
    token
};
