/**
 * MicroServices settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system: for example, this would be a good place
 * to store database or email passwords that apply only to you, and shouldn't
 * be shared with others in your organization.
 *
 * These settings take precedence over all other config files, including those
 * in the env/ subfolder.
 *
 * PLEASE NOTE:
 *    local.js is included in your .gitignore, so if you're using git
 *    as a version control solution for your Sails app, keep in mind that
 *    this file won't be committed to your repository!
 *
 *    Good news is, that means you can specify configuration for your local
 *    machine in this file without inadvertently committing personal information
 *    (like database passwords) to the repo.  Plus, this prevents other members
 *    of your team from commiting their local configuration changes on top of yours.
 *
 *    In a production environment, you probably want to leave this file out
 *    entirely and leave all your settings in env/production.js
 *
 *
 * For more information, check out:
 * http://sailsjs.org/#!/documentation/anatomy/myApp/config/local.js.html
 */

module.exports.microservice = {

  /***************************************************************************
   * Your SSL certificate and key, if you want to be able to serve HTTP      *
   * responses over https:// and/or use websockets over the wss:// protocol  *
   * (recommended for HTTP, strongly encouraged for WebSockets)              *
   *                                                                         *
   * In this example, we'll assume you created a folder in your project,     *
   * `config/ssl` and dumped your certificate/key files there:               *
   ***************************************************************************/

  "notification": {
    "_token": "l45dbr49puiubr06b6pdiaz2",
    "base_url": "http://node.cubix.co:1234/",
    "sendNotification": {
      "uri": "notification/send/v2"
    }
  },

  "storage": {
    "_token": "prcuxuemvojsk3utmiprcuxuemvojsk3utmj",
    "base_url": "http://node.cubix.co:3341/",
    "uploadFile": {
      "uri": "Storage"
    },
    "deleteFiles": {
      "uri": "deleteFile"
    },
  },

  "rocketChat": {
    "_token": "50me10m0orp0l5zdtyrwea",
    "base_url": "http://node.cubix.co:3500/api/v1/",
    "create": {
      "uri": "users.register"
    },
    "login" :{
      "uri": "login"
    },
    "update" :{
      "uri": "users.update"
    },
    "setAvatar" :{
      "uri": "users.setAvatar"
    },
    "deleteUser" :{
      "uri": "users.deleteOwnAccount"
    },
    "createRoom" :{
      "uri": "groups.create"
    },
    "addMemberToRoom" : {
      "uri" : "groups.invite"
    },
    "sendMessage" : {
      "uri" : "chat.postMessage"
    }
  },

  "googlePlaces":{
    "_token": "AIzaSyCBzfbEvIZAHCM9RL8KYvryNaYrNUn8bE8",
    "geocode": {
      "url" : "https://maps.googleapis.com/maps/api/geocode/json"
    },
    "nearbysearch": {
      "url" : "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    },
    "placeByText": {
      "url" : "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    },
  }

};
