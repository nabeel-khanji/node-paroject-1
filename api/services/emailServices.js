module.exports.verifyEmailAddress = async function(obj) {
    sails.hooks.email.send(
        'verifyEmail',
        obj,
        {
            to:  obj.emailAddress,
            subject: 'Verify Your Email Address'
        },
        function(err) {
            console.log(err || 'Email verification mail Sent!');
        }
    )
}
