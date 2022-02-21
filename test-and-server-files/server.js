/**  
 * @file imports http module and listens for requests on port 8080
*/


/**
 * require and configure dotenv
 * @function require
 * @requires dotenv
*/
require('dotenv').config()


/** Import http, file system and url modules
 * @constant
 * @requires module:http @instance
 * @requires module:fs @instance
 * @requires module:url @instance
 * @returns {url object}
 * @returns {appropriate file as response}
*/
const http = require('http'); //create a the var http and assign it to an instance of the HTTP module (what imports the HTTP module and allows one to use its function in createServer())
    fs = require('fs'),
    url = require('url');


/**
 * Call createServer function on http module and set q to the parsing of the url
 * @augments Date
 * @callback
 * @function console.log()
 * @returns {response from server}
 * @returns {whether or not name of the path includes the word "documentation"}
 * @returns {documentation.html if the name of the path does include the word "documentation"}
 * @returns {index.html if the name of the path does not include the word "documentation"}
*/
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