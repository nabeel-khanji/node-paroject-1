/**
 * MatchController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


    findMatch: async function (req, res) {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['shotType', 'shotLength'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Required fields are missing', validateRequest), res);
            return;
        }

        let params = req.allParams();

        MatchMakingUser.findAvailableUsers(params);

        let users = await User.getRandomUsers(params.user_id);

        customServices.sendSuccessResponse(customServices.createMsgForClient('Match Making successfully', users), res);

    },

    create: async function (req, res) {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['shotType', 'shotLength', 'user_ids'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Required fields are missing', validateRequest), res);
            return;
        }

        let params = req.allParams();

        try {

            let match = await Match.createFriendlyMatch(params);

            match = await Match.findMatchById({id: match.id, user_id: params.user_id});

            customServices.sendSuccessResponse(customServices.createMsgForClient('Match fetch successfully', match), res);

        } catch (e) {

            return customServices.sendErrorResponse(customServices.createMsgForClient(e, {}), res);
        }

    },

    startMatch: async function (req, res) {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['id'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Required fields are missing', validateRequest), res);
            return;
        }

        let params = req.allParams();

        try {

            let match = await Match.findMatchById(params);

            Match.addUserToMatchRoom(match.rocketChatRoomObj.roomId, params.user_id, match.creator);

            await Match.updateOne({id: match.id}).set({matchStarted: true});

            await MatchUser.updateOne({match_id: params.id, user_id: params.user_id}).set({matchStarted: true});

            customServices.sendSuccessResponse(customServices.createMsgForClient('Match fetch successfully', match), res);

        } catch (e) {

            return customServices.sendErrorResponse(customServices.createMsgForClient(e, {}), res);
        }
    },

    findOne: async function (req, res) {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['id'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Required fields are missing', validateRequest), res);
            return;
        }

        let params = req.allParams();

        try {

            let match = await Match.findMatchById(params);

            customServices.sendSuccessResponse(customServices.createMsgForClient('Match fetch successfully', match), res);

        } catch (e) {

            return customServices.sendErrorResponse(customServices.createMsgForClient(e, {}), res);
        }
    },

    rematch: async function (req, res) {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['id'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Required fields are missing', validateRequest), res);
            return;
        }

        let params = req.allParams();

        try {

            let match = await Match.findMatchById(params);

            match = await Match.rematch(match.id, params.user_id, match.name);

            customServices.sendSuccessResponse(customServices.createMsgForClient('Match fetch successfully', match), res);

        } catch (e) {

            return customServices.sendErrorResponse(customServices.createMsgForClient(e, {}), res);
        }
    },

    updateMatchScores: async function (req, res) {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['id', 'score'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Required fields are missing', validateRequest), res);
            return;
        }

        let params = req.allParams();

        try {

            let match = await Match.findMatchById(params);

            await MatchUser.updateUserScores(params)

            match = await MatchUser.getMatchUsersData(match);

            customServices.sendSuccessResponse(customServices.createMsgForClient('Match scores updated successfully', match), res);

        } catch (e) {

            return customServices.sendErrorResponse(customServices.createMsgForClient(e, {}), res);
        }
    },

    find: async function (req, res) {

        let params = req.allParams();

        let validateRequest = await customServices.validateRequestForRequiredParam(params, ['limit'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('', validateRequest), res);
            return;
        }

        params.limit = params.limit ? parseInt(params.limit) : 10;
        params.page = params.page ? parseInt(params.page) - 1 : 0;
        params.offset = parseInt(params.limit * (params.page == 0 ? 0 : params.page));

        let matches = await Match.findAll(params)

        customServices.sendSuccessResponse(customServices.createPaginatedMsgForClient("Matches fetched successfully.", matches.data, matches.pagination), res);

    }

};

