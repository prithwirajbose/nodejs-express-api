var _ = require('./lodash.min.js'),
    fastXmlParser = require('fast-xml-parser');
var globalErrorMessages = require("./app_configurations/error-messages.json");


var xmlParserOptions = {
    attrPrefix: "",
    textNodeName: "text",
    // ignoreNonTextNodeAttr : true,
    ignoreTextNodeAttr: false,
    ignoreNameSpace: true,
    // ignoreRootElement : false,
    textNodeConversion: false
        // textAttrConversion : false
};

var indexOf = function(obj, key) {
    if (_.isArray(obj))
        return _.indexOf(obj, key);
    else {
        var i = -1,
            indx;
        for (indx in obj) {
            i++;
            if (obj.hasOwnProperty(indx) && indx == key) {
                return i;
            }
        }
        return i;
    }
};

module.exports.resolveValidationErrorMessage = function(msgcode, paramName, httpStatus) {
    var errCd = 4000999;
    var errMsg = !_.isNil(msgcode) ? msgcode :
        (!_.isNil(paramName) ? paramName : 'Request parameter') +
        ' is invalid';
    if (_.has(globalErrorMessages.validationErrors, msgcode)) {
        errCd = _.parseInt(httpStatus +
            '' +
            indexOf(globalErrorMessages, 'validationErrors') +
            _.padStart(indexOf(globalErrorMessages.validationErrors,
                msgcode), 3, '0'), 10);
        errMsg = _.get(globalErrorMessages.validationErrors, msgcode);
    }

    if (!_.isNil(errMsg) && !_.isNil(paramName) && _.includes(errMsg, '{{paramName}}')) {
        errMsg = _.replace(errMsg, '{{paramName}}', paramName);
    }

    return {
        "errorCode": errCd,
        "errorMessage": errMsg
    };
};

module.exports.resolveAppErrorMessage = function(errMsgCd, httpStatus) {
    var errCd = 5001999;
    var errMsg = !_.isNil(errMsgCd) ? errMsgCd : 'A service error has occured';
    if (_.has(globalErrorMessages.appErrors, errMsgCd)) {
        errCd = _.parseInt(httpStatus +
            '' +
            indexOf(globalErrorMessages, 'appErrors') +
            _.padStart(indexOf(globalErrorMessages.appErrors,
                errMsgCd), 3, '0'), 10);
        errMsg = _.get(globalErrorMessages.appErrors, errMsgCd);
    }

    return {
        "errorCode": errCd,
        "errorMessage": errMsg
    };
};

/**
 * Converts XML special characters such as &amp;
 * &lt; to their unescaped versions such as & <
 */
var restoreXmlSpecialCharsInJson = function(json) {
    if (typeof(json) == 'string') {
        //capability to convert json string as well - supplied json is json string
        json = restoreXmlSpecialCharsInJson(JSON.parse(json));
    } else if (typeof(json) == 'object') {
        //when the supplied json is object
        for (key in json) {
            //iterate through the keys of json
            if (json.hasOwnProperty(key)) {
                if (typeof(_.get(json, key)) == 'string') {
                    // if current key's datatype is string replace the special chars from the value at
                    //set it back to the json
                    var val = _.get(json, key);
                    val = val.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&apos;/g, "'").replace(/&quot;/g, '"');
                    json[key] = val;
                } else if (_.isArray(_.get(json, key))) {
                    // if current key's datatype is not string recurse inside the value
                    //recurse to children
                    var val = restoreXmlSpecialCharsInJson(_.get(json, key));
                    if (val && !_.isNil(val))
                        json[key] = val;
                } else if (typeof(_.get(json, key)) != 'string' && !_.isArray(_.get(json, key)) &&
                    typeof(_.get(json, key)) != 'undefined') {
                    // if current key's datatype is not string recurse inside the value
                    //recurse to children
                    json[key] = restoreXmlSpecialCharsInJson(_.get(json, key));
                }
            }
        }
    } else {
        // do nothing for numeric, boolean etc values
    }
    return json;
};

/**
 * Override of FasterXML parser
 */
var parseXmlToJson = function(xmlBody) {
    var json = fastXmlParser.parse(xmlBody, xmlParserOptions);
    return restoreXmlSpecialCharsInJson(json);
}

module.exports.parseXmlToJson = parseXmlToJson;