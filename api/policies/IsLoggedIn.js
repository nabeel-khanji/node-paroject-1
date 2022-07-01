// policies/isLoggedIn.js
module.exports = async function (req, res, proceed) {

    if(!req.header('X-Access-Token')){
        proceed();
        return;
    }

    let access_token_data = await Tokens.findOne({ accessToken: req.header('X-Access-Token') })
        .catch(function (err) {

            return customServices.sendInvalidAuthResponse(customServices.createMsgForClient("Invalid Access Token", err), res);
        });



    if (!access_token_data || Date.now() > access_token_data.expiration) {

        return customServices.sendInvalidAuthResponse(customServices.createMsgForClient("Expired Token", {}), res);
    }

    let userData = await User.findOne({
        id: access_token_data.user_id
    });

    if (!userData) {

        return customServices.sendInvalidAuthResponse(customServices.createMsgForClient("User not available", {}), res);

    } else {

        if (req.method == 'GET') {

            req.query.user_id = access_token_data.user_id;

        } else {

            req.body.user_id = access_token_data.user_id;

        }
    }

    proceed();
};
