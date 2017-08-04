var ErrorHandling = {};
var _ = require('./lodash.min.js');
var appUtils = require('./app-utils.js');
// TODO - When Architect team decides how errors should be displayed
function pushErrorsArrayToErrorResponse(errs, res) {
    var responseData = {
        "errors": [],
        "success": false
    };
    if (errs && typeof(errs) == 'object') {
        if (_.isArray(errs)) {
            var param = [];
            for (var i = 0; i < errs.length; i++) {
                if (errs[i].param && !_.isEmpty(errs[i].param) && _.includes(param, errs[i].param)) {
                    continue;
                }
                param.push(errs[i].param);
                var errMsgObj = appUtils.resolveValidationErrorMessage(errs[i].msg, errs[i].param, "400");
                responseData.errors.push({
                    "errorCode": errMsgObj.errorCode,
                    "errorType": "Request Error",
                    "message": errMsgObj.errorMessage
                });
            }
        } else {
            var errMsgObj = appUtils.resolveValidationErrorMessage(errs.msg, errs.param, "400");
            responseData.errors.push({
                "errorCode": errMsgObj.errorCode,
                "errorType": "Request Error",
                "message": errMsgObj.errorMessage
            });
        }
    }
    return responseData;
}

module.exports.requestError = function(res, errors) {
    var responseData = pushErrorsArrayToErrorResponse(errors, res);
    return res.status(400).json(responseData);
};

module.exports.throwValidationError = function(res, errors) {
    var responseData = pushErrorsArrayToErrorResponse(errors, res);
    return res.status(400).json(responseData);
};

/** Used by Application for Application errors like Tier 1 Service Unavailable **/
module.exports.appError = function(res, errMsg, httpStatus) {
    var errMsgObj = appUtils.resolveAppErrorMessage(!_.isNil(errMsg) ? errMsg : 'other-error', !_.isNil(httpStatus) ? httpStatus : "500");
    var responseData = {
        "errors": [{
            "errorCode": errMsgObj.errorCode,
            "errorType": "App Error",
            "message": errMsgObj.errorMessage
        }],
        "success": false
    };
    res.status(!_.isNil(httpStatus) ? _.parseInt(httpStatus, 10) : 500).send(responseData);
};

/** Used by Framework for Framework errors like JSON Parser Failure **/
module.exports.globalError = function(err, req, res, next) {
    console.error(err);
    var responseData = {
        "errors": [],
        "success": false
    };

    var httpStatus = 500;
    if (err instanceof SyntaxError) {
        var errMsgObj = appUtils.resolveAppErrorMessage('parser-error', "400");
        responseData.errors.push({
            "errorCode": errMsgObj.errorCode,
            "errorType": "Parser Error",
            "message": errMsgObj.errorMessage
        });
        httpStatus = 400;
    } else {
        var errMsgObj = appUtils.resolveAppErrorMessage('other-error', "500");
        responseData.errors.push({
            "errorCode": errMsgObj.errorCode,
            "errorType": "Service Error",
            "message": errMsgObj.errorMessage
        })
    }
    res.status(httpStatus).send(responseData);
};