const { extractDate } = require('./reminder-manager.js');

module.exports = (text, from, respondWith) => {
    const date = extractDate(text);
    if (!date) {
        return respondWith('Couldn\'t find the date in the reminder.');
    }

    const delay = date.getTime() - (new Date().getTime());
    setTimeout(() => {
        respondWith(text);
    }, delay);
    respondWith(`Will remind you on ${date.toString()}`);
};

module.exports.match = (text) => /^remind/i.test(text);
