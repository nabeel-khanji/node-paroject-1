/**
 * Created by shoaibarshad on 6/6/18.
 */
/**
 * Description: Creates and logs notification
 */
const got = require('got'); ////////////////////////// https://www.npmjs.com/package/got#api

module.exports = async function (device_tokens, obj) {

    let notification_identifier = await NotificationsIdentifiers.findOne({identifier: obj.target_identifier});

    let wildcards = notification_identifier.wildcards.split(',');

    if (wildcards.length > 0) {
        wildcards.map(function (wildcard, index) {
            if (wildcard != '')
                notification_identifier.body = notification_identifier.body.replace(wildcard, " " + obj.replacer[index]);
        })
    }
    console.log('notification about to sent')

    let FormData = require('form-data');

    let form = new FormData();

    let payload = {
        registration_ids: device_tokens,
        notification: {
            body: notification_identifier.body.replace(/<[^>]*>/g, ''),
            sound: '1',
        },
        data: {
            'sender': obj.actor.id,
            'reference_id': obj.reference_id,
            'target_identifier': obj.target_identifier,
        }
    };

    form.append('payload', JSON.stringify(payload));

    const notificationURLSend =
        sails.config.microservice.notification.base_url +
        sails.config.microservice.notification.sendNotification.uri;

    got.post(notificationURLSend, {
        headers: {
            token: sails.config.microservice.notification._token
        },
        body: form
    }).then(res => {
        console.log("Notification =>", res.body)
    }).catch(e => {
        console.log("Notification Error =>", e)
    });

}
