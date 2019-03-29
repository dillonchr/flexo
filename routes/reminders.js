const sms = require('../responder');
const { add, connect } = require('@dillonchr/reminders');
const COMMAND_REGEX = /^remind /i;

module.exports = (text, from, respondWith) => {
    add({
        command: text.replace(COMMAND_REGEX, ''),
        userId: from,
        commandCallback: (err, res) => {
            respondWith(err || res);
        },
        onRemind: ({message}) => {
            respondWith(message);
        }
    });
};

module.exports.match = (text) => COMMAND_REGEX.test(text);

connect(({userId, message}) => {
    sms.send(userId, message);
});

