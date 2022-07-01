const BaseController = require("./BaseController");

/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var data_assign = {};
data_assign.route = "user";
data_assign.route_name = "User Management";
data_assign.ajaxRoute = "usersData";
data_assign.add_route = data_assign.route.concat("_add");
data_assign.edit_route = data_assign.route.concat("_update");
data_assign.permissions = ["add"];

module.exports = {
  index: async function (req, res) {
    try {
      data_assign.columns = await User.getDatatableColumns();

      data_assign.dataColumns = JSON.stringify(data_assign.columns);

      return res.view("pages/index", data_assign);
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  delete: async function (req, res) {
    try {
      let params = req.allParams();

      await User.destroyOne({ id: params.id });

      res.redirect("users");
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  edit: async function (req, res) {
    try {
      let params = req.allParams();

      data_assign.data = await User.findOne(params.id);

      data_assign.countries = await Countries.find();
      for (let index = 0; index < data_assign.countries.length; index++) {
        if (
          data_assign.countries[index]["name"] == data_assign.data["country"]
        ) {
          data_assign.country = data_assign.countries[index]["id"];
        }
      }
      data_assign.success_nsg = "";


      return res.view(
        "pages/" +
          data_assign.route +
          "/" +
          customServices.getViewName(req.options.action.split("/")),
        data_assign
      );
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  update: async function (req, res) {
    //  let errors=[];
    // errors= BaseController.getErrors([{'name':['required','max-length']},{'email':['is_email','reqired']},]);
    //   if (errors.length > 0) {
    //     return res.redirect("pages/UserManagement/adduser_edituser/AddUser", { valid_errors: errors });
    //   }

    let params = req.allParams();

    try {
      let errors = [];
      let params = req.allParams();
      let id = params.id;
      var country;
      // country = await Countries.findOne({id:params.country_id});
      data_assign.countries = await Countries.find();
      for (let index = 0; index < data_assign.countries.length; index++) {
        if (data_assign.countries[index]["id"] == params.country_id) {
          country = data_assign.countries[index]["name"];
        }
      }
      data_assign.country = params.country_id;
      errors = BaseController.getErrors(params, [
        "name",
        "emailAddress",
        "country",
      ]);

      if (errors.length > 0) {
        data_assign.valid_errors = errors;
        return res.view("pages/user/edit", data_assign);
      }
      // user = await User.findOne({ emailAddress:params.emailAddress});
      // if(user!=null){

      //  errors.push({
      //    msg: `email already exist`,
      //    param: 'emailAddress',
      //  });
      //  data_assign.valid_errors = errors;
      //  return res.view(
      //   'pages/user/edit',  data_assign);
      // }

  userUpdate=  await User.updateOne({ _id: params.id }).set({
        mobile_json: req.body.mobile_json,
        name: params.name,
        guest_user: false,
        is_verified: true,
        soundEffects: 1,
        notifications: 1,
        soloTimer: 1,
        totalScorePutt: 0,
        totalScoreChip: 0,
        nameToLowerCase: params.name.toLowerCase(),
        socketRoomObj: {
          // createdBy: "req.body.createdBy",
          // createdDate: "req.body.createdDate",
          // lastUpdatedAt: "req.body.lastUpdatedAt",
          // _id: "req.body._id",
          // roomId: "req.body.roomId",
          // state: "req.body.state",
        },
        country: country,
        emailAddress: params.emailAddress,
        state: "Sindh",
        rocketChatObj: {
          // userId: "req.body.userId",
          // authToken: "req.body.authToken",
          // user_name: "req.body.user_name",
        },
        rocketChatRoomObj: {
          // roomId: "req.body.roomId",
          // roomName: "req.body.roomName",
        },
      });
      if(req.method=="POST"){
        data_assign.success_nsg = "data edit success";

      }
     

      return res.view("pages/user/edit", data_assign);
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  add: async function (req, res) {
    try {
      data_assign.countries = await Countries.find();

      return res.view(
        "pages/" +
          data_assign.route +
          "/" +
          customServices.getViewName(req.options.action.split("/")),
        data_assign
      );
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  store: async function (req, res) {
    try {
      let errors = [];
      let params = req.allParams();
      data_assign.countries = await Countries.find();

      errors = BaseController.getErrors(params, [
        "name",
        "emailAddress",
        "country",
      ]);

      if (errors.length > 0) {
        data_assign.valid_errors = errors;
        return res.view("pages/user/add", data_assign);
      }
      user = await User.findOne({ emailAddress: params.emailAddress });
      if (user != null) {
        errors.push({
          msg: `email already exist`,
          param: "emailAddress",
        });
        data_assign.valid_errors = errors;
        return res.view("pages/user/add", data_assign);
      }

      await User.create({
        mobile_json: req.body.mobile_json,
        name: params.name,
        guest_user: false,
        is_verified: true,
        soundEffects: 1,
        notifications: 1,
        soloTimer: 1,
        totalScorePutt: 0,
        totalScoreChip: 0,
        nameToLowerCase: params.name.toLowerCase(),
        socketRoomObj: {
          // createdBy: "req.body.createdBy",
          // createdDate: "req.body.createdDate",
          // lastUpdatedAt: "req.body.lastUpdatedAt",
          // _id: "req.body._id",
          // roomId: "req.body.roomId",
          // state: "req.body.state",
        },
        country: params.country,
        emailAddress: params.emailAddress,
        state: "Sindh",
        rocketChatObj: {
          // userId: "req.body.userId",
          // authToken: "req.body.authToken",
          // user_name: "req.body.user_name",
        },
        rocketChatRoomObj: {
          // roomId: "req.body.roomId",
          // roomName: "req.body.roomName",
        },
      });
      return res.redirect(data_assign.add_route);
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  viewUser: async function (req, res) {
    try {
      return res.view("pages/UserManagement/viewuser/ViewUser");
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  userData: async function (req, res) {
    try {
      //ALl code refractor to fethcUserDataForDataTable
      const data = await User.getData(req, res);

      res.json(data);
    } catch (err) {
      res.view("500.ejs");
    }
  },

  topUsersData: async function (req, res) {
    try {
      //ALl code refractor to fethcUserDataForDataTable

      const data = await MatchUserScores.getData(req, res);

      res.json(data);
    } catch (err) {
      res.view("500.ejs");
    }
  },

  view: async function (req, res) {
    try {
      let params = req.allParams();
      let topScore = await MatchUserScores.find({ user_id: params.id })
        .sort({ "score" : -1 })
        .limit(1);
        let totalUsers = await MatchUserScores.find({ user_id: params.id })
        ;
      
      data_assign.data = await User.findOne(params.id);

      // for (let index = 0; index < matchUser.length; index++) {
      //   if (matchUser[index]["user_id"] == params.id) {
      //     console.log(matchUser[index]["totalScore"]);
      //     for (i = 0; i <= largest; i++) {
      //       if (matchUser[index]["totalScore"] > largest) {
      //         var largest = matchUser[index]["totalScore"];
      //       }
      //     }
      //   }
      // }
      if(topScore.length>0){
        data_assign.top_score =topScore[0]['score'];
      }
      data_assign.total_games =totalUsers.length;
      let country = data_assign.data.country
        ? await Countries.findOne({ id: data_assign.data.country })
        : "";

      data_assign.country = country ? country.name : "";

      return res.view(
        "pages/" +
          data_assign.route +
          "/" +
          customServices.getViewName(req.options.action.split("/")),
        data_assign
      );
    } catch (error) {
      console.log('error',error);
      return res.view("500.ejs", { status: 500, error: error });
    }
  },
};
