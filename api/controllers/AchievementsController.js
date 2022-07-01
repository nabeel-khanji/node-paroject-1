/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const BaseController = require("./BaseController");

var data_assign = {};
data_assign.route = "achievements";
data_assign.route_name = "Achievements Management";
data_assign.ajaxRoute = "achievementsData";
data_assign.add_route = data_assign.route.concat("_add");
data_assign.edit_route = data_assign.route.concat("_update");
data_assign.permissions = ["add"];

module.exports = {
  index: async function (req, res) {
    try {
      data_assign.columns = await Achievements.getDatatableColumns();
      data_assign.dataColumns = JSON.stringify(data_assign.columns);
      return res.view("pages/index", data_assign);
    } catch (error) {
      console.log(error);
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  achievementsData: async function (req, res) {
    try {
      const data = await Achievements.getData(req, res);
      res.json(data);
    } catch (err) {
      res.view("500.ejs");
    }
  },

  makeData: async function (req, res) {
    try {
      data_assign.columns = await Achievements.getDatatableColumns();
      data_assign.route = "achievements";
      data_assign.route_name = "Achievements Management";
      data_assign.ajaxRoute = "achievementsData";
      data_assign.add_route = route.concat("_add");
      data_assign.permissions = ["add"];
      data_assign.dataColumns = JSON.stringify(columns);
    } catch (err) {
      console.log(err);
    }
  },

  delete: async function (req, res) {
    try {
      let params = req.allParams();
      await Achievements.destroyOne({ id: params.id });
      res.redirect("achievements");
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  add: async function (req, res) {
    try {
      console.log("HERE");
      return res.view(
        "pages/" +
          data_assign.route +
          "/" +
          customServices.getViewName(req.options.action.split("/")),
        data_assign
      );
    } catch (error) {
      console.log(error, "error");

      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  edit: async function (req, res) {
    try {
      let params = req.allParams();
      data_assign.data = await Achievements.findOne(params.id);
      return res.view(
        "pages/" +
          data_assign.route +
          "/" +
          customServices.getViewName(req.options.action.split("/")),
        data_assign
      );
    } catch (error) {
      console.log(error, "error");
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  store: async function (req, res) {
    try {
      let params = req.allParams();
      let errors = [];
      errors = BaseController.getErrors(params, [
        "title",
        "text",
        "identifier",
        "value",
      ]);
      if (errors.length > 0) {
        data_assign.valid_errors = errors;
        return res.view("pages/achievements/add", data_assign);
      }
      await Achievements.create(params);
      return res.view("pages/achievements/achievements");
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  update: async function (req, res) {
    try {
      let params = req.allParams();
      let id = params.id;
      await Achievements.updateOne({ _id: params.id }).set(params);
      data_assign.data = await Achievements.findOne(id);
      return res.redirect(data_assign.edit_route + "/" + id);
    } catch (error) {
      console.log(error, "error");
    }
  },

  delete: async function (req, res) {
    try {
      let params = req.allParams();
 await Achievements.destroyOne({ id: params.id });
      res.redirect("achievements");
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  add: async function (req, res) {
    try {
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

  edit: async function (req, res) {
    try {
      let params = req.allParams();
      data_assign.data = await Achievements.findOne(params.id);
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
      let params = req.allParams();
      await Achievements.create(params);
      return res.redirect(data_assign.add_route);
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  update: async function (req, res) {
    try {
      let params = req.allParams();
      let id = params.id;
      await Achievements.updateOne({ _id: params.id }).set(params);
      data_assign.data = await Achievements.findOne(id);
      return res.redirect(data_assign.edit_route + "/" + id);
    } catch (error) {
      return res.view("500.ejs", { status: 500, error: error });
    }
  },

  view: async function (req, res) {
    try {
      let params = req.allParams();
      data_assign.data = await Achievements.findOne(params.id);
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
};
