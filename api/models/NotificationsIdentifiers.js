/**
 * NotificationsIdentifiers.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */


 const BaseController = require("../controllers/BaseController");


 const route = "notifications";

 let admin_default_identifier = 'admin_default';

module.exports = {

    attributes: {},

    initializeData: async () => {
        await NotificationsIdentifiers.createEach([
            {
                identifier: "invite_user",
                language: "en",
                notification_type: "push",
                body: "[USER] wants to play.",
                wildcards: "[USER]"
            },
        ])
    },

    sendNotificationToUsers:async function(){

        let deviceTokens = [];

        let all_users  = await User.find();

        
        let users = all_users.map(async function (user_id, index) {
            
            let user = await User.profile(user_id);

            if (!user) {
                throw `Invalid User id on ${index} index`;
            }

            if (user.notifications && user.deviceToken) {
                deviceTokens.push(user.deviceToken);
            }

            return user

        })

        users = await Promise.all(users);

        let creator = await BusinessUser.findOne({'isSuperAdmin':true});

        users.push(creator);

        console.log(creator,'creator');
        if (deviceTokens.length) {

            let notificationObj = {
                target_identifier: admin_default_identifier,
                replacer: '',
                actor: creator,
                reference_id: creator,
                references: {
                    creator: creator,
                }
            };

            sendNotification(deviceTokens, notificationObj)
        }
    },

    getData: async function (req, res) {
        try {
          
          var params = req.allParams();
    
          let query = {
            where: {'identifier':admin_default_identifier},
          };
    
          var params = req.allParams();
          var value = params.search.value;
    
          if (value != "") {
            //await added
            query = { where: { or: await NotificationsIdentifiers.dataTableColumns(value) } };
            // query.where.or = await Role.dataTableColumns(value)
          }
          let totalRecords = await NotificationsIdentifiers.count(query);
          let totalRecordwithFilter = await NotificationsIdentifiers.count(query);
          query.limit = params.length;
          query.skip = params.start;
          achievements = await NotificationsIdentifiers.find(query);
    
          // query = { where: { user_type: "consumer" } };
    
          let promises = _.map(achievements, async (user) => {
            let action = await BaseController.getActions(
              req,
              route,
              user,
            );
            
    
            let columnsData = {};
            let columns = await this.getDatatableColumns();
            columns.forEach((element) => {
              columnsData[element.data] = customServices.checkStringValue(
                user[element.data]
              );
            });
            columnsData["actions"] = action;
            // columnsData["status"] = await this.deactivate_button(user);
    
            return columnsData;
          });
    
          let data = {
            draw: parseInt(params["draw"]),
            iTotalRecords: !totalRecords ? 0 : totalRecords,
            iTotalDisplayRecords: !totalRecordwithFilter
              ? 0
              : totalRecordwithFilter,
            aaData: await Promise.all(promises),
          };
          return data;
        } catch (error) {
          console.log(error);
        }
      },
    dataTableColumns: async (searchValue) => {
    //on basis of name
    return [{ title: { contains: searchValue } }, { _id: searchValue }];
    },

    getDatatableColumns:async function(req,res){
    return [
        { data: "subject", title: "Subject", searchable: true },
        { data: "body", title: "Body" },
        { data: "actions", title: "Actions" },
    ];
    },

    createNotification:async function(params){

        params.identifier = admin_default_identifier;
        params.language = 'en';
        params.wildcards = '';
        params.notification_type = 'push';

        await NotificationsIdentifiers.create(params);

        // this.sendNotificationToUsers();
      
    }
};

