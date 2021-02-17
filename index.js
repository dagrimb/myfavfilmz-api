const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());
app.use(express.static('public'))

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('We have a problem here....');
})

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
    }
  ];


//GET route that returns a list of ALL movies to the user
app.get('/movies', (req, res) => {
  res.json(movies);
})

//GET route that returns a movie description
app.get('/movies/:name/description', (req, res) => {
  let movie = movies.find((movie) => 
    { return movie.name === req.params.name });

  if (movie) {
    let description = Object.values(movie.description);

    res.status(201).send('Synopsis: ' + description);
  } else {
    res.status(404).send('Description for ' + req.params.name + ' was not found.');
  }
});

//GET route that returns a movie genre
app.get('/movies/:name/genre', (req, res) => {
  let movie = movies.find((movie) =>
    { return movie.name === req.params.name });

  if (movie) {
    let genre = movie.genre

    res.status(201).send('Genre: ' + genre);
  } else {
    res.status(404).send('Genre for ' + req.params.name + ' was not found.');
  }
});

//GET route that returns info about a movie's director
app.get('/movies/:name/director', (req, res) => {
  let movie = movies.find((movie) =>
    { return movie.name === req.params.name });
  
  if (movie) {
    let director = movie.director

    res.status(201).send('Director: ' + director);
  } else {
    res.status(404).send('Director for ' + req.params.name + ' was not found.');
  }
});

//GET route that returns a movie's images
app.get('/movies/:name/images', (req, res) => {
  let movie = movies.find((movie) =>
  { return movie.name === req.params.name });

if (movie) {
  let image = movie.image

  res.status(201).send('Image: ' + image);
} else {
  res.status(404).send('Image for ' + req.params.name + ' was not found.');
} 
});

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

let users = [
  {
    name: 'Billy Loomis',
    age: 51,
    username: 'surprisesydney51',
    favMovies: [ 1 ]
  },
  {
    name: 'Danny Madigan',
    age: 40,
    username: 'iminamovie40',
    favMovies: [ 2 ]
  },
  {
    name: 'Mia Wallace',
    age: 50,
    username: 'dontdodrugs50',
    favMovies: [ 3 ]
  },
  {
    name: 'Leo Getz',
    age: 78,
    username: 'wtuneedleogetz78',
    favMovies: [ 4 ]
  },
  {
    name: 'Raymond Babbit',
    age: 83,
    username: '20mins2wapner',
    favMovies: [ 5 ]
    }
];

//GET route that returns a list of ALL movies to the user
app.get('/users', (req, res) => {
  res.json(users);
})

//POST route that allows new users to register
app.post('/users', (req, res) => {
  let newUser = req.body;
  if (!newUser.name) {
    const message = 'Please include your name';
    res.status(400).send(message);
  } else {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).send(newUser);
  }
});

//PUT route that allows new users to update their username
app.put('/users/:userId', (req, res) => {
  let user = users.find((user) => { return user.id === req.params.userId });
    if (user) {
      res.status(200).send('User ' + user.name + ' now has the username of ' + user.username + '.');

    } else {
        res.status(404).send('User with the name ' + user.name + ' was not found');
    }
});

//POST route that allows users to add a movie to their list of favorites
app.post('/users/:userId/favMovies', (req, res) => {
  let newFave = req.body;
  if (!newFave.movieId) {
    const message = 'Please include the name of your film';
    res.status(400).send(message);
  } else {
      let user = users.find((user))
      res.status(201).send(newFave);
  }
});

//DELETE route that allows users to remove a movie from their list of favorites
app.delete('/users/:username/favMovies/:movieId', (req, res) => {
  let favorite = favMovies.find((movieId) => { return movieId === req.params.movieId });
  if (favorite) {
    favMovies = favMovies.filter((obj) => { return obj.movieId !== req.params.movieId });
    res.status(201).send('Movie ' + req.params.movieId + ' was deleted');
  }
});


//DELETE route that allows existing user to de-register
app.delete('/users/:name', (req, res) => {
  let user = users.find((user) => { return user.name === req.params.name });
  
  if (user) {
    users = users.filter((obj) => { return obj.name !== req.params.name });
    res.status(201).send('User ' + req.params.name + ' was de-registered');
  }
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
}); 
