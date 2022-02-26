# myfavfilmz-api

myfavfilmz-api is the REST API (i.e. server-side Application Programming Interface) written from scratch for the full-stack project "myfavfilmz". It serves the client-side of the project, written in two seperate projects using both the React.js and Angular.js frameworks, respectively. The API works with an externally hosted, non-relational database that allows the client (users that are fans of films) to create accounts, log in, view the collection of movies and information (including synopsis, director, and genre), add and remove favorite movies from the collection, and edit the personal information in their profile.
The design of the API allows its URL endpoints to integrate well with the external database to enhance the application's performance and the user's experience.

<img src="https://user-images.githubusercontent.com/74441727/155753026-bc660ea7-a367-439f-a711-7933da38eacd.png" width=600>

<img src="https://user-images.githubusercontent.com/74441727/155824382-70b0cb4c-b798-46f7-88f4-593543e31cba.png" width=600>

THE API ENABLING USER INTERACTION (please review the auth.js and index.js files in the project directory for more information as to how the API does the below)
* The API's endpoints and corresponding structure allows the following user behavior:
  * New users are able to register for a new account with a username, password, email address and birthday
  * Existing users are able to log into their accounts with their username and password to do the following:
    * View a list of all movies in the movies collection with the ability to add or remove movies to/from their list of favorites from this view
    * Navigate to appropriate pages or dialogs to view the following information:
      * Movie Synopsis Details: A brief synopsis of the movie, what year it was released, and it's rating on Rotten Tomatoes.
      * Movie Director Details: A brief bio, birth year, death year (if applicable) of the movie's director
      * Movie Genre Details: A brief description of the movie's genre
    * Navigate to their user profile via a link on the user navigation bar in order to do the following:
      * View their existing user information (username, password, email address and birthday) as well as the movies the movies in their list of favorites
      * Remove movies from their list of favorites
      * Edit the afforementioned user information via a form or dialog
      * Delete their account
 
TECHNOLOGIES USED
* Node.js- a JavaScript runtime that provides JavaScript modules necessary to the functionality of the API.
* Express.js- a backend web server framework that, paired with Node.js, was used to create the API, by allowing it to handle HTTP (GET, POST, PUT, and DELETE) requests made from the client-side. It was also used to establish--in an array--what domains that could have access to the server, by implemeting CORS (Cross-Origin Resource Sharing).
* Mongoose- an Object Data Modeling (ODM) library that allows the API to handle the previously mentioned CRUD (Create, Read, Update, Delete) requests by using business logic to map to the external database cluster collections.
* Heroku- the online cloud Platform-as-a-Service (PaaS) that the API is deployed to, which allows it to be accessed on the World Wide Web. This API is connected to the external database via this platform via the database's Uniform Resource Indentifier (URI).
* Postman- to test the endpoints of the Http requests
* MongoDB Atlas- the external, non-relational database where user and movie information is stored. 

SETTING UP THE DEVELOPMENT ENVIRONMENT: What you will need
* A computer
* Wifi or a LAN connection
* A terminal (MacOS) or Command Line Interface (CLI, for PC users)

DEPENDENCIES/LIBRARIES NEEDED (Note: This is not an exhaustive list of dependencies. Please refer to the **package.lock.json"** for a detailed list of dependencies in order to re-build the app.
* NVM (Node Version Manager): This will allow you up- or down-grade your what version of Node you are using to the one with Long-Term Support
* NPM (Node Package Manager): a command line package manager that installs, publishes and/or uninstalls Node.js modules and third-party packages for use in the API.
  * The command **npm help** will provide you with a list of available commands
* Express.js
* Body Parser: middleware responsible for parsing (i.e. reading) the incoming JSON request bodies attached to endpoints before they are handled and returned as JSON reponses.
* Uuid (Universally Unique Identifier): a module installed necessary to generate unique IDs for objects created in the movies or users collection via POST requests (user registrations and general movie collection updates).
* Morgan: a Node.js and Express.js middleware to easily allow the logging of HTTP requests and errors
* Mongoose 
* Passport: middleware used for authorizing requests with JSON Web Token (JWT)-based authentication. You will also need install a Passport strategy for using JSON Web Tokens to authenticate (see installation guide below).
**Please refer to the "DOWNLOADS/INSTALLATIONS" section for information regarding what commands/processes to use to begin implementing these dependencies.**

WHAT YOUR **package.json** SHOULD LOOK LIKE

{
  "name": "movie-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "axios": "^0.21.1",
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "dotenv": "^8.6.0",
    "eslint": "^7.18.0",
    "express": "^4.17.1",
    "express-validator": "^6.10.0",
    "jsonwebtoken": "^8.5.1",
    "lodash": "^4.17.20",
    "mongoose": "^5.11.15",
    "morgan": "^1.10.0",
    "passport": "^0.4.1",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "save": "^2.4.0"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/dagrimb/myfavfilmz.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/dagrimb/myfavfilmz/issues"
  },
  "homepage": "https://github.com/dagrimb/myfavfilmz#readme"
}


DOWNLOADS/INSTALLATIONS (first download the project to your computer)
* nvm (Node Version Manager): see https://github.com/nvm-sh/nvm for details
  * MacOS Users need to create an Apple Developer account: https://developer.apple.com/account/. Open the App Store, confirm that you're signed in with the created account and, if not, enter your system's user account password.
* nvw-windows installer: Windows PC users need to download this. Make sure that the file you download is the "nvm-windows.zip" file of the newest release available.
* Xcode: MacOS users will need to download XCode from the App Store in order to make use of the dev tools provided by Apple.
* Node Package Manager: **npm install -g npm**
* Express.js: **npm install -- save express**
* Body Parser: **npm install -- save body-parser**
  * Note: Express.js and Body Parser, along with Uuid can be installed with the following command: **npm install --save express uuid body-parser**
* Morgan: **npm install morgan --save**
* Mongoose: **npm install mongoose --save**
* Passport: **npm install --save passport**
  * **npm install --save passport-local**
  * **npm install --save passport-jwt**
  * OR you can install these with JSON Web token: **npm install --save passport passport-local passport-jwt jsonwebtoken**
* Eslint: **npm install eslint --save-dev**
* Postman (optional): https://www.getpostman.com/apps for instructions

TO RUN THE PROJECT 
* Navigate to the project directory folder should read "movie-api"
* Run the following command: **node index.js**

FURTHER INFORMATION: Documentation
* For more information and instructions on how to integrate this API with your project, please review the API documentation (written in JSDoc) by naviating (either via your terminal/CLI or manually to the appropriate folder on your computer), find the out folder and open the appropriate .html file in a web browser.

Built By: David Grimberg


