
//require and configure dotenv
require('dotenv').config()

//Import http, file system and url modules
const http = require('http');
    fs = require('fs'),
    url = require('url');

//Call createServer function on http module and set q to the parsing of the url
http.createServer((request, response) => {
    let addr = request.url,
        q = url.parse(addr, true),
        filePath = '';

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });
    //check to see if path name of the url includes the word "documentation"
    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    }   else {
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });

}).listen(8080);
console.log('My first test server is running on Port 8080');