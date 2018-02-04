const { gdq } = require('../funhouse');

module.exports = (respondWith) => {
    gdq((err, games) => {
        if (games && games.length) {
            const textResponse = games.slice(0, 5)
                .map(({ runners, title, start, ends, estimate }) => {
                    return `${title}\n${start} - ${ends}\n${runners}\n`;
                })
                .join('---\n');
            respondWith(textResponse);
        } else {
            respondWith('Couldn\'t find any upcoming games in the schedule.');
        }
    });
};