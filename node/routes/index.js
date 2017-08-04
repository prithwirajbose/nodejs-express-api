const routes = require('express').Router();

var _ = require('../libs/lodash.min.js');
var errorHandling = require('../libs/error-handler.js');
var helloWorld = require('../controllers/hello-world/hello-world');

function setupHeader(res) {
    res.setHeader('Content-Type', 'application/json');
}

function checkRequestParamNames(req, res, controller) {
    console.log(controller.allowedRequestFields);
    var failedKeys = '';
    var comma = '';
    if (_.has(controller, 'allowedRequestFields') && _.isArray(_.get(controller, 'allowedRequestFields'))) {
        var allowedRequestFields = _.get(controller, 'allowedRequestFields');
        if (req.body) {
            for (var key in req.body) {
                if (req.body.hasOwnProperty(key)) {
                    if (!_.includes(allowedRequestFields, key)) {
                        failedKeys += comma + key;
                        comma = ', ';
                    }
                }
            }
        }
    }
    if (!_.isNil(failedKeys) && failedKeys.length > 0) {
        res = errorHandling.requestError(res, { "msg": "request-param-not-allowed", "param": failedKeys });
        return false;
    }
    return true;
}

/**
 * Route:: Root Context
 */
routes.get('/', function(req, res) {
    return res.status(200).json({
        "status": 'success',
        "results": 'NodeJS API says Hello'
    });
});

/**
 * Route:: Hello World Route
 */
routes.post('/service/hello-world', function(req, res) {
    if (!checkRequestParamNames(req, res, helloWorld)) {
        return res;
    }
    setupHeader(res);

    if (helloWorld.validateRequest(req, res)) {
        return helloWorld.handleRequest(res, req.body);
    }

});


module.exports = routes;