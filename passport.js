const { Error } = require('mongoose');
const passport = require('passport'),
    //define basic HTTP authentication for login requests
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
    //if the username matches the one in the database, this callback function will be executed
}, (username, password, callback) => {
    console.log(username + '  ' + password);
    Users.findOne({ Username: username }, (error, user) => {
        if (error) {
            console.log(error);
            return callback(error);
        }

        if (!user) {
            //if an error occurs or the username can't be found, this message passes to the callback 
            console.log('incorrect username');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }

        console.log('finished');
        return callback(null, user);
    });
}));

//Set up JSON Web Token authentication code and allow app to authenticate users based on the token submitted with their request
passport.use(new JWTStrategy({
    //extract JWT bearer token from header of HTTP request
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user); 
    })
    .catch((error) => {
        return callback(error)
    });
}));