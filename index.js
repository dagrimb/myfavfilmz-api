const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
const { indexOf } = require('lodash');

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
    username: 'dontdodrugs50',
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

//GET route that returns a list of all users
app.get('/users', (req, res) => {
  res.json(users);
  });

//GET route that returns a list of all users by id
app.get('/users/:userId', (req, res) => {
  res.json(users.find((user) => 
    { return '' + user.id === req.params.userId }));
  });

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

//PUT route that allows new users to update their username by userId
app.put('/users/:userId', (req, res) => {
  let user;
  for (let index = 0; index < users.length; index++) {
    if (users[index].id === req.params.userId) {
      users[index].username = req.body.username;
      user = users[index];
    }
  }
  //if the user exists
  if (user) {
    //send a status code of 200 and a message that so and so now has a different username
    res.status(200).send('User ' + user.name + ' now has the username of ' + user.username + '.');
  } else {
    //send an error status code of 404 with a message that the user at the with the real name that was entered
    //was not found 
    res.status(404).send('User id# ' + req.params.userId + ' was not found');
  }
});

//POST route that allows users to add a movie to their list of favorites
app.post('/users/:userId/favMovies', (req, res) => {
  let movie = movies.find((movie) => { return movie.id === Number(req.body.movieId) });
  let user = users.find((user) => { return user.id === Number(req.params.userId) });
  if (!movie) {
    const message = "This movie does not exist in our database";
    res.status(404).send(message);
  } else if (!user) {
    const message = "This user does not exist in our database";
    res.status(404).send(message);
  } else if (user.favMovies.includes(movie.id)) {
    const message = "This movie is already in your favorites.";
    res.status(400).send(message);
  } else {
    user.favMovies.push(movie.id);
    const message = `The user ${user.name} has a new favorite movie.`
    res.status(200).send(message);
  }
});

//DELETE route that allows users to remove a movie from their list of favorites
app.delete('/users/:userId/favMovies/:movieId', (req, res) => {
  let user = users.find((user) => { return user.id === Number(req.params.userId) });
  //the variable "movie" is set to finding the movie in the movies array that has a movie.id === to the movieId entered in the URL
  let movie = movies.find((movie) => { return movie.id === Number(req.params.movieId) });
  if (!movie) {
    const message = "There is no movie with this id in the database";
    res.status(404).send(message);
  } else if (!user) {
    const message = "This user does not exist in our database";
    res.status(404).send(message);
  } else if (!user.favMovies.includes(movie.id)) {
    const message = "There is no movie with this id in this user's favorites";
    res.status(400).send(message);
  } else {      
    const userIndex = users.findIndex(user => user.id === Number(req.params.userId));
    users[userIndex].favMovies = users[userIndex].favMovies.filter(movieId => movieId !== Number(req.params.movieId));
    const message = `The movie ${movie.name} has been deleted from user ${user.name}'s list of favorites.`
    res.status(200).send(message);
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
