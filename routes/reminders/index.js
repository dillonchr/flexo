const { extractDate } = require('./reminder-manager.js');

const superSetTimeout = (fn, date) => {
    const diff = date.getTime() - (new Date().getTime());
    if (diff > 0x7FFFFFFF) {
        setTimeout(() => superSetTimeout(date, fn), 0x7FFFFFFF);
    } else {
        setTimeout(fn, diff);
    }
};

module.exports = (text, from, respondWith) => {
    const date = extractDate(text);
    if (!date) {
        return respondWith('Couldn\'t find the date in the reminder.');
    }

    superSetTimeout(() => {
        respondWith(text);
    }, date);
    respondWith(`Will remind you on ${date.toString()}`);
};

module.exports.match = (text) => /^remind/i.test(text);
