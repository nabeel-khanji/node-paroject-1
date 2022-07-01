/**
 * DashboardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {

    index: async function(req, res) {
        try {

            console.log('ContactUS Controller ');

            return res.view('pages/Contactus/contactus');

        } catch (error) {
            console.log(error);

            return res.view('500.ejs', { status: 500, error: error })

        }
    },

}