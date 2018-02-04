const Bandwidth = require('node-bandwidth');
const Errors = require('./errors');
const client = new Bandwidth({
    userId: process.env.BANDWIDTH_USER_ID,
    apiToken: process.env.BANDWIDTH_API_TOKEN,
    apiSecret: process.env.BANDWIDTH_API_SECRET 
});

module.exports = {
    send(to, text) {
        client.Message.send({
            from: process.env.BANDWIDTH_PHONE_NUMBER,
            to,
            text
        }, (err, msg) => {
            if (err) {
                Errors.track(err);
            } else {
                console.log(msg.id);
            }
        })
    }
};
