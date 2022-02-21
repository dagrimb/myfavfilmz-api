/**
 * @file is the entry point of package (where all code is executed)
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
 * @function require
 * @requires module:/models
 * @type {string}
*/
const Models = require('./models.js');


/** @constant
 * @default
 * @type {object}
*/
const Movies = Models.Movie; // movie model defined in models.js


/** @constant
 * @default
 * @type {object}
*/
const Users = Models.User; // user model defined in models.js

/**
 * Allow Mongoose to connect to database to perform CRUD operations on the documents in the API (i.e. integrates API and database)
 */
//mongoose.connect('mongodb://localhost:27017/myfavfilmz', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // ensure connection URI not exposed in file
mongoose.set('useFindAndModify', false);


/** @constant
 * @default
 * @function require
 * @requires module:express @instance
 * @type {string}
*/
const express = require('express'); // import express module locally so it can be used within the file


/** @constant
 * @default
 * @function require
 * @requires module:cors
 * @type {string}
*/
const cors = require('cors');


/** @constant
 * @default
 * @type {string}
*/
const app = express();  // declare variable that houses Express's functionality to configure web server


/**  
 * @function app.use() @instance
*/
app.use(express.json()); //Used to parse JSON bodies


/** @constant
 * @default
 * @function require
 * @requires module:passport
 * @type {string}
*/
const passport = require('passport'); // require and import passport.js file
require('./passport');


/**  
 * @function app.use()
*/
app.use(express.static('public')) // automatically route all requests for static files to their corresponding files within the "public" folder on the server


/** Error-handling middleware function
 * @callback passes error & response
 * @function app.use() @instance
 * @function res.status()
 * @method USE
 * @name use
 * @param {*} router 
 * @param {string} response Contains error message upon failure
*/
app.use((err, req, res, next) => {
  console.error(err.stack); // log information about the current error to the terminal
  res.status(500).send('We have a problem here....');
})

// Give certain domains access to the application
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'https://myfavfilmz.herokuapp.com/', 'http://localhost:1234', 
'https://myfavfilmz.herokuapp.com/login', 'http://myfavfilmz.herokuapp.com/movies', 'https://myfavfilmz.herokuapp.com/users', 'https://myfavfilmz.netlify.app',
'http://localhost:4200', 'https://dagrimb.github.io'];


/**
 * @augments Error
 * @callback
 * @function app.use() @instance
 * @returns {callback}
*/
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

/** 
 * Ensure that Express is available in auth.js file
 * @function require
 * @requires /auth
*/
let auth = require('./auth')(app);


/** @constant
 * @default
 * @function require
 * @requires express-validator
 * @type {object}
*/
const { check, validationResult } = require('express-validator'); // import express-validator library


/**
  * Route for getting the homepage
  * @callback passes response
  * @function res.send()
  * @function app.get()
  * @method GET
  * @name get/
  * @param {*} router
  * @param {string} response Welcome greeting
  * @returns {string} Welcome greeting 
*/
app.get('/', (res) => {
  res.send('Welcome to myfavfilmz!');
});


/**
 * @callback passes response
 * @description Route for getting all movies as the user navigates to the homepage
 * @function app.get()
 * @function res.status()
 * @method GET
 * @name get/movies
 * @param {*} router
 * @param {array} movies (response)
 * @returns {array} A list of all movies to user (response): [ { "Description": { "Synopsis": "_____.", "Source": "_____" },
   "Genre": { "Name": "_____", "Description": "_____.", "Source": "_____", "ImagePath": "_____" }, "Director": { "Name": "_____",
   "Bio": "_____.", "Birth": "____", "Source": "______", "ImagePath": "______.jpg" }, "Users": [], "Actors": ["_____", "_____"],
   "_id": "_____", "Title": "______", "ImagePath": "______.png", "Featured": true or false, "Rotten_Tomatoes_score": "__%", "Year": "____"
   },....[contined until end of collection] ]
*/
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


