/**
 * customWebSocket hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

/*const socketio = require('socket.io')(sails.config.custom.webSocketPort, {
    allowEIO3: true,
    transports: ['websocket'],
    path: '/socket.io',
    cors: {
        origin: true,
        credentials: true
    },
});*/


module.exports = function defineCustomWebSocketHook(sails) {

    return {

        /**
         * Runs when this Sails app loads/lifts.
         */
        initialize: async function () {

            sails.log.info('Initializing custom hook (`customWebSocket`)');

            /*global.socketio = socketio;

            global.socketio.use(async function (socket, next) {

                if (socket.handshake.query && socket.handshake.query.token) {

                    let authenticate = await MatchMakingSocket.authenticate(socket.handshake.query.token)

                    if (!authenticate.authenticated) {
                        next(new Error('Invalid Access token'));
                    }

                    socket.user_id = authenticate.user_id;
                    socket.user_name = authenticate.user_name;


                    next();
                } else {

                    next(new Error('Authentication error'));
                }
            }).on('connection', (socket) => {

                MatchMakingSocket.connection(socket)
            })*/
        }

    };

};
