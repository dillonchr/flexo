const {gdq} = require('@dillonchr/funhouse');
const moment = require('moment');
const Errors = require('../errors');

const formatTimestamp = (ts) => {
    return moment(ts).utcOffset('-05:00').format('h:mm A');
};

module.exports = (_, __, respondWith) => {
    gdq((err, games) => {
        if (games && games.length) {
            const textResponse = games
                .filter(g => !g.done)
                .slice(0, 5)
                .map(({runners, title, start, ends, estimate}) => {
                    return `${title}\n${formatTimestamp(start)} - ${formatTimestamp(ends)}\n${runners}\n`;
                })
                .join('---\n');
            respondWith(textResponse);
        } else {
            if (err) {
                Errors.track(err);
            }
            respondWith('Couldn\'t find any upcoming games in the schedule.');
        }
    });
};

module.exports.match = (text) => /^gdq/i.test(text);