/**
 * @callback passes request & response
 * @description Route for getting a particular movie by title when the user selects it from a moviecard
 * @function returns:res.json(movies)
 * @function app.get()
 * @function res.status()
 * @method GET
 * @name get/movie/:Title
 * @param {*} router 
 * @param {array} movies (response)
 * @param Title
 * @returns {object} A particular movie to the user: { "Description": { "Synopsis": "_____.", "Source": "_____" },
   "Genre": { "Name": "_____", "Description": "_____.", "Source": "_____", "ImagePath": "_____" }, "Director": { "Name": "_____",
   "Bio": "_____.", "Birth": "____", "Source": "______", "ImagePath": "______.jpg" }, "Users": [], "Actors": ["_____", "_____"],
   "_id": "_____", "Title": "______", "ImagePath": "______.png", "Featured": true or false, "Rotten_Tomatoes_score": "__%", "Year": "____"
   }
*/
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @callback passes request & response
 * @description Route for getting a particular movie's description
 * @function returns:res.json(movie.Description)
 * @function app.get()
 * @function res.status()
 * @method GET
 * @name get/movies/:Title/Description
 * @param {*} router
 * @param {object} movie (response)
 * @param Title
 * @returns {object} the description of a single movie by title to the user: { "Synopsis": "_____", "Source": "______" }
