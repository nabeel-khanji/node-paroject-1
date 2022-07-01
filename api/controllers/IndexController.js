/**
 * IndexController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    test: async function (req, res) {
        try {
            console.log("error was here");
        }
        catch (e) {
            console.log(e);
        }
    }

};

