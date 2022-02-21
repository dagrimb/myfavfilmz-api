/**
 * @file converts code between frontend app and backend database
*/


/** @constant
 * @default
 * @function require
 * @requires module:mongoose
 * @type {string}
*/
const mongoose = require('mongoose'); 


/** @constant
 * @default
 * @type {object}
*/
const Schema = mongoose.Schema;


/** @constant
 * @default
 * @type {object}
*/
const movieSchema = Schema({ // defining a schema for documents in the "Movies" collection with its individual keys
    _id: Schema.Types.ObjectId,
    Title: {type: String, required: true},
    Description: {
        Synopsis: String, 
        Description: String,
        Source: String
    },
    //Genre attribute
    Genre: {
        Name: String,
        Description: String,
        Source: String
    },
    //Director attribute
    Director: {
        Name: String,
        Bio: String,
        Birth: String,
        Death: String,
        Source: String
    },
    //Image of poster or still image of movie
    ImagePath: String,
    Featured: Boolean,
    //Array of users that have a movie in their favorites
    Users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    //Actors attribute (when you redo database with objectId, change what's in array to [{ type mongoose.Schema.Types.ObjectId, ref: 'Movie' })
    Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }], 
    //Score
    Rotten_Tomatoes_score: String,
    //Year of Release
    Year: String
});


/** module is used to hash users' passwords and compare hashed passwords when a user logs in
 * @constant
 * @default
 * @function require
 * @requires module:bcrypt
 * @type {string}
*/
const bcrypt = require('bcrypt');


/** @constant
 * @default
 * @type {object}
*/
const userSchema = mongoose.Schema({ // defining a schema for documents in the "Users" collection with its individual keys
    Username: {type: String, required: true}, 
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

/**
 * Hashes submitted password
 * @callback
 * @returns {string} Hashed rendering of submitted password
*/
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

/**
 * Compares submitted hashed password with hashed passwords stored in DB
 * @returns {string} Juxtaposition of user password with password entered
*/
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
}

/**
 * Creates Movie collection
*/
let Movie = mongoose.model('Movie', movieSchema);

/**
 * Creates User collection
*/
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
