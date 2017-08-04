var _ = require('../../libs/lodash.min.js'),
    request = require('request'),
    expressValidator = require('express-validator'),
    errorHandling = require('../../libs/error-handler.js'),
    helloWorldModel = require('../../models/hello-world.model');

function validateRequest(req, res) {
    var result = req.check({
        'firstName': {
            isNotBlank: {
                errorMessage: 'field-required'
            },
            isString: {
                errorMessage: 'field-isstring'
            },
            isLength: {
                options: [{ min: 2, max: 40 }],
                errorMessage: 'field-lengthlimit'
            },
            errorMessage: 'firstName is invalid'
        },
        'lastName': {
            isNotBlank: {
                errorMessage: 'field-required'
            },
            isString: {
                errorMessage: 'field-isstring'
            },
            isLength: {
                options: [{ min: 2, max: 40 }],
                errorMessage: 'field-lengthlimit'
            },
            errorMessage: 'firstName is invalid'
        }
    });

    var errors = req.validationErrors();
    if (errors) {
        errorHandling.throwValidationError(res, errors);
        return false;
    }
    return true;
}

function handleRequest(res, data) {

    return res.status(200).json(
        createResponse(helloWorldModel.data(data)));

}

function createResponse(result) {
    return {
        "requestId": Date.now(),
        "success": true,
        "data": result
    };
}

module.exports.allowedRequestFields = ["firstName", "lastName"];
module.exports.validateRequest = validateRequest;
module.exports.handleRequest = handleRequest;