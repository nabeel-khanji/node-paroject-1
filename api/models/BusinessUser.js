/**
 * BusinessUser.js
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

    initializeData: async () => {
        let role = await Role.findOne({slug: 'super_admin'})
 
        let params = {
            emailAddress: 'admin@4par.om',
            name: 'Administrator',
            isSuperAdmin: true,
            password: await sails.helpers.passwords.hashPassword('AsEM5jLAJ54ywoJgJZU1'),
            role_id: role.id
        }

        await BusinessUser.create(params).fetch();

    },

    afterCreate: async (data, proceed) => {

        data.rocketChatObj = await BusinessUser.createUserOnRocketChat(data);

        await BusinessUser.updateOne({id: data.id}).set({user_id: data.id});

        proceed();
    },

    createUserOnRocketChat: async (data) => {

        let rocketChatData = {
            'name': (data.name ? data.name : data.id),
            'email': data.id + '@4par.com',
            'username': data.id,
            'verified': true,
            customFields: {
                avatar: (data.avatar ? data.avatar : ''),
                appId: data.id
            }
        };

        let rocketChatResp = await rocketChat.createUser(rocketChatData);

        rocketChatResp = JSON.parse(rocketChatResp.body);

        if (rocketChatResp.status == 'success') {

            let rocketChatObj = {
                'userId': rocketChatResp.data.userId,
                'authToken': rocketChatResp.data.authToken,
                'user_name': rocketChatResp.data.me.username,
            };

            await BusinessUser.update({id: data.id}).set({
                'rocketChatObj': rocketChatObj
            });

            return rocketChatObj;
        }
    },

    addAdminToMemberChat: async (room_id, user) => {

        let admin_user = await BusinessUser.find({isSuperAdmin: true}).limit(1);

        admin_user = admin_user[0];

        let memberParams = {
            roomId: room_id,
            userId: admin_user.rocketChatObj.userId,
        }``

        await rocketChat.addMemberToRoom({
            authToken: user.rocketChatObj.authToken,
            userId: user.rocketChatObj.userId
        }, memberParams);

    },

    loginRocketChat: async (user_id) => {

        let rocketChatResp = await rocketChat.login({id: user_id});

        rocketChatResp = JSON.parse(rocketChatResp.body);

        if (rocketChatResp.status == 'success') {

            let rocketChatObj = {
                'userId': rocketChatResp.data.userId,
                'authToken': rocketChatResp.data.authToken,
                'user_name': rocketChatResp.data.me.username,
            };

            await BusinessUser.update({id: user_id}).set({
                'rocketChatObj': rocketChatObj
            });

            return rocketChatObj;
        }
    },

    sendMessageToRocketChatRoom: async (room_id, msg) => {

        let admin_user = await BusinessUser.find({isSuperAdmin: true}).limit(1);

        admin_user = admin_user[0];

        let params = {
            roomId: room_id,
            text: msg,
            alias: "match_created",
        }

        let response = await rocketChat.sendMessage({
            authToken: admin_user.rocketChatObj.authToken,
            userId: admin_user.rocketChatObj.userId
        }, params);

        console.log(response.body)
    }
};

