const { paycheck } = require('funhouse-client');
const Errors = require('../errors');

module.exports = (text, respondWith) => {
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
        const call = /reset/.test(text) ? paycheck.reset : paycheck.pay;
        call(amount, balanceResponse);
    } else {
        paycheck.balance(balanceResponse);
    }
};