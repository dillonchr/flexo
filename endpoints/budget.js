const { budget } = require('../funhouse');
const Errors = require('../errors');

module.exports = (text, from, respondWith) => {
    const [ amount, description ] = (text.match(/([0-9.]+) (.*)$/) || []);
    const balanceResponse = (err, balance) => {
        if (err) {
            respondWith('Couldn\'t load response');
        } else {
            respondWith(`${amount && description ? 'Now you have ': ''}$${balance.balance}`);
        }
    };
    if (amount && description) {
        budget.bought(from, {price:amount,description}, balanceResponse);
    } else {
        budget.balance(balanceResponse);
    }
};
