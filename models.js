//importing package
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//defining a schema for documents in the "Movies" collection
const movieSchema = Schema({
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

const actorSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Bio: String,
    Birth: String,
    Source: String,
    ImagePath: String,     
});

const bcrypt = require('bcrypt');

//defining a schema for documents in the "Users" collection
const userSchema = mongoose.Schema({
    _id: {type: String, required: true},
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
}



let Movie = mongoose.model('Movie', movieSchema);
let Actor = mongoose.model('Actor', actorSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.Actor = Actor;
module.exports.User = User;
