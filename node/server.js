var PORT = 9000;

var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    expressValidator = require('express-validator');

//Include routes and controllers
routes = require('./routes'),
    controllers = require('./controllers');

//Other Libraries
var errorHandling = require('./libs/error-handler.js');
var customValidators = require('./libs/custom-validators.js');

//Create Express App
var app = express();

//Parse Input as JSON
app.use(bodyParser.json({ extended: true }));
//catch express errors
app.use(errorHandling.globalError);
app.use(cors());

//Custom Validators
app = customValidators.injectCustomValidators(app);

//Setup Routes
app.use('/', routes);

var server = app.listen(PORT, function() {
    // console.log(server.address().address);
    console.log('NodeJS API Running on port ' + PORT);
});
module.exports = server;