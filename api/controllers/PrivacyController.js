/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {

    index: async function(req, res) {
        console.log('Privacy Controller ');
        try {
          policy =  await Cms.find({});
          console.log('policy',policy);

            return res.view('pages/Privacy/privacy',{data: policy[0]});

        } catch (error) {
            console.log(error);

            return res.view('500.ejs', { status: 500, error: error })

        }
    },

    editPrivacy: async function(req, res) {
        console.log('Privacy Controller ');

        try {
           policy=  await Cms.updateOne({id:req.params.id}).set({
              name: req.body.name,
              html: req.body.name,
              // alias: `${req.body.name.toLowerCase.replace(' ','-')}`,
              nameToLowercase: req.body.name.toLowerCase()              
            });
            return  res.redirect('../Privacy');
          } catch (error) {
            return res.view("500.ejs", { status: 500, error: error });
          }
    },

    

}