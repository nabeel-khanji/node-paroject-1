/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

// const email_verification_controller = 'EmailVerificationController';
// const upload_controller = 'UploadController';
// const user_controller = 'UserController';
// const match_controller = 'MatchController';
// const country_controller = 'CountryController';
const dashboard_controller = 'DashboardController';
const gameplay_controller = 'GameplayController';

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` your home page.            *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    //'/': { view: 'pages/entrance/login' },

    // 'GET /': { controller: 'DashboardController', action: 'index' },
    'GET /': { controller: 'DashboardController', action: 'index' },

    'GET /login': { action: 'entrance/view-login' },
    // 'GET /logout': { action: 'dashboard/view-welcome' },
    
    'POST /api/v1/entrance/login': { action: 'entrance/login' },
    'POST /logout':{controller:'LogoutController',action:'logout'},
    // 'POST /logout':{action:'dashboard/view-welcome'},
    
    
    'GET /ringsColor': { controller: 'RingsController', action: 'index' },
    
    
    
    'GET /pushNotification': { controller: 'PushController', action: 'index' },
    'GET /gameplay': { controller: 'GameplayController', action: 'index' },
    'GET /privacy': { controller: 'PrivacyController', action: 'index' },
    'POST /editPrivacy/:id': { controller: 'PrivacyController', action: 'editPrivacy' },
    'GET /contactus': { controller: 'ContactusController', action: 'index' },
    
    'GET /users': { controller: 'UserController', action: 'users' },

    'GET /test':{controller:'UserManagementController',action:'test'},
    'GET /topUsersData':{ controller: 'UserManagementController', action: 'topUsersData' },
    


    // User Management
    'GET /users': { controller: 'UserManagementController', action: 'index' },
    'GET /usersData':{ controller: 'UserManagementController', action: 'userData' },
    'GET /user_add': { controller: 'UserManagementController', action: 'add' },
    'POST /user_store': { controller: 'UserManagementController', action: 'store' },
    'GET /saveUser': { controller: 'SaveUserController', action: 'index' },
    'GET /user_update/:id' :{ controller: 'UserManagementController', action: 'edit'},
    'POST /user_update/' :{ controller: 'UserManagementController', action: 'update'},
    'POST /user_delete' :{ controller: 'UserManagementController', action: 'delete'},
    'GET /user_view/:id' :{ controller: 'UserManagementController', action: 'view'},
    'POST /login_po': { controller: 'UserManagementController', action: 'login' },

    // Achievements Management
    'GET /achievements': { controller: 'AchievementsController', action: 'index' },
    'GET /achievementsData':{ controller: 'AchievementsController', action: 'achievementsData' },
    'GET /achievements_add': { controller: 'AchievementsController', action: 'add' },
    'POST /achievements_store': { controller: 'AchievementsController', action: 'store' },
    'GET /achievements_update/:id' :{ controller: 'AchievementsController', action: 'edit'},
    'POST /achievements_update' :{ controller: 'AchievementsController', action: 'update'},
    'POST /achievements_delete' :{ controller: 'AchievementsController', action: 'delete'},
    'GET /achievements_view/:id' :{ controller: 'AchievementsController', action: 'view'},
    

     // Achievements Management
     'GET /notifications': { controller: 'PushController', action: 'index' },
     'GET /notificationsData':{ controller: 'PushController', action: 'notificationsData' },
     'GET /notifications_add': { controller: 'PushController', action: 'add' },
     'POST /notifications_store': { controller: 'PushController', action: 'store' },
     'GET /notifications_update/:id' :{ controller: 'PushController', action: 'edit'},
     'POST /notifications_update' :{ controller: 'PushController', action: 'update'},
     'POST /notifications_delete' :{ controller: 'PushController', action: 'delete'},
     'GET /notifications_view/:id' :{ controller: 'PushController', action: 'view'},

     





    /***************************************************************************
     *                                                                          *
     * More custom routes here...                                               *
     * (See https://sailsjs.com/config/routes for examples.)                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the routes in this file, it   *
     * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
     * not match any of those, it is matched against static assets.             *
     *                                                                          *
     ***************************************************************************/

    //Email Verification Routes
    // 'POST /verify-email': email_verification_controller + '.sendVerificationCode',
    // 'POST /verify-email-code': email_verification_controller + '.verifyAuthCode',

    // //User Route
    // 'POST /social-login': user_controller + '.socialLogin',
    // 'POST /guest-login': user_controller + '.guestLogin',
    // 'GET /profile/:id': user_controller + '.profile',
    // 'PUT /update-profile': user_controller + '.update',
    // 'GET /user/stats/:id': user_controller + '.stats',

    // //Upload Routes
    // 'POST /file/upload': upload_controller + '.uploadFile',

    // //Match Routes
    // 'POST /find-match': match_controller + '.findMatch',
    // 'POST /rematch/:id': match_controller + '.rematch',
    // 'PUT /start-match/:id': match_controller + '.startMatch',
    // 'PUT /update-match-score/:id': match_controller + '.updateMatchScores',

    // //Country Routes
    // 'GET /countries': country_controller + '.find',
    // 'GET /states/:id': country_controller + '.getStates',
};