const fs = require('fs');
const path = require('path');
const jsonPath = path.join(process.env.DATA_DIR, 'reminders.json');

const getPersistedReminders = (fn) => {
    fs.readFile(jsonPath, 'utf-8', (err, data) => {
        try {
            const reminders = JSON.parse(data);
            if (!reminders || !Object.keys(reminders).length) {
                throw new Error('empty');
            }
            fn(null, reminders);
        } catch (ignore) {
            fn(null, {});
        }
    });
};

const saveReminders = (fn, data) => {
    fs.writeFile(jsonPath, JSON.stringify(data), 'utf-8', fn);
};

const addReminder = (from, message, date, fn) => {

    getPersistedReminders((err, reminders) => {
        if (err) {
            return fn(err);
        }

        if (!reminders[from]) {
            reminders[from] = [];
        }

        reminders[from].push({message, date});
        saveReminders(fn, reminders);
    });
};

module.exports = {
    addReminder,
    getPersistedReminders,
    saveReminders
};
