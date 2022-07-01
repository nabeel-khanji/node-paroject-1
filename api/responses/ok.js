module.exports = function ok(obj = {}) {


  var req = this.req;
  var res = this.res;
  console.log('here')
  sails.log.verbose('Ran custom responses: res.ok()');

  if (req.wantsJSON) {

    customServices.sendSuccessResponse(customServices.createMsgForClient('Request successful', obj), res);

  }
  else {
    return res.status(200).view('pages/homepage');
  }

};
