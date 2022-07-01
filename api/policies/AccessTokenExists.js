/**
 * Created by shoaibarshad on 6/25/19.
 */
// policies/isLoggedIn.js
module.exports = async function (req, res, proceed) {


  if (!req.header('X-Access-Token')) {

    return customServices.sendErrorResponse(customServices.createMsgForClient("Access Token is required", { culprit: 'X-Access-Token' }), res);

  }


  proceed();
};
