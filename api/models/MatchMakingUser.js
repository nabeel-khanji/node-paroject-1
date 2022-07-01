/**
 * MatchMakingUser.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

 const BaseController = require("../controllers/BaseController");

 const route = "users";

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

    findAvailableUsers: async function (params) {

        let waitingUser = await MatchMakingUser.find({
            user_id: {'!=': params.user_id},
            shotType: params.shotType,
            shotLength: params.shotLength
        }).limit(1);

        if (waitingUser.length) {

            waitingUser = waitingUser[0];

            await MatchMakingUser.destroy({id: waitingUser.id});

            MatchMakingUser.notifyUserAboutMatchInRoom(params.user_id, waitingUser.user_id, waitingUser);
            return;
        }

        await MatchMakingUser.destroy({user_id: params.user_id});

        await MatchMakingUser.create(params);
    },

    notifyUserAboutMatchInRoom: async function (requesting_user_id, target_user_id, matchMaking) {

        let targetUser = await User.findOne({id: target_user_id});

        let requestingUser = await User.findOne({id: requesting_user_id});

        if (!targetUser) {

            MatchMakingUser.findAvailableUsers({user_id: requesting_user_id});
            return;
        }

        let match = await Match.create({
            creator: requestingUser.id,
            shotType: matchMaking.shotType,
            shotLength: matchMaking.shotLength,
            matchType: 'random',
            name: targetUser.name + ' vs ' + requestingUser.name
        }).fetch();

        await MatchUser.create({match_id: match.id, user_id: targetUser.id});

        await MatchUser.create({match_id: match.id, user_id: requestingUser.id});

        let msg = JSON.stringify({match_id: match.id})

        BusinessUser.sendMessageToRocketChatRoom(targetUser.rocketChatRoomObj.roomId, msg)

        BusinessUser.sendMessageToRocketChatRoom(requestingUser.rocketChatRoomObj.roomId, msg)

    },

    
};

