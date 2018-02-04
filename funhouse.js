const request = require('request');
const body = require('./body');

const makeApiCall = (url, onResponse) => {
    request({
        url: process.env.FUNHOUSE_URL + url,
        headers: {
            'X-API-Token': process.env.FUNHOUSE_TOKEN
        }
    }, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            onResponse(err || {error:true,status:res.statusCode});
        } else {
            try {
                onResponse(null, JSON.parse(body));
            } catch (err) {
                onResponse(err);
            }
        }
    });
};

module.exports = {
    budget: {
        balance(id, onResponse) {
            makeApiCall(`/budget/${id}`, onResponse);
        },
        bought(id, price, description, onResponse) {
            makeApiCall(`/budget/${id}/${price}/${encodeURIComponent(description)}`, onResponse);
        }
    },
    fired: {
        list(onResponse) {
            makeApiCall('/fired', onResponse);
        },
        update(onResponse) {
            makeApiCall('/fired/update', onResponse);
        }
    },
    gdq(onResponse) {
        makeApiCall('/gdq', onResponse);
    },
    inflation(dollars, year, onResponse) {
        makeApiCall(`/inflation/${year}/${dollars}`, onResponse);
    },
    paycheck: {
        balance(onResponse) {
            makeApiCall('/paycheck', onResponse);
        },
        pay(amount, onResponse) {
            makeApiCall(`/paycheck/pay/${amount}`, onResponse);
        },
        reset(amount, onResponse) {
            makeApiCall(`/paycheck/reset/${amount}`, onResponse);
        }
    }
};