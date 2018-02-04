const request = require('request');
const body = require('./body');
const BASE_URL = 'http://localhost:7716';

const makeApiCall = (url, onResponse) => {
    request({
        url: BASE_URL + url,
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
    inflation(dollars, year, onResponse) {
        makeApiCall(`/inflation/${year}/${dollars}`, onResponse);
    }
};