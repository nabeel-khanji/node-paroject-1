/**
 * MatchUserScores.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 const BaseController = require("../controllers/BaseController");

 const route = "users";

module.exports = {

  attributes: {
    score:{type:"number"},

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
        console.log('In search');
        let innquery = { where: { or: await MatchUserScores.dataTableColumns(value) }};
        let users = await User.find(innquery);
        let ids = [];
        users.forEach(data=>{
          ids.push(data.id);
        })
        console.log(ids,'ids');

        query.where = { or : [
          {user_id : {'in': ids }},
        ]}
  

      }
      let totalRecords = await MatchUserScores.count(query);
      let totalRecordwithFilter = await MatchUserScores.count(query);
      query.limit = params.length;
      query.skip = params.start;

      
      
      users = await MatchUserScores.find(query);


      // query = { where: { user_type: "consumer" } };

      let promises = _.map(users, async (user) => {
        let action = await BaseController.getActions(
          req,
          route,
          user,
        );

        let user_data = await User.findOne(user.user_id);
        
        // console.log(user_data);
    

        let columnsData = {};
        let columns = await this.getDatatableColumns();
        columns.forEach((element) => {
          columnsData[element.data] = customServices.checkStringValue(
            user[element.data]
          );
        });
        columnsData["name"] = user_data.name;
        columnsData["emailAddress"] = customServices.checkStringValue( user_data.emailAddress);
        columnsData["actions"] = action;
        // columnsData["status"] = await this.deactivate_button(user);

        return columnsData;
      });

      let data = {
        draw: parseInt(params["draw"]),
        iTotalDisplayRecords: !totalRecords ? 0 : totalRecords,
        iTotalRecords: !totalRecordwithFilter
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
    return [{ name: { contains: searchValue } }, { _id: searchValue }];
  },

  getDatatableColumns:async function(req,res){
    return [
      { data: "match_id", title: "Match Id", searchable: true },
      { data: "score", title: "Score"},
      { data: "name", title: "User Name"},
      { data: "emailAddress", title: "User Email"},
    ];
  }

};

