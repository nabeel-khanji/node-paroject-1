/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    users: async function(req, res){
      users = await User.find({});
      res.send(users);
    },

    socialLogin: async function (req, res) {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['platformId'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Platform Id is required.', validateRequest), res);
            return;
        }

        try {
            let response = await User.socialLogin(req.allParams());
            console.log('response ', response)
            customServices.sendSuccessResponse(customServices.createMsgForClient('Social Login Successfully.', response), res);
        } catch (e) {

            return customServices.sendErrorResponse(customServices.createMsgForClient(e, {}), res);
        }

    },

    guestLogin: async function (req, res) {

        let response = await User.guestLogin(req.allParams());

        customServices.sendSuccessResponse(customServices.createMsgForClient('Guest Login Successfully.', response), res);
    },

    profile: async function (req, res) {

        let validateRequest = await customServices.validateRequestForRequiredParam(req.allParams(), ['id'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Id field is required.', validateRequest), res);
            return;
        }

        let params = req.allParams();

        let response = await User.profile(params.id);

        res.ok(response);
    },

    update: async function (req, res) {

        let reqParams = req.allParams();

        let validateRequest = await customServices.validateRequestForRequiredParam(reqParams, ['user_id'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('User id field is required.', validateRequest), res);
            return;
        }

        let user = await User.profile(reqParams.user_id);

        if (!user) {
            customServices.sendErrorResponse(customServices.createMsgForClient(sails.__("api.user.not_found"), ''), res);
            return;
        }

        delete reqParams.guest_user;

        reqParams.notifications = reqParams.notifications ? parseInt(reqParams.notifications) : user.notifications;
        reqParams.soloTimer = reqParams.soloTimer ? parseInt(reqParams.soloTimer) : user.soloTimer;
        reqParams.soundEffects = reqParams.soundEffects ? parseInt(reqParams.soundEffects) : user.soundEffects;

        let updUser = await User.updateOne({id: user.id}).set(reqParams);

        updUser = await User.profile(updUser.user_id);

        customServices.sendSuccessResponse(customServices.createMsgForClient(sails.__("api.user.profile_updated_success"), updUser), res);
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

        let users = await User.findAll(params)

        customServices.sendSuccessResponse(customServices.createPaginatedMsgForClient("User fetched successfully.", users.data, users.pagination), res);

    },

    stats: async function (req, res) {

        let params = req.allParams();

        let validateRequest = await customServices.validateRequestForRequiredParam(params, ['id'])

        if (!validateRequest.status) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Id is required', validateRequest), res);
            return;
        }

        let response = await User.profile(params.id);

        if (!response) {
            customServices.sendErrorResponse(customServices.createMsgForClient('Invalid User Id', validateRequest), res);
            return;
        }

        response.games = await MatchUser.count({user_id: params.id});

        response.gamesWon = await MatchUser.count({
            user_id: params.id,
            result: sails.config.custom.game_result.win,
            matchStarted: true,
            scoreUpdated: true
        });

        response.gamesLost = await MatchUser.count({
            user_id: params.id,
            result: sails.config.custom.game_result.lose,
            matchStarted: true,
            scoreUpdated: true
        });

        response.gamesDraw = await MatchUser.count({
            user_id: params.id,
            result: sails.config.custom.game_result.draw,
            matchStarted: true,
            scoreUpdated: true
        });

        let topScore = await MatchUser.find({
            user_id: params.id,
            matchStarted: true,
            scoreUpdated: true
        }).limit(1).sort('score DESC');

        topScore = topScore[0];

        response.topScore = topScore ? topScore.score : 0;

        response.winPercentage = response.gamesWon ? (response.gamesWon / response.games) * 100 : 0;

        res.ok(response);
    },

    login: async function (req,res) {

        let inputs = req.allParams();

        // Look up by the email address.
        // (note that we lowercase it to ensure the lookup is always case-insensitive,
        // regardless of which database we're using)
        var userRecord = await BusinessUser.findOne({
            emailAddress: inputs.emailAddress.toLowerCase(),
        });

        // If there was no matching user, respond thru the "badCombo" exit.
        if (!userRecord) {
            return res.redirect('/login?res=0');
        }

        // If the password doesn't match, then also exit thru "badCombo".
        let invalidPass = false
        try {
            await sails.helpers.passwords.checkPassword(inputs.password, userRecord.password)
                .intercept('incorrect', () => {
                    console.log('incorrect');
                    invalidPass = true
                    // return 'badCombo'
                });
        }
        catch (error) { }

        if (invalidPass) {
            console.log('incorrect2');
            return res.redirect('/login?res=0');
        }

        // If "Remember Me" was enabled, then keep the session alive for
        // a longer amount of time.  (This causes an updated "Set Cookie"
        // response header to be sent as the result of this request -- thus
        // we must be dealing with a traditional HTTP request in order for
        // this to work.)
        


        //-- PERMISSIONS
       

        // let permissions = await Role.findOne({ id: userRecord.role_id.toString() })
        // req.session.permissions = permissions.permissions
        req.session.userId = userRecord.id;
        return res.redirect('/');
    }
};
