/**
 * Achievements.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 const BaseController = require("../controllers/BaseController");



  const route = "achievements";


module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  getData: async function (req, res) {
    try {
      
      var params = req.allParams();

      let query = {
        where: {},
      };

      var params = req.allParams();
      var value = params.search.value;

      if (value != "") {
        //await added
        query = { where: { or: await Achievements.dataTableColumns(value) } };
        // query.where.or = await Role.dataTableColumns(value)
      }
      let totalRecords = await Achievements.count(query);
      let totalRecordwithFilter = await Achievements.count(query);
      query.limit = params.length;
      query.skip = params.start;
      achievements = await Achievements.find(query);

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
      { data: "title", title: "Title", searchable: true },
      { data: "text", title: "Text" },
      { data: "actions", title: "Actions" },
    ];
  },

  

  

};

