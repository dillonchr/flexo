const {paycheck} = require('@dillonchr/funhouse');
const Errors = require('../errors');

module.exports = (text, _, respondWith) => {
    const amount = (text.match(/[0-9.]+/) || []).shift();
    const balanceResponse = (err, balance) => {
        if (err) {
            Errors.track(err);
            respondWith('Couldn\'t load response');
        } else {
            respondWith(`${amount ? 'Now you have ': ''}$${balance.balance}`);
        }
    };
    if (amount) {
        const call = /reset/.test(text) ? paycheck.reset : paycheck.spend;
        call(amount, balanceResponse);
    } else {
        paycheck.balance(balanceResponse);
    }
};

module.exports.match = (text, from) => {
    return /^paycheck/i.test(text) && process.env.BANKRUPT_USERS.includes(from);
};