//During the test the env variable is set to test
// process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var chai = require('chai');
var chaiHttp = require('chai-http');

var helloWorld = require('./hello-world/hello-world.js');