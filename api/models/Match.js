/**
 * Match.js
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

    afterCreate: async (data, proceed) => {

        data.rocketChatRoomObj = await Match.createRocketChatRoom(data);

        await Match.updateOne({id: data.id}).set({doc_id: data.id});

        proceed();
    },

    createRocketChatRoom: async (match) => {

        let user = await User.findOne({id: match.creator});

        let params = {
            name: `room-${match.id}-${new Date().getTime()}`
        };

        let rocketChatResp = await rocketChat.createRoom({
            authToken: user.rocketChatObj.authToken,
            userId: user.rocketChatObj.userId
        }, params);

        rocketChatResp = JSON.parse(rocketChatResp.body);
        console.log('match ', rocketChatResp)
        if (rocketChatResp.success) {

            let rocketChatObj = {
                'roomId': rocketChatResp.group._id,
                'roomName': rocketChatResp.group.name
            };

            await Match.update({id: match.id}).set({
                'rocketChatRoomObj': rocketChatObj
            });


            return rocketChatObj;
        }

    },

    addUserToMatchRoom: async (room_id, user_id, creator_id) => {

        if (user_id == creator_id) {
            return;
        }

        let creator = await User.findOne({id: creator_id});

        let user = await User.findOne({id: user_id});

        let memberParams = {
            roomId: room_id,
            userId: user.rocketChatObj.userId,
        }

        await rocketChat.addMemberToRoom({
            authToken: creator.rocketChatObj.authToken,
            userId: creator.rocketChatObj.userId
        }, memberParams);

    },

    findMatchById: async function (params) {

        let validMatchUser = await MatchUser.count({match_id: params.id, user_id: params.user_id});

        if (!validMatchUser) {

            throw "Invalid User in Match";
        }

        let match = await Match.findOne({id: params.id});

        if (!match) {

            throw "Invalid Match Id";
        }

        match = await MatchUser.getMatchUsersData(match);

        return match;
    },

    rematch: async function (match_id, user_id, match_name) {

        let match = await Match.findOne({previous_match_id: match_id})

        if (!match) {

            match = await Match.create({
                creator: user_id,
                name: match_name,
                previous_match_id: match_id,
                matchType: 'random'
            }).fetch();

        }

        let match_user = await MatchUser.count({match_id: match.id, user_id: user_id});

        if (!match_user) {

            await MatchUser.create({match_id: match.id, user_id: user_id});
        }

        if (match.creator != user_id) {

            Match.addUserToMatchRoom(match.rocketChatRoomObj.roomId, user_id, match.creator);
        }

        return match;
    },

    createFriendlyMatch: async function (params) {

        params.creator = params.user_id;
        params.name = 'Friendly Match'
        params.matchType = 'friendly'

        params.user_ids = params.user_ids.split(',');

        let deviceTokens = [];

        let users = params.user_ids.map(async function (user_id, index) {

            let user = await User.profile(user_id);

            if (!user) {
                throw `Invalid User id on ${index} index`;
            }

            if (user.notifications && user.deviceToken) {
                deviceTokens.push(user.deviceToken);
            }

            return user

        })

        users = await Promise.all(users);

        delete params.user_ids;
        delete params.user_id;

        let creator = await User.profile(params.creator);

        users.push(creator);

        let match = await Match.create(params).fetch();

        users.map(async function (user) {

            await MatchUser.create({match_id: match.id, user_id: user.id});
        });

        if (deviceTokens.length) {

            let notificationObj = {
                target_identifier: 'invite_user',
                replacer: [creator.name],
                actor: creator,
                reference_id: match.id,
                references: {
                    match_id: match.id,
                }
            };

            sendNotification(deviceTokens, notificationObj)
        }

        return match
    },

    findAll: async (params) => {

        let match = {
            where: {scoreUpdated: true, user_id: params.user_id}
        };

        let total = await MatchUser.count(match)

        let match_users = await MatchUser.find(match).limit(params.limit).skip(params.offset);

        let matches = match_users.map(async function (matchUser) {

            let match = await Match.findOne({id: matchUser.match_id});

            match = await MatchUser.getMatchUsersData(match);

            return match;
        })

        return Promise.all(matches).then((data) => {

            return {
                data: data,
                pagination: customServices.pagination_detail(total, params.page, params.limit)
            };
        });
    }
};

