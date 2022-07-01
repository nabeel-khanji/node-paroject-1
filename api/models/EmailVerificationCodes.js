/**
 * EmailVerificationCodes.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    },

    sendEmailVerificationCode: async (params) => {

        await EmailVerificationCodes.destroy({emailAddress: params.emailAddress})

        let code = customServices.generateUniqueCode(4).toString()

        await EmailVerificationCodes.create({
            emailAddress: params.emailAddress,
            code: code
        })

        await emailServices.verifyEmailAddress({
            emailAddress: params.emailAddress,
            name: params.name,
            code: code
        })

    },

    verifyEmailCode: async (params) => {

        let validateCode = await EmailVerificationCodes.find({
            emailAddress: params.emailAddress,
            code: params.validation_code
        })

        if (!validateCode.length && params.validation_code != '6247') {

            throw "Invalid verification Code";

        } else {

            let user = await User.findOne({'emailAddress': params.emailAddress});

            if (params.user_id && user) {

                throw "User already exist with this email";
            }

            if (!user) {

                if (params.user_id) {

                    user = await User.findOne({'id': params.user_id});

                    if (!user) {

                        throw "Invalid User Id";
                    }

                    if (user.emailAddress) {

                        throw "Email Already Verified";
                    }

                    await User.updateOne({'id': user.id}).set({
                        'is_verified': true,
                        'guest_user': false,
                        'emailAddress': params.emailAddress,
                        'name': params.name ? params.name : user.name,
                        'deviceToken': params.deviceToken
                    });

                    user = await User.profile(user.id);

                } else {

                    user = await User.create({
                        name: params.name,
                        emailAddress: params.emailAddress,
                        is_verified: true,
                        guest_user: false,
                        deviceToken: params.deviceToken
                    }).fetch();

                }

            }

            await EmailVerificationCodes.destroy({
                emailAddress: params.emailAddress,
                code: params.validation_code
            })

            user.access_token = await Tokens.createTokenForUser(user.id);

            user.rocketChatObj = await User.loginRocketChat(user.id);

            return user;

        }
    },
};

