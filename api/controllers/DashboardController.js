/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 var columns = [
  { data: "name", title: "Name", searchable: true },
  { data: "emailAddress", title: "Email" },
  { data: "actions", title: "Actions" },
];

const route = "user";
const route_name = "Top Players";
const ajaxRoute = "topUsersData";
// let add_route = route.concat("_add");
let permissions = [];

var data_assign = {};
data_assign.route = "user";
data_assign.route_name = "Top Players";
data_assign.ajaxRoute = "topUsersData";

data_assign.permissions = [];
 

module.exports = {

  index: async function (req, res) {
  
  try {

        console.log('Dashboard Controller ');

        data_assign.columns = await MatchUserScores.getDatatableColumns();

        data_assign.dataColumns = JSON.stringify(data_assign.columns);
        
        
       
        return res.view('pages/dashboard/index',data_assign);

        
      }
        

      catch (error) {
        console.log(error);

        return res.view('500.ejs', { status: 500, error: error })

      }
    }


}