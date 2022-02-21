/**
 * @file is for configuring passport strategies
 */

/** @constant
 * @default
 * @function require
 * @requires module:passport
 * @requires module:passport-local
 * @requires module:/models
 * @requires module:passport-jwt
 * @type {string}
*/
const passport = require('passport'),
    //define basic HTTP authentication for login requests
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

/**
 * Router for creating a new session login through the login form
 * @augments LocalStrategy
 * @callback passes error & user
 * @function console.log()
 * @returns {string}
*/
passport.use(new LocalStrategy({ // take username and password from request body and use Mongoose to check DB for user with same username
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
        //hash password entered by user when logging in before comparing it to the pw stored in db
        if (!user.validatePassword(password)) {
            console.log('incorrect password');
            return callback(null, false, {message: 'Incorrect password.'});
        }

        console.log('finished');
        return callback(null, user);
    });
}));


/**
 * Set up JSON Web Token authentication code and allow app to authenticate users based on the token submitted with their request
 * Router for creating a new session login through the login form
 * @augments JWTStrategy
 * @callback
 * @returns {string}
*/
  passport.use(new JWTStrategy({
      //extract JWT bearer token from header of HTTP request
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      //use secret key to verify the signature of the JWT (i.e. that the client is who they say they are) and that the JWT has not been altered
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