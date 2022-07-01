/**
 * PhoneVerificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {

    sendVerificationCode: async (req, res) => {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['emailAddress'])

        if (!validateRequest.status) {
            console.log('validateRequest ',validateRequest)
            customServices.sendErrorResponse(customServices.createMsgForClient('Required fields are missing', validateRequest), res);
            return;
        }

        let params = req.allParams();

        await EmailVerificationCodes.sendEmailVerificationCode(params);

        customServices.sendSuccessResponse(customServices.createMsgForClient(sails.__("api.email_verification.success"), {}), res);

    },

    verifyAuthCode: async (req, res) => {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['emailAddress', 'validation_code'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Required fields are missing', validateRequest), res);
            return;
        }

        let params = req.allParams();

        try {

            let response = await EmailVerificationCodes.verifyEmailCode(params);

            customServices.sendSuccessResponse(customServices.createMsgForClient('Verified Successfully', response), res);

        } catch (e) {

            return customServices.sendErrorResponse(customServices.createMsgForClient(e, {}), res);
        }


    },

};
