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
    id: 1, 
    name: 'Billy Loomis',
    age: 51,
    username: 'surprisesydney51',
    favMovies: [ 1 ]
  },
  {
    id: 2, 
    name: 'Danny Madigan',
    age: 40,
    username: 'iminamovie40',
    favMovies: [ 2 ]
  },
  {
    id: 3, 
    name: 'Mia Wallace',
    age: 50,
    username: 'dontdodrugs50',
    favMovies: [ 3 ]
  },
  {
    id: 4, 
    name: 'Leo Getz',
    age: 78,
    username: 'wtuneedleogetz78',
    favMovies: [ 4 ]
  },
  {
    id: 5, 
    name: 'Raymond Babbit',
    age: 83,
    username: '20mins2wapner',
    favMovies: [ 1, 5, 2 ]
    }
];

//Just as a test--not as part of the assignment--I tried to create a GET route that returns a user data by userId, but when I start my
//server, set my HTTP request type to GET, and use the http://localhost:8080/users/1 (to try to retieve data for Billy Loomis) the only thing
//that is returned is "1" ("1" is also returned if I try to http://localhost:8080/users/2, 3, 4, etc. I'm thinking that the "1" that is 
//returned doesn't have anything to do with the id. 
//Conversely, I tried this successfully with /users/:username; used 20mins2wapner for username placeholder and Postman retrieved object, though favMovies
//array did not return the movie with the *ids* of 1, 5 & 2 (Black Panther, Jaws * Knives Out)
//So, two issues: 1) unable to use :userId placeholder to target and return data by the "id" property; 2) in the data that is returned 
//successfully when I go by :username & "return user.username === req.params.username"), the favMovies array is listed as "[ 1, 5, 2 ]" not
// "['id: 1, name: 'Black Panther'..., id: 5, name: 'Jaws'..., id: 2, name: 'Knives Out'...]. Should it do that if the numbers listed in our
//favMovies array are supposed to relate to the movies in the movies array with those same ids? Am I constructing my favMovies array wrong?? 
//That's my guess...I'm just not sure how to rectify the issue...
app.get('/users/:userId', (req, res) => {
  res.json(users.find((user) => 
    { return user.id === req.params.userId }));
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

//PUT route that allows new users to update their username by their name (we can do this for the sake of testing as username, name and id are
//are nested at the same level of our object. ) I tried to compare this to the student API in the lesson: there they are updated the grade
//; here I am updating the username. Those are nested at *different* levels though, so there is no problem for them to use the endpoint of
// /students/:name/:class/:grade. That said, I am not finding anything comparable in the lesson that shows how to target a property of an object with 
//a property that is at the *same level* of that object (as name and id are with username). This is an unresolved lack of understanding that I have...
app.put('/users/:name', (req, res) => {
  let user = users.find((user) => { return user.name === req.params.name });
    if (user) {
      res.status(200).send('User ' + user.name + ' now has the username of ' + user.username + '.');

    } else {
        res.status(404).send('User # ' + req.params.userId + ' was not found');
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
  let favorite = favMovies.find((movieId) => { return  === req.params.id });
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
