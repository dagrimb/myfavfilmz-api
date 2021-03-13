//importing package
const mongoose = require('mongoose');

//defining a schema for documents in the "Movies" collection
let movieSchema = mongoose.Schema({
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
    //Actors attribute (when you redo database with objectId, change what's in array to [{ type mongoose.Schema.Types.ObjectId, ref: 'Movie' })
    Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }], 
    //Score
    Rotten_Tomatoes_score: String,
    //Year of Release
    Year: String
});

let actorSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Bio: String,
    Birth: String,
    Source: String,
    ImagePath: String,     
});


//defining a schema for documents in the "Users" collection
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

let Movie = mongoose.model('Movie', movieSchema);
let Actor = mongoose.model('Actor', actorSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.Actor = Actor;
module.exports.User = User;
