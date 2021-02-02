const express = require('express');
  //morgan = require('morgan');
const app = express();

//app.use(morgan('common'));

app.use('/documentation', express.static('public'));


//GET route that returns data about top 10 movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

//GET ROUTE that returns text header to data response
app.get('/', (req, res) => {
    res.send('Here are your Top Ten Movies:')
})


app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
}); 


/*Use express.static to serve your “documentation.html” file from the public folder (rather than using the http, url, and fs modules).
If you run your project from the terminal, you should be able to navigate to “localhost:[portnumber]/documentation.html”. Test that the correct file loads in your browser

app.use('/myAwesomeStaticFiles', express.static('public'));


*/