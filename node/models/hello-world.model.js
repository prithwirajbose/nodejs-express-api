var _ = require('../libs/lodash.min.js');

function data(data) {
    // console.log(json);
    return { "message": "Hello " + data.firstName + " " + data.lastName };
}

module.exports.data = data;