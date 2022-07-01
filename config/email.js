module.exports.email = {
    transporter: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use SSL
        auth: {
            user: 'testsmtp@cubixlabs.com',
            pass: 'cubix@2022'
        }
    },
    testMode: false
};