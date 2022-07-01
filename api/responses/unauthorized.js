/**
 * unauthorized.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.unauthorized();
 *     // -or-
 *     return res.unauthorized(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'unauthorized'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: optionalData }
 * ```
 */

module.exports = function unauthorized(optionalData) {

  // Get access to `req` and `res`
  var req = this.req;
  var res = this.res;

  sails.log.verbose('Ran custom response: res.unauthorized()');
  
  if (req.wantsJSON) {
    return res.sendStatus(401);
  }
  
  // Or log them out (if necessary) and then redirect to the login page.
  else {

    if (req.session.userId) {
      // delete req.session.userId;
      return res.redirect('/');
    }

    return res.redirect('/login');
  }

};
