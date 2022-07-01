/**
 * Token.js
 *
 * @description :: A model definition represents a database table/collection.
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

    updateToken: async (token) => {
        return await Tokens.update({'accessToken': token}).set({
            'accessToken': customServices.generateUUID(),
            'expiration': Tokens.setExpiryTime()
        });
    },
    setExpiryTime: () => {
        let limit = sails.config.custom.token_expiry;
        return Date.now() + limit * 24 * 60 * 60 * 1000
    },

    createTokenForUser: async (user_id) => {
        await Tokens.destroy({
            'user_id': user_id
        });

        let access_token = await Tokens.create({
            'accessToken': customServices.generateUUID(),
            'user_id': user_id,
            'expiration': Tokens.setExpiryTime()
        }).fetch();

        return access_token;
    }
};

