var sid = require('shortid');
var fs = require('fs');
//var io = require('socket.io');

var UPLOAD_PATH = 'public/images';

// Setup id generator
sid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
sid.seed(42);

function safeFilename(name) {
  name = name.replace(/ /g, '-');
  name = name.replace(/[^A-Za-z0-9-_\.]/g, '');
  name = name.replace(/\.+/g, '.');
  name = name.replace(/-+/g, '-');
  name = name.replace(/_+/g, '_');
  return name;
}

function fileMinusExt(fileName) {
  return fileName.split('.').slice(0, -1).join('.');
}

function fileExtension(fileName) {
  return fileName.split('.').slice(-1);
}

// Where you would do your processing, etc
// Stubbed out for now
function processImage(id, name, path, cb) {
  console.log('Processing image');

  cb(null, {
    'result': 'success',
    'id': id,
    'name': name,
    'path': path
  });
}


module.exports = {
  uploadFile: function (req, res) {
    const fs = require('fs');
    const got = require('got');
    const FormData = require('form-data');


    req.file('file').upload(function (err, uploadedFiles) {

      if (err){
        customServices.sendErrorResponse(customServices.createMsgForClient(err, {}), res);
      }
      else if (uploadedFiles.length == 0)
      {
        customServices.sendErrorResponse(customServices.createMsgForClient("File is required", {}), res);
      }
      else{
        const form = new FormData();
        form.append('file', fs.createReadStream(uploadedFiles[0].fd));


        const storageURLUploadFile =
        sails.config.microservice.storage.base_url +
        sails.config.microservice.storage.uploadFile.uri;

        got.post(storageURLUploadFile, {
          body: form,
          headers: {
            'X-Access-Token': sails.config.microservice.storage._token
          }
        }).then(response => {

          res.ok({
            attachment: {
              "fileid": JSON.parse(response.body).file.substr(JSON.parse(response.body).file.lastIndexOf('/') + 1),
              "url": JSON.parse(response.body).file,
              "thumbnail_url": JSON.parse(response.body).thumbnail
            }
          });

        }).catch(error => {

          customServices.sendErrorResponse(customServices.createMsgForClient("An error occurred while uploading file", error), res);
        })
        .then(() => {
          fs.unlink(uploadedFiles[0].fd, (err) => {
            if (err) console.log(err);
            console.log(uploadedFiles[0].fd + ' was deleted');
          });
        });
      }
    });

  },

  /**
  * Overrides for the settings in `config/controllers.js`
  * (specific to GifController)
  */
  _config: {}
}
;
