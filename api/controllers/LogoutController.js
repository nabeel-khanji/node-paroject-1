/**
 * LogoutController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    
  logout: function(req,res){
      console.log("########");
     req.session.userId=null;
    //  this. req.session.userId;
      res.redirect('/');
      

  }

};

