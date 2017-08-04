var expressValidator = require('express-validator');
var _ = require('../libs/lodash.min.js');

var injectCustomValidators = function(app) {
    app.use(expressValidator({
        customValidators: {
            isString: function(value) {
                return _.isNil(value) || _.isString(value);
            },
            isNotBlank: function(value) {
                return _.trim(value).length > 0;
            }
        }
    }));
    return app;
};
module.exports.injectCustomValidators = injectCustomValidators;