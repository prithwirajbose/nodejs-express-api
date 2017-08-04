var _ = require('./lodash.min.js');
var errorHandling = require('./error-handler.js');

validatePost = function(res, requestData, mapping) {

    for (var i = 0; i < mapping.length; i++) {
        var map = mapping[i];

        var validationsList = _.get(map, 'validations');

        console.log(map);
        console.log(validationsList);

        console.log(_.indexOf(validationsList, 'required'));

        if (_.indexOf(validationsList, 'required') > -1) {
            validateRequired(res, requestData, map);
            return false;
        }

        if (indexOf(_.find(validationsList, 'string') > -1)) {
            validateString(res, requestData, map);
            return false;
        }

    };

    return true;

}

function validateRequired(res, requestData, map) {
    if (_.has(requestData, _.get(map, 'prop'))) {
        console.log(_.get(map, 'title') + ' Is Required In Request');
        errorHandling.throwValidationError(res, _.get(map, 'title') + ' Is Required In Request');
    }
}

function validateString(res, requestData, map) {
    if (_.isString(_.get(requestData, _.get(map, 'prop')))) {
        console.log(_.get(map, 'title') + ' Is Not A String');
        errorHandling.throwValidationError(res, _.get(map, 'title') + ' Is Not A String');
    }
}

module.exports.validatePost = validatePost;