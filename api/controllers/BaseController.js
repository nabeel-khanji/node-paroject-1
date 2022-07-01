const validator = require("validator");
const User = require("../models/User");
/**
 * BaseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getActions: function (req, module_name, user) {
    let actions = "";

    if (!user) {
      return actions;
    }

    let href = "javascript:;";

    let onclick = "deleteRow('" + user.id + "')";
    //confirm_string.concat("return confirm('Are You Sure')");

    actions =
      "<a href=" +
      module_name +
      "_update/" +
      user.id +
      ' class="mr5" style="padding-left: 20px;"><i class="fa fa-edit "></i></a>';

    actions +=
      "<a href=" +
      module_name +
      "_view/" +
      user.id +
      " class='mr5' style='padding-left: 20px;'><i class='fa fa-eye '></i></a>";

    actions +=
      "<a href=" +
      href +
      " onclick=" +
      onclick +
      ' style="padding-left: 20px;"><i class="fa fa-trash "></i></a>';

    return actions;
  },

  getErrors: function (validatedParams, validation) {
    let errors = [];
    for (let index = 0; index < Object.keys(validation).length; index++) {
      if (validatedParams[validation[index]] == "") {
        errors.push({
          msg: `${validation[index]} is required`,
          param: validation[index],
        });
      }
    }
    return errors;
  },

  getDispatchOrderButton: async (order) => {
    let actions = "";
 let href = "/order_dispatch/" + order.id;
    if (!order) {
      return actions;
    }
    if (!order.dispatched) {
      actions = "<a href=" + href + ">Dispatch</a>";
    } else {
      actions = '<a href="#" >Already Dispatch</a>';
    }
    return actions;
  },

  uploadFile: async (req, res) => {
    const fs = require("fs");
    const got = require("got");
    const FormData = require("form-data");
    var file_url = "";
    return new Promise(function (resolve, reject) {
      req.file("file").upload(async function (err, uploadedFiles) {
        if (err) {
          customServices.sendErrorResponse(
            customServices.createMsgForClient(err, {}),
            res
          );
        } else if (uploadedFiles.length == 0) {
          reject("Attachment must be required");
          //customServices.sendErrorResponse(customServices.createMsgForClient("File is required", {}), res);
        } else {
          const form = new FormData();
          form.append("file", fs.createReadStream(uploadedFiles[0].fd));
          const storageURLUploadFile =
            sails.config.microservice.storage.base_url +
            sails.config.microservice.storage.uploadFile.uri;
          await got
            .post(storageURLUploadFile, {
              body: form,
              headers: {
                "X-Access-Token": sails.config.microservice.storage._token,
              },
            })
            .then((response) => {
              file_url = JSON.parse(response.body).file;
              resolve(file_url);            })
            .catch((error) => {
              reject("An error occurred while uploading file");
              //customServices.sendErrorResponse(customServices.createMsgForClient("An error occurred while uploading file", error), res);
            })
            .finally(() => {
              fs.unlink(uploadedFiles[0].fd, (err) => {
                if (err) console.log(err);
                console.log(uploadedFiles[0].fd + " was deleted");
              });
            });
        }
      });
    });
  },

  ajaxData: async (req, res, params) => {
    try {
      var loggedInUser = await BuisnessUser.findOne({
        id: req.session.userId,
      });

      //let vendor_role = await BuisnessUser.getVendorRole();
      //var user_role = req.session.userRole;
      //let vendor_role = await BuisnessUser.getVendorRole();

      //users = await User.find({user_type:"consumer"});
      // }
      // else{

      //     staffs =  await BuisnessUser.find({createdBy:loggedInUser.createdBy}).populate("role_id");
      //     // products = await Products.find({user_id:loggedInUser.createdBy});
      // }

      let promises = _.map(params.data, async (data) => {
        //let action = await getActions(req,params.route,data,loggedInUser);

        let action = this.getActions(req, params.route, data, loggedInUser);
        let col = {};
        params.column.forEach(function (column) {
          col.column = customServices.checkStringValue(data.column);
        });
        col.actions = action;

        return col;

        // return {
        //     'first_name': customServices.checkStringValue(user.first_name),
        //     'last_name': customServices.checkStringValue(user.last_name),
        //     'emailAddress': customServices.checkStringValue(user.emailAddress),
        //     'actions': action
        // }
      });

      let data = {
        data: await Promise.all(promises),
      };

      return data;

      res.ok(data);
    } catch (err) {
      res.view("views/pages/500.ejs");

      console.log(err);
    }
  },
  getName: async () => {
    return "Asad";
  },
};
