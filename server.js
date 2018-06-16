require('dotenv').config();
const port = process.env.port || 3000;
const http = require('http');
const sms = require('./responder');
const body = require('./body');
const inflation = require('./endpoints/inflation');
const gdq = require('./endpoints/gdq');
const fired = require('./endpoints/fired');
const paycheck = require('./endpoints/paycheck');
const budget = require('./endpoints/budget');

http
    .createServer((req, res) => {
        body(req, (err, data) => {
            if (!err) {
                const { from, text, applicationId } = data;
                if (applicationId === process.env.BANDWIDTH_APP_ID) {
                    if (/^how much (was|is) /i.test(text)) {
                        inflation(text, text => sms.send(from, text));
                    } else if (/^gdq/i.test(text)) {
                        gdq(text => sms.send(from, text));
                    } else if (/^fired/i.test(text)) {
                        fired(text, text => sms.send(from, text));
                    } else if (/^paycheck/i.test(text)) {
                        paycheck(text, text => sms.send(from, text));
                    } else if (/^budget/i.test(text)) {
                        budget(text, from, text => sms.send(from, text));
                    }
                    res.writeHead(200);
                } else {
                    res.writeHead(401);
                }
            } else {
                console.error(err);
                res.writeHead(500);
            }
            res.end();
        });
    })
    .listen(port);
