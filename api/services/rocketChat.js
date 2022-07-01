/**
 * Created by shoaibarshad on 3/8/19.
 */
const got = require('got'); ////////////////////////// https://www.npmjs.com/package/got#api
var FormData = require('form-data');
var sha256 = require('js-sha256').sha256;

const rocketChatGenericPassword = '!Letmein123';
module.exports = {

    createUser: async (obj) => {

        if (!obj.pass) {
            obj.pass = rocketChatGenericPassword;
        }

        let payload = obj

        const createUserUrl =
            sails.config.microservice.rocketChat.base_url +
            sails.config.microservice.rocketChat.create.uri;

        const resp = await got.post(createUserUrl, {
            body: JSON.stringify(payload)
        }).catch(err => {
            console.log('err', err)
        })

        const loginResponse = await rocketChat.login({id: payload.username});

        return loginResponse;
    },

    login: async (obj) => {

        let payload = {"user": obj.id, "password": (obj.password ? obj.password : rocketChatGenericPassword)}

        const loginUserUrl =
            sails.config.microservice.rocketChat.base_url +
            sails.config.microservice.rocketChat.login.uri;

        const resp = await got.post(loginUserUrl, {
            body: JSON.stringify(payload)
        })

        return resp;

    },

    updateUser: async (accessToken, obj) => {

        let payload = obj;

        const url =
            sails.config.microservice.rocketChat.base_url +
            sails.config.microservice.rocketChat.update.uri;

        const resp = await got.post(url, {
            headers: {
                'X-Auth-Token': accessToken.authToken,
                'X-User-Id': accessToken.userId
            },
            body: JSON.stringify(payload)
        }).catch(err => {
            console.log(err)
        })

        return resp;

    },

    deleteUser: async (accessToken, obj) => {
        if (!obj.password) {
            obj.password = sha256(rocketChatGenericPassword);
        }
        let payload = obj;

        const url =
            sails.config.microservice.rocketChat.base_url +
            sails.config.microservice.rocketChat.deleteUser.uri;

        const resp = await got.post(url, {
            headers: {
                'X-Auth-Token': accessToken.authToken,
                'X-User-Id': accessToken.userId
            },
            body: JSON.stringify(payload)
        }).catch(err => {
            console.log(err)
        })

        return resp;

    },

    createRoom: async (accessToken, obj) => {

        let payload = obj;

        const url =
            sails.config.microservice.rocketChat.base_url +
            sails.config.microservice.rocketChat.createRoom.uri;

        const resp = await got.post(url, {
            headers: {
                'X-Auth-Token': accessToken.authToken,
                'X-User-Id': accessToken.userId
            },
            body: JSON.stringify(payload)
        }).catch(err => {
            console.log(err)
        })

        return resp;

    },

    addMemberToRoom: async (accessToken, obj) => {

        let payload = obj;

        const url =
            sails.config.microservice.rocketChat.base_url +
            sails.config.microservice.rocketChat.addMemberToRoom.uri;

        const resp = await got.post(url, {
            headers: {
                'X-Auth-Token': accessToken.authToken,
                'X-User-Id': accessToken.userId
            },
            body: JSON.stringify(payload)
        }).catch(err => {
            console.log(err)
        })

        return resp;

    },

    sendMessage: async (accessToken, obj) => {

        let payload = obj;

        const url =
            sails.config.microservice.rocketChat.base_url +
            sails.config.microservice.rocketChat.sendMessage.uri;

        const resp = await got.post(url, {
            headers: {
                'X-Auth-Token': accessToken.authToken,
                'X-User-Id': accessToken.userId
            },
            body: JSON.stringify(payload)
        }).catch(err => {
            console.log(err)
        })

        return resp;

    },

}
