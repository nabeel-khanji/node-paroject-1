/**
 * MatchUser.js
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
        // score: {
        //     type: 'number'
        // }
    },

    getMatchUsersData: async function (match) {

        let match_users = await MatchUser.find({match_id: match.id});

        match_users = match_users.map(async function (match_user) {

            match_user.user = await User.profile(match_user.user_id);

            return match_user;
        });

        match.users = await Promise.all(match_users);

        return match;

    },

    updateUserScores: async function (params) {

        await MatchUser.update({match_id: params.id, user_id: params.user_id}).set({
            score: parseFloat(params.score),
            scoreUpdated: true
        })

        let match_users = await MatchUser.count({match_id: params.id, matchStarted: true});

        let scores_updated = await MatchUser.count({match_id: params.id, matchStarted: true, scoreUpdated: true});

        if (match_users == scores_updated) {

            await Match.update({id: params.id}).set({
                matchEnded: true
            });

            let match_users = await MatchUser.find({
                match_id: params.id,
                matchStarted: true,
                scoreUpdated: true
            }).sort('score DESC');

            let scores = [];

            match_users.map(function (user) {

                scores.push(user.score);
            })

            const allEqual = arr => arr.every(v => v === arr[0])

            if (allEqual(scores)) {

                await MatchUser.update({
                    match_id: params.id,
                    matchStarted: true,
                    scoreUpdated: true
                }).set({result: sails.config.custom.game_result.draw})
            } else {

                match_users.map(async function (user, index) {

                    if (index < 1) {

                        await MatchUser.update({
                            id: user.id
                        }).set({result: sails.config.custom.game_result.win})
                    } else {

                        await MatchUser.update({
                            id: user.id
                        }).set({result: sails.config.custom.game_result.lose})
                    }
                })

            }
        }
    }

};

