var exports = module.exports;

var usernames = {};
var rooms = [
    {name: "match-making-533922958781", creator: "Anonymous"},
    {name: "global", creator: "Anonymous"},
];

exports.connection = function (socket) {

    socket.emit("userName", socket.user_name);

    socket.on("joinRoom", async function (params) {

        let join_successfully = await MatchMakingRoomUser.joinRoom(socket, params);

        if (join_successfully)
            socket.emit("updateRooms", rooms, params.room_id);
    });

    socket.on("sendMessage", function (data) {
        socketio.sockets.to(socket.currentRoom).emit("updateChat", socket.user_name, data);
    });

    socket.on("createRoom", function (room) {
        if (room != null) {
            rooms.push({name: room, creator: socket.user_name});
            socketio.sockets.emit("updateRooms", rooms, null);
        }
    });

    socket.on("updateRooms", function (room) {
        socket.broadcast
            .to(socket.currentRoom)
            .emit("updateChat", "INFO", socket.user_name + " left room");
        socket.leave(socket.currentRoom);
        socket.currentRoom = room;
        socket.join(room);
        socket.emit("updateChat", "INFO", "You have joined " + room + " room");
        socket.broadcast
            .to(room)
            .emit(
                "updateChat",
                "INFO",
                socket.user_name + " has joined " + room + " room"
            );
    });

    socket.on("disconnect", async function () {
        console.log(`User ${socket.user_name} disconnected from server.`);

        await MatchMakingRoomUser.destroy({
            user_id: socket.user_id
        });

        socket.broadcast.emit(
            "updateChat",
            "INFO",
            socket.user_id + " has disconnected"
        );
    });
}

exports.authenticate = async function (auth_token) {

    let access_token_data = await Tokens.findOne({accessToken: auth_token})
        .catch(function (err) {

            return {
                authenticated: false,
                error: "Invalid Token"
            };
        });


    if (!access_token_data || Date.now() > access_token_data.expiration) {

        return {
            authenticated: false,
            error: "Expired Token"
        };
    }

    let userData = await User.findOne({
        id: access_token_data.user_id
    });

    if (!userData) {

        return {
            authenticated: false,
            error: "User not available"
        }
    }

    return {
        authenticated: true,
        user_id: access_token_data.user_id,
        user_name: userData.name
    }
}


