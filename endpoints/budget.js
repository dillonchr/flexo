const { budget } = require('funhouse-client');
const Errors = require('../errors');

module.exports = (text, from, respondWith) => {
    const [ amount, description ] = (text.match(/([0-9.]+) (.*)$/) || []);
    const balanceResponse = (err, balance) => {
        if (err) {
            Errors.track(err);
            respondWith('Couldn\'t load response');
        } else {
            respondWith(`${amount && description ? 'Now you have ': ''}$${balance.balance}`);
        }
    };
    if (amount && description) {
        budget.bought(from, {amount, description}, balanceResponse);
    } else {
        budget.balance(from, balanceResponse);
    }
};
