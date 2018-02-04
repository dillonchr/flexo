const { fired } = require('../funhouse');

module.exports = (text, respondWith) => {
    const call = /update/i.test(text) ? fired.update : fired.list;
    call((err, results) => {
        if (err) {
            respondWith('Sorry, couldn\'t get results, server errored out.');
        } else {
            respondWith(results.length ? results.map(e => e.name).join('\n') : 'No one new.');
        }
    });
};