*/
app.get('/movies/:Title/Description', passport.authenticate('jwt', { session: false }), (req, res) => {
//Needs to assign what it finds based on the parameter to the variable "movie"
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.json(movie.Description);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


/**
 * @callback passes request & response
 * @description Router for getting a particular movie's genre
 * @function app.get()
 * @function res.status()
 * @function returns:res.json(movie.Genre)
 * @method GET
 * @name get/movies/:Title/Genre
 * @param {*} router 
 * @param Title
 * @param {object} movie (response)
 * @returns {object} a particular movie's genre with a description of it: { "Name": "_____", "Description": "______", "Source": "_____",
   "ImagePath": "_____.jpg"}
*/
app.get('/movies/:Title/Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * @callback passes request & response
 * @description Router for getting a particular movie's director
 * @function returns:res.json(movie.Director)
 * @function app.get()
 * @function res.status()
 * @method GET
 * @name get/movies/:Title/Director
 * @param {*} router 
 * @param {object} movie (response)
 * @param Title
 * @returns {object} data about a particular movie's director with a description of it: { "Name": "_____", "Bio": "_____", 
   "Birth": "____", "Source": "_____", "ImagePath": "______.jpg"}
*/
app.get('/movies/:Title/Director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});


/**
 * @callback passes request & response
 * @description Router for getting a particular movie's image
 * @function returns:res.json(movie.ImagePath)
 * @function app.get()
 * @function res.status()
 * @method GET
 * @name get/movies/:Title/Image
 * @param {*} router 
 * @param {object} movie (response)
 * @param Title
 * @returns {string} Link for movie's poster image: "https:_____.jpg"

*/
app.get('/movies/:Title/Image', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie.ImagePath);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});

/**
 * @callback passes request & response
 * @description Router for getting a a list of all users (note: for tests only; to be commented out and not included among public endpoints)
 * @function returns:res.json(users)
 * @function app.get()
 * @function res.status()
 * @method GET
 * @name get/users/
 * @param {*} router 
 * @param Users
 * @param {array} users (response)
 * @returns {array} A list of all users in the user collection
*/
app.get('/users', /*passport.authenticate('jwt', { session: false }),*/(req, res) => {
  Users.find({ Users: req.params.Users })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * @callback passes request & response
 * @description Router for creating a new user via the user registration form
 * @function
 * @function res.status()
 * @instance @method hashPassword
 * @instance @method validatePassword
 * @method POST
 * @name post/users/
 * @param {*} router
 * @param {object} (request) @example {"Username": myusername, "Password": fkasdflakdf, "Email": myuser55@gmail.com, "Birthday": "1999-01-01"}  
 * @param {object} user (response)
 * @returns {string} Message that user registration was either successful or unsuccessful
 * @returns {object} as response if sucessful: { "FavoriteMovies": [], "_id": "_____", "Username": "_____",
   "Password": "_____", "Email": "_____@_____.com", "Birthday": "YEAR-MO-DAT00:00:00.000Z",
   "__v": 0
 }
*/
app.post('/users',
  [ //validation logic that makes sure that each required field contains characters and is correct format
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {
  //check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  //Hash password entered by user when registering before storing it in db
  let hashedPassword = Users.hashPassword(req.body.Password);
  //check to see if user with that username already exists
  Users.findOne({ 
      $or: [{
        Username: req.body.Username
      }, {
        Email: req.body.Email
      }]
    }).then((user) => {
    //check to see if the username does or does not already exist
    if (user) {
      let errors = {};
      if (user.Username === req.body.Username) {
        errors.Username = 'A user with the username ' + req.body.Username + ' already exists';
      } else {
        errors.Email = 'A user with the email ' + req.body.Email + ' already exists';
        }
        return res.status(400).json(errors);
      } else {
      //create a new user
      Users
        .create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        //let client know if request was successful
        .then((user) => {res.status(201).json(user) })
        //handle and errors that occur
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});


/**
 * @callback passes request & response
 * @description Router for getting a particular user by username after login
 * @function res.json(users)
 * @function app.get()
 * @function res.status()
 * @method GET
 * @name get/users/:Username
 * @param {*} router 
 * @param {array} users (response)
 * @param Username
 * @returns {string} Message that user was or was not found
 * @returns {object} as response if sucessful: { "FavoriteMovies": [], "_id": "_____", "Username": "_____",
   "Password": "_____", "Email": "_____@_____.com", "Birthday": "YEAR-MO-DAT00:00:00.000Z",
   "__v": 0
 }

*/
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  //find a user by the username that is passed
  Users.findOne({ Username: req.params.Username })
    //retrieve data for the client
    .then((users) => {
      res.json(users);
    })
    //handle any errors that occur
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * @callback passes request & response
 * @description Router for updating a particular user's information by username
 * @function res.json(updatedUser)
 * @function res.status()
 * @method PUT
 * @name put/users/:Username
 * @param {*} router
 * @param Username 
 * @param {object} (request) @example {"Username": myusername, "Password": fkasdflakdf, "Email": myuser55@gmail.com, "Birthday": "1999-01-01"}  
 * @returns {string} Message that user information update was either successful or unsuccessful
 * @returns {object} as response if sucessful: { "FavoriteMovies": [], "_id": "_____", "Username": "_____",
   "Password": "_____", "Email": "_____@_____.com", "Birthday": "YEAR-MO-DAT00:00:00.000Z",
   "__v": 0
 }
*/

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), 
  [ //validation logic that makes sure that each required field contains characters and is correct format
    check('Username', 'Username consisting of a minimum of five numbers and letters is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric()
  ],
  (req, res) => {
    //check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
   //Hash password entered by user when registering before storing it in db
   let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set: 
        {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true }, 
        (err, updatedUser) => {
          if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
          } else {
            res.json(updatedUser);
          }
      });
    });


/**
 * @callback passes request & response
 * @description Router for updating a particular user's information by username
 * @function app.get()
 * @function res.status()
 * @method GET
 * @name get/users/:Username/Movies
 * @param {*} router 
 * @param Username
 * @param {array} user (response)
 * @returns {array} response: "FavoriteMovies": []
*/
app.get('/users/:Username/Movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Needs to assign what it finds based on the parameter to the variable "movie"
  Users.findOne({Username: req.params.Username})
  .populate('FavoriteMovies')
    .then((user) => {
      res.status(200).json(user.FavoriteMovies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


/**
 * @callback passes request & response
 * @description Router for updating a particular user's information by username
 * @function res.json(updatedUser)
 * @function res.status()
 * @method POST
 * @name post/users/:Username/Movies/:MovieID
 * @param {*} router 
 * @param Username
 * @param MovieID (request)
 * @returns {string} Message that movie update was either successful or not (response)
*/

app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  }, 
  { new: true }, 
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
  });
});


/**
 * @callback passes request & response
 * @description Route that allows users to delete a movie from their list of favorites
 * @function res.json(updatedUser)
 * @function res.status()
 * @method DELETE
 * @name delete/users/:Username/Movies/:MovieID
 * @param {*} router 
 * @param Username
 * @param MovieID
 * @returns {string} Message that movie deletion was either successful or not (response)

*/
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, 
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
  });
});

/**
 * @callback passes request & response
 * @description Route that allows an existing user to delete their account
 * @function res.status()
 * @method DELETE
 * @name delete/users/:Username
 * @param {*} router 
 * @param {object} user
 * @param Username
 * @return {string} Confirmation that user was either deleted or the deletion failed (response)
*/
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(user.Username + ' was not found');
      } else {
        res.status(200).send(user.Username + 'was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });


  const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
   console.log('Listening on Port ' + port);
  });
