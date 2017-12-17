import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../models/UserModel";


// configure the passport module
passport.use(new LocalStrategy({usernameField: 'email'}, (username, password, done) => {
    User.findOne({email: username}).then((user: any) => {
        if (!user) {
            return done(null, false, {message: "Incorrect username"});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: "Incorrect password"});
        }
        // success
        return done(null, user);
    }).catch((err: Error) => {
        return done(err);
    });
}));