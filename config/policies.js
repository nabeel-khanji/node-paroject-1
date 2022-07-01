/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

    /***************************************************************************
     *                                                                          *
     * Default policy for all controllers and actions, unless overridden.       *
     * (`true` allows public access)                                            *
     *                                                                          *
     ***************************************************************************/

    // '*': true,
    // '*': ['AccessTokenExists', 'IsLoggedIn'],
    '*': ['is-logged-in'],

    // Bypass the `is-logged-in` policy for:
    'entrance/*': true,
    'api/*': true,
    'account/logout': true,
    'view-homepage-or-redirect': true,
    'view-faq': true,
    'view-contact': true,
    'legal/view-terms': true,
    'legal/view-privacy': true,
    'deliver-contact-form-message': true,

    

    // 'EmailVerification/sendVerificationCode': true,
    // 'EmailVerification/verifyAuthCode': true,
    // 'User/socialLogin': true,
    // 'User/guestLogin': true,
    // 'Match/webSocketExample': true
};
