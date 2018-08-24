const sms = require('../../responder');
const { extractDate } = require('./reminder-manager.js');
const { addReminder, getPersistedReminders } = require('./db.js');

const superSetTimeout = (fn, date) => {
    const diff = date.getTime() - (new Date().getTime());
    if (diff > 0x7FFFFFFF) {
        setTimeout(() => superSetTimeout(date, fn), 0x7FFFFFFF);
    } else {
        setTimeout(fn, diff);
    }
};

module.exports = (text, from, respondWith) => {
    const date = extractDate(text.substr(7));
    if (!date) {
        return respondWith('Couldn\'t find the date in the reminder.');
    }

    addReminder(from, date.message, date, (err) => {
        if (err) {
            return respondWith('Failed to save reminder! Sorry man.');
        }
        superSetTimeout(() => {
            respondWith(text);
        }, date);
        respondWith(`Will remind you on ${date.toString()}`);
    });
};

module.exports.match = (text) => /^remind/i.test(text);

getPersistedReminders((err, reminders) => {
    if (err) {
        return;
    }
    const now = new Date().getTime();
    Object.keys(reminders)
        .forEach(from => {
            reminders[from]
                .filter(({date}) => new Date(date).getTime() > now)
                .forEach(({date, message}) => {
                    superSetTimeout(() => sms.send(from, message), new Date(date));
                });
        });
});
