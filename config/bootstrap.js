/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {


    // if (await Role.count() == 0) {
    //     await Role.initializeData();
    // }

    if (await BusinessUser.count() == 0) {
        await BusinessUser.initializeData()
    }

    // if (await NotificationsIdentifiers.count() == 0) {
    //     await NotificationsIdentifiers.initializeData()
    // }
    
};

