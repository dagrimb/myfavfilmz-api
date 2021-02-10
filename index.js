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
  let movie = movie.find((movie) => 
    { return movie.name === req.params.name });

  if (movie) {
    let description = movie.description

    res.status(201).send('Synopsis: ' + description);
  } else {
    res.status(404).send('Description for ' + req.params.name + ' was not found.');
  }
});

//GET route that returns a movie genre
app.get('/movies/:name/genre', (req, res) => {
  let movie = movie.find((movie) =>
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
  let movie = movie.find((movie) =>
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
  let movie = movie.find((movie) =>
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

//PUT route that allows new ysers to update their username
app.put('/users/:name/:username', (req, res) => {
  let user = users.find((user) => { return users.name === req.params.name });
    if (user) {
      user.username[req.params.username] = parseInt(req.params.newname);
      res.status(201).send('User' + req.params.name + ' now has the username of ' + req.params.newname);
    } else {
        res.status(404).send('User with the name ' + req.params.name + ' was not found');
    }
});

//POST route that allows users to add a movie to their list of favorites
app.post('/users/:name/:username/:favorites', (req, res) => {
  let newFilm = req.body;
  if (!newFilm.name) {
    const message = 'Please include the name of your film';
    res.status(400).send(message);
  } else {
      newFilm.id = uuid.v4();
      favorites.push(newFilm);
      res.status(201).send(newFilm);
  }
});

//DELETE route that allows users to remove a movie from their list of favorites
app.delete('/users/:name/:username/:favorites', (req, res) => {
  let favorite = favorites.find((favorite) => { return favorite.id === req.params.id });
  
  if (favorite) {
    favorites = favorites.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie # ' + res.params.id + ' was deleted');
  }
});

//DELETE route that allows existing user to de-register
app.delete('/users/:name', (req, res) => {
  let user = users.find((name) => { return name.id === req.params.id });
  
  if (user) {
    users = users.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('User # ' + res.params.id + ' was de-registered');
  }
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
}); 
