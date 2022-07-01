/**
 * MatchMakingRoomUser.js
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

    joinRoom: async function (socket, params) {

        if (!params.room_id) {
            socket.emit('error', 'Room Id is required.')
            return false;
        }

        let room = await MatchMakingRoom.findOne({rid: params.room_id});

        if (!room) {
            socket.emit('error', 'Invalid Room Id.')
            return false;
        }

        await MatchMakingRoomUser.create({
            rid: params.room_id,
            socket_id: socket.id,
            user_id: socket.user_id
        });

        socket.currentRoom = params.room_id;

        socket.join(params.room_id);

        socket.emit(`updateChat", "INFO", "You have joined ${params.room_id} room`);

        socket.broadcast
            .to(params.room_id)
            .emit("updateChat", "INFO", `${socket.user_name} has joined ${params.room_id} room`);

        return true;
    }

};

