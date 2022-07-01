/**
 * CountryController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    find: async function (req, res) {

        let params = req.allParams();

        params.limit = params.limit ? parseInt(params.limit) : 10;
        params.page = params.page ? parseInt(params.page) - 1 : 0;
        params.offset = parseInt(params.limit * (params.page == 0 ? 0 : params.page));

        let countries = await Countries.findAll(params)

        customServices.sendSuccessResponse(customServices.createPaginatedMsgForClient("Countries fetched successfully.", countries.data, countries.pagination), res);
    },

    getStates: async function (req, res) {

        let params = req.allParams();

        let validateRequest = await customServices.validateRequestForRequiredParam(params, ['id'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('', validateRequest), res);
            return;
        }

        params.limit = params.limit ? parseInt(params.limit) : 10;
        params.page = params.page ? parseInt(params.page) - 1 : 0;
        params.offset = parseInt(params.limit * (params.page == 0 ? 0 : params.page));

        let states = await States.findAll(params)

        customServices.sendSuccessResponse(customServices.createPaginatedMsgForClient("states fetched successfully.", states.data, states.pagination), res);

    }

};

