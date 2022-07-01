/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const BaseController = require("./BaseController");

 var data_assign = {};
 data_assign.route = "notifications";
 data_assign.route_name = "Notifications Management";
 data_assign.ajaxRoute = "notificationsData";
 data_assign.add_route = data_assign.route.concat("_add");
 data_assign.edit_route = data_assign.route.concat("_update");
 data_assign.permissions = ['add'];

module.exports = {


    index: async function(req, res) {
        try {
            
            data_assign.columns = await NotificationsIdentifiers.getDatatableColumns();

            data_assign.dataColumns = JSON.stringify(data_assign.columns);

            return res.view('pages/index',data_assign);

        } catch (error) {
            console.log(error);

            return res.view('500.ejs', { status: 500, error: error })

        }
    },

    notificationsData:async function (req,res){
    
        try {
            //ALl code refractor to fethcUserDataForDataTable
            const data = await NotificationsIdentifiers.getData(req, res);
            
            res.json(data);
          
        } catch (err) {
        
            res.view("500.ejs");
        
        }


    } ,

    add:async function(req,res){

        try {

            data_assign.users = await User.find();
            
            return res.view('pages/'+data_assign.route+'/'+customServices.getViewName(req.options.action.split('/')),data_assign);
          
        } 
          catch (error) {
          
            console.log(error,'error');
          
            return res.view("500.ejs", { status: 500, error: error });
          
          }

      },

      store:async function(req,res){

        try {
            
            let params = req.allParams();

            let errors = [];
            console.log('asdlkklml',);
          
            errors = BaseController.getErrors(params, ["subject", "body"]);
            if (errors.length > 0) {
              data_assign.valid_errors = errors;
              return res.view(
                'pages/notifications/add',  data_assign);
            }
            await NotificationsIdentifiers.createNotification(params);

            return res.redirect(data_assign.add_route);
          
        } 
          catch (error) {
          
            console.log(error,'error');
          
            return res.view("500.ejs", { status: 500, error: error });
          
        }

      },

      edit:async function(req,res){

        try {
            
            let params = req.allParams();
            
            data_assign.data = await NotificationsIdentifiers.findOne(params.id);
            
            return res.view('pages/'+data_assign.route+'/'+customServices.getViewName(req.options.action.split('/')),data_assign);
          
        } 
          catch (error) {
          
            console.log(error,'error');
          
            return res.view("500.ejs", { status: 500, error: error });
          
          }

      },

      update:async function(req,res){

        try {
            
            let params = req.allParams();

            let id = params.id

            await NotificationsIdentifiers.updateOne({ _id: id }).set(params);

            data_assign.data = await NotificationsIdentifiers.findOne(id);

            return res.redirect(data_assign.edit_route+'/'+id);
          
        } 
          catch (error) {
          
            console.log(error,'error');
          
            return res.view("500.ejs", { status: 500, error: error });
          
        }

      },

      view:async function(req,res){

        try {
            
            let params = req.allParams();
            
            data_assign.data = await NotificationsIdentifiers.findOne(params.id);
            
            return res.view('pages/'+data_assign.route+'/'+customServices.getViewName(req.options.action.split('/')),data_assign);
          
        } 
          catch (error) {
          
            console.log(error,'error');
          
            return res.view("500.ejs", { status: 500, error: error });
          
          }

      },


}