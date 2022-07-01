var exports = module.exports;
/*
Function to create error msgs for client
*/
exports.sendErrorResponse = function (errMsg, res) {
    res.serverError(errMsg);
}

/*
Function to create error msgs for client
*/
exports.sendInvalidAuthResponse = function (errMsg, res) {
    res.status(403).send(errMsg);
}

exports.checkStringValue = (str) => {
    str = str ? str : '-'
    return str
  }

/*
Function to create success msgs for client
*/
exports.sendSuccessResponse = function (happyMsg, res) {
    res.status(200).send(happyMsg);
}
exports.checkPassword = function (strings) {

    let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(strings);
},
    /*
    Function to validate post request to check required params
    */
    exports.validatePostRequest = function (validationParams, request) {
        return new Promise(function (resolve, reject) {

            if (validationParams) {
                for (i = 0; i < validationParams.length; i++) {

                    if (validationParams[i].required) {
                        if (!request.body[validationParams[i].param]) {
                            let error = {validationParams, 'param_missing': validationParams[i].param};
                            reject(error);
                        }
                    }


                    if ((validationParams.length - 1) === i) {
                        resolve();
                    }
                }
            } else {
                resolve();
            }

        });

    }
//Function to validate get request to check required params
exports.validateGetRequest = function (validationParams, request) {
    return new Promise(function (resolve, reject) {

        if (validationParams) {
            for (i = 0; i < validationParams.length; i++) {

                if (validationParams[i].required) {

                    if (!request.query[validationParams[i].param]) {
                        let error = {validationParams, 'param_missing': validationParams[i].param};
                        reject(error);
                    }
                }


                if ((validationParams.length - 1) === i) {
                    resolve();
                }
            }
        } else {
            resolve();
        }

    });

}
/*
Function to generate unique id on the basis of time
*/
exports.generateUUID = function () {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
/*
Function to generate human readable code
*/
exports.generateReadableCode = function () {
    return Math.floor(100000 + Math.random() * 900000);
}
/*
Function to create readable msg for the client
*/
exports.createMsgForClient = function (msg, data) {
    return {'message': msg, 'data': data};
}

exports.createPaginatedMsgForClient = function (msg, data, pagination) {
    return {'message': msg, 'data': data, 'pagination': pagination};
}
/*
Function to replace all undefined values with null from JSON
*/
exports.removeUndefinedFromJSON = function (obj) {
    return JSON.parse(JSON.stringify(obj, function (k, v) {
        if (v === undefined) {
            return null;
        }
        return v;
    }));
}

exports.uploadFiles = function (req, res, cb) {
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const Busboy = require('busboy');

    const busboy = new Busboy({headers: req.headers});
    const tmpdir = os.tmpdir();
    var files = [];
    // This object will accumulate all the fields, keyed by their name
    const fields = {};

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {};

    // This code will process each non-file field in the form.
    busboy.on('field', (fieldname, val) => {
        // TODO(developer): Process submitted field values here
        console.log(`Processed field ${fieldname}: ${val}.`);
        fields[fieldname] = val;
    });

    let fileWrites = [];

    // This code will process each file uploaded.
    busboy.on('file', (fieldname, file, filename) => {
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        console.log(`Processed file ${filename}`);
        const filepath = path.join(tmpdir, filename);
        uploads[fieldname] = filepath;

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        // File was processed by Busboy; wait for it to be written to disk.
        const promise = new Promise((resolve, reject) => {
            file.on('end', () => {
                writeStream.end();
            });
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on('finish', () => {
        Promise.all(fileWrites)
            .then(() => {
                // TODO(developer): Process saved files here
                for (const name in uploads) {
                    files.push(uploads[name]);
                }
                cb(files);
            });
    });

    busboy.end(req.rawBody);

}

exports.readCSVdata = function (filePath) {
    const csv = require('csvtojson')
    return new Promise(function (resolve, reject) {
        csv().fromFile(filePath[0]).then((jsonObj) => {
            resolve(jsonObj);
        }).catch((err) => {
            reject(err);
        });
    });
}

exports.externalHit = function (url, isPost, data) {
    var request = require('request');

    return new Promise(function (resolve, reject) {

        if (!isPost) {

            request(url, function (error, response, body) {
                resolve({
                    'error': error,
                    'statusCode': response.statusCode,
                    'body': JSON.parse(body)
                });
            });

        } else {

            request.post({url: url, form: data}, function (err, httpResponse, body) {
                resolve({
                    'err': err,
                    'httpResponse': httpResponse,
                    'body': body,
                });
            });
        }

    });


}

exports.getFbFriendsURL = function (baseURL, req) {
    return baseURL + req.body.userID + '/?fields=friends{name,id}&access_token=' + req.body.accessToken;
}

exports.makeArrayFromObject = function (obj) {
    return new Promise((resolve, reject) => {
        let i = 0;
        let result = [];

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {

                result.push(obj[key]);
                if (i == Object.keys(obj).length - 1) {

                    resolve(result);
                }

                i++;
            }

        }

        if (Object.keys(obj).length === 0) {
            reject('Array is empty');
        }
    });
}

exports.sortArray = function (array, sortBy) {
    return array.sort(function (a, b) {
        a = new Date(a[sortBy]);
        b = new Date(b[sortBy]);
        return a > b ? -1 : a < b ? 1 : 0;
    });

}


exports.findInArrayByValue = function (array, findingValue, comparisionValue, isJSON) {
    return new Promise((resolve, reject) => {
        let i = 0;
        for (key in array) {

            if (isJSON) {
                if (JSON.parse(array[key])[findingValue] == comparisionValue) {
                    resolve(key);
                    break;
                }

            } else {
                if (array[key][findingValue] == comparisionValue) {
                    resolve(key);
                    break;
                }
            }

            if (i === array.length - 1) {
                reject();
            }
            i++;
        }

        if (array.length === 0) {
            reject();
        }
    });
}

exports.makeNotificationData = function (notificationData, customData, replacers, device_token) {
    var striptags = require('striptags');

    let notificationBody = notificationData.body;

    let notificationReplacers = notificationData['replacer'].split(',');

    notificationReplacers.map(function (wildcard, index) {
        if (wildcard != '')
            notificationBody = notificationBody.replace(wildcard, replacers[index]);
    });


    customData.notificationDescription = notificationBody;

    customData = JSON.stringify(customData);

    notificationBody = striptags(notificationBody);

    notification = {
        'title': notificationData.title,
        'body': notificationBody,
    };

    return {
        "token": device_token,
        "notification": notification,
        "data": {
            customData
        },
        "android": {
            "notification": {
                "sound": "default"
            }
        },
        "apns": {
            "payload": {
                "aps": {
                    "sound": "default"
                }
            }
        }
    };
}


exports.getTotalAvg = function (obj) {
    return new Promise(function (resolve, reject) {
        let avg = 0;
        let i = 0;
        for (let key in obj) {
            avg = parseInt(obj[key]) + parseInt(avg);

            if (i === (Object.keys(obj).length - 1)) {
                resolve(parseInt(avg) / parseInt(Object.keys(obj).length));
            }
            i++;
        }

        if (!Object.keys(obj).length) {
            resolve(avg);
        }
    });
}

exports.checkInArrayOfObjects = async (array, valueToFind) => {
    var found = false;
    let i = 0;
    array.forEach(function (item) {

        if (item.name === valueToFind) {
            found = true;
            return found;
        }

        if (i === array.length) {
            return found;
        }

    });
}

exports.makeDateFormat = (now) => {
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
}

exports.calculateDistance = (lon1, lat1, lon2, lat2) => {
    var R = 6371; // km
    var dLat = customServices.toRad(lat2 - lat1);
    var dLon = customServices.toRad(lon2 - lon1);
    var lat1 = customServices.toRad(lat1);
    var lat2 = customServices.toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 0.62137;
}

exports.toRad = (value) => {
    return value * Math.PI / 180;
}

exports.validateRequestForRequiredParam = async (paramsInRequest, requiredParams) => {

    let counter = 0;

    let response = {'status': true, 'msg': 'Required fields missing', culprit: []}

    for (let key in requiredParams) {
        if (!paramsInRequest[requiredParams[key]]) {
            response.status = false;
            response.culprit.push(requiredParams[key]);
        }

        counter++;
    }

    if (counter == requiredParams.length) {
        return response;
    }

}

exports.slugify = (string) => {
    return string
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

exports.generateUniqueCode = (length) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));

}

exports.randomString = (length, chars) => {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}

exports.modelError = function (message, code) {
    let err = new Error();
    err.name = 'Validation';
    err.code = {
        code: code,
        message: message
    }
    err.invalidAttributes = {};
    err.message = message;

    return err;
}

exports.timeToMilliSeconds = function (hrs, min, sec) {
    return ((hrs * 60 * 60 + min * 60 + sec) * 1000);
}

exports.pagination_detail = (length, current_page, limit) => {
    let total_page = Math.ceil(length / limit)
    let pagination = {
        total: length,
        last_page: total_page,
        per_page: limit,
        current_page: current_page + 1
    }

    return pagination;

}

exports.getViewName = (arr) =>{

    const view_name = arr[arr.length - 1]
    return view_name;

}
