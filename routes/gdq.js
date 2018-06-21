const {gdq} = require('@dillonchr/funhouse');
const Errors = require('../errors');

module.exports = (_, _, respondWith) => {
    gdq((err, games) => {
        if (games && games.length) {
            const textResponse = games
                .filter(g => !g.done)
                .slice(0, 5)
                .map(({runners, title, start, ends, estimate}) => {
                    return `${title}\n${start} - ${ends}\n${runners}\n`;
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
