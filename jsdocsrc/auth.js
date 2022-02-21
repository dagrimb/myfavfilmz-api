/**
 * @file is for housing endpoint for registered users to log in
*/

/** @constant
 * @default
 * @type {string}
 */
 const jwtSecret = 'your_jwt_secret'; // Has to be the same key used in the JWTStrategy


/** @constant
 * @default
 * @function require
 * @requires module:jsonwebtoken
 * @type {string}
*/
const jwt = require('jsonwebtoken'),
  passport = require('passport');


/** Import local passport file
 * @requires module:passport
*/ 
require('./passport'); 


/**
 * If username and password in the body of the request exist in the database, this is used to create a JWT based on the username and password
 * @callback
 * @param {object} user  
 * @returns {object}
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // Username encoded in the JWT
        expiresIn: '7d', //Specifies that the token will expire in 7 days and user will need to log-in again
        algorithm: 'HS256' // The algorithm used to sign or encode the values of the JWT
    });
}

/**
 * Router for creating a new session login through the login form, using HTTP auth and JWT generation
 * @callback passes:error&user
 * @generator
 * @function module.exports
 * @function res.send()
 * @function returns:res.json(user,token)
 * @function res.status()
 * @method POST
 * @name post/login
 * @param {*} router 
 * @param {object} request (information user enters to login: @example {"Username": myusername, "Password": fkasdflakdf})
 * @param {object} response (failure: contains error message and "false" in place of user name; success: contains user object and token)
 * @returns {object} User information and their session token upon success (response): { "user": { "FavoriteMovies": [], "_id": _____,
   "Username": "_____", "Password": "_____", "Email": "_____@_____.___", "Birthday": "YEAR-MO-DAT00:00:00.000Z", "__v": 0 }, "token": _____ }
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                //returns the token
                return res.json({ user, token });
            });
    })(req, res);
  });
}

