const { inflation } = require('funhouse-client');
const Errors = require('../errors');

module.exports = (cmd, respondWith) => {
    try {
        const matches = cmd.match(/\$([\d\.]+) in (\d{4})\??/i);
        if (matches && matches.length === 3) {
            const [dollars, year] = matches.slice(1);
            inflation(dollars, year, (err, data) => {
                respondWith(data ? `$${dollars} was worth $${data.valueThen} in ${year}` : `I don't know what the rate was for ${year}.`);
            });
        } else {
            respondWith('try again like this:\nhow much was $100 in 1989');
        }
    } catch (err) {
        Errors.track(err);
        respondWith('Man, I straight up forgot what you wanted');
    }
};
