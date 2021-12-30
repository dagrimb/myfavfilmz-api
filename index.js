const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Actors = Models.Actor;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/myfavfilmz', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json()); //Used to parse JSON bodies



const passport = require('passport');
require('./passport');

app.use(express.static('public'))

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('We have a problem here....');
})


let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'https://myfavfilmz.herokuapp.com', 'http://localhost:1234', 
'https://myfavfilmz.herokuapp.com/login', 'http://myfavfilmz.herokuapp.com/movies', 'http://myfavfilmz.herokuapp.com/users', 'https://myfavfilmz.netlify.app',
'http://localhost:4200'];

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

let auth = require('./auth')(app);

const { check, validationResult } = require('express-validator');

app.get('/', (req, res) => {
  res.send('Welcome to myfavfilmz!');
});

//GET route that returns a list of ALL movies to the user
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

//GET route that returns data about a single movie by title
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

//GET route that returns a movie description
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

//GET route that returns a movie genre
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

//GET route that returns info about a movie's director
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

//GET route that returns a movie's images
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

//GET route that returns a list of all actors
app.get('/actors', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Find all data within the actors collection.
  Actors.find()
  .then((actors) => {
    res.status(201).json(actors);
  })
  //catch any errors that may occur
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//GET route that returns data about a single movie by title
app.get('/actors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Actors.findOne({ Name: req.params.Name })
    .then((actors) => {
      res.json(actors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//GET a list of all users by (note: for tests only; to be commented out and not included among public endpoints)
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


//POST route that allows new users to register
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


app.get('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  //find a user by the username that is passed
  Users.findOne({ _id: req.params.userId })
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

  app.put('/users/:userId', passport.authenticate('jwt', { session: false }), 
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
    
    Users.findOneAndUpdate({ _id: req.params.userId }, { $set: 
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

//GET route that returns a list of a user's favorite movies
app.get('/users/:userId/Movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  //Needs to assign what it finds based on the parameter to the variable "movie"
  Users.findOne({ _id: req.params.userId })
  .populate('FavoriteMovies')
    .then((user) => {
      res.status(200).json(user.FavoriteMovies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//POST route that allows users to add a movie to their list of favorites
app.post('/users/:userId/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ _id: req.params.userId }, {
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

//DELETE route that allows users to remove a movie from their list of favorites
app.delete('/users/:userId/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ _id: req.params.userId }, {
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

//DELETE route that allows existing user to de-register
app.delete('/users/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        res.status(400).send(user.userId + ' was not found');
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
