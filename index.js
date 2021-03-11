const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myfavfilmz', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();
app.use(bodyParser.json());

app.use(morgan('common'));

app.use(express.static('public'))

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('We have a problem here....');
})

/*
  let movies = [
    {
      id: 1, 
      name: 'Black Panther',
      details: {
        year: 2018,
        genre: 'Action',
        director: 'Ryan Coogler'
    }
    },
    {
      id: 2,
      name: 'Knives Out',
      details: {
        year: 2019,
        genre: 'Mystery',
        director: 'Rian Johnson',
    }
  },
  {
      id: 3,
      name: 'E.T. The Extra-Terrestrial',
      details: {
        year: 1982,
        genre: 'Fantasy',
        director: 'Steven Spielberg'
      }
    },
    {
      id: 4,
      name: 'Boyhood',
      details: {
        year: 2014,
        genre: 'Drama',
        director: 'Richard Linklater'
      }
    },
    {
      id: 5,
      name: 'Jaws',
      details: {
        year: 1975,
        genre: 'Suspense',
        director: 'Steven Spielberg'
      }
    },
    {
      id: 6,
      name: 'The Rock',
      details: {
        year: 1996,
        genre: 'Action/Adventure',
        director: 'Michael Bay'
      }
    }
  ];
*/

//GET route that returns a list of ALL movies to the user
app.get('/movies', (req, res) => {
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
app.get('/movies/:Title', (req, res) => {
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
app.get('/movies/:Title/Description', (req, res) => {
//Needs to assign what it finds based on the parameter to the variable "movie"
Movies.findOne({ Description: req.params.Description })
.then((movies) => {
  res.json(movies);
})
.catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + err);
});
});

//GET route that returns a movie genre
app.get('/movies/:Title/Genre', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((genre) => {
      res.json(genre).send('Genre: ' + genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//GET route that returns info about a movie's director
app.get('/movies/:title/director', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  //if (movie) {
    //let genre = movie.genre
    .then((movies) => {
      res.json(movies).send('Director: ' + movies.title.director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//GET route that returns a movie's images
app.get('/movies/:name/images', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  //if (movie) {
    //let genre = movie.genre
    .then((movies) => {
      res.json(movies).send('Image: ' + movies.title.imagepath);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/*
  let movie = movies.find((movie) =>
  { return movie.name === req.params.name });
if (movie) {
  let image = movie.image

  res.status(201).send('Image: ' + image);
} else {
  res.status(404).send('Image for ' + req.params.name + ' was not found.');
} 
});
*/
//

/*GET route that returns data about top 10 movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//GET ROUTE that returns text header to data response
app.get('/', (req, res) => {
    res.send('Here are your Top Ten Movies:')
})
*/

/*
let users = [
  {
    id: 1, 
    name: 'Billy Loomis',
    age: 51,
    username: 'surprisesydney51',
    favMovies: [ 1, 2, 3 ]
  },
  {
    id: 2, 
    name: 'Danny Madigan',
    age: 40,
    username: 'iminamovie40',
    favMovies: [ 2, 4, 6 ]
  },
  {
    id: 3, 
    name: 'Mia Wallace',
    age: 50,
    username: 'dontdodrgs50',
    favMovies: [ 1, 3, 6 ]
  },
  {
    id: 4, 
    name: 'Leo Getz',
    age: 78,
    username: 'wtuneedleogetz78',
    favMovies: [ 1, 2, 4 ]
  },
  {
    id: 5, 
    name: 'Raymond Babbit',
    age: 83,
    username: '20mins2wapner',
    favMovies: [ 1, 3, 5 ]
    }
];
*/

//GET route that returns a list of all users
app.get('/users', (req, res) => {
  //Find all data within the users collection.
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  //catch any errors that may occur
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//POST route that allows new users to register
app.post('/users', (req, res) => {
  //check to see if user with that username already exists
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    //check to see if the username does or does not already exist
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      //create a new user
      Users
        .create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        //let client know if request was successful
        .then((user) =>{res.status(201).json(user) })
        //handle and errors that occur
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

app.get('/users/:userId', (req, res) => {
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

//PUT route that allows new users to update their username by username
app.put('/users/:userId', (req, res) => {
  Users.findOneAndUpdate({ _id: req.params.userId }, { $set: 
      {
        Username: req.body.Username,
        Password: req.body.Password,
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

//POST route that allows users to add a movie to their list of favorites
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
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

//DELETE route that allows users to remove a movie from their list of favorites
app.delete('/users/:Username/Movies/:MovieID', (req, res) => {
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

//DELETE route that allows existing user to de-register
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + 'was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
}); 
