require('dotenv').config();
const port = process.env.port || 3000;
const http = require('http');
const sms = require('./responder');
const body = require('./body');
const inflation = require('./endpoints/inflation');

http
    .createServer((req, res) => {
        body(req, (err, data) => {
            if (!err) {
                const { from, text, applicationId } = data;
                if (/^how much (was|is) /i.test(text)) {
                    //inflation.sms(text, text => sms.send(from, text));
                    inflation(text, (err, text) => console.log(err || text));
                } else if (/^gdq/i.test(text)) {
                    //gdq.sms(text => sms.send(from, text));
                } else if (/^fired/i.test(text)) {
                    //fired.sms(text, text => sms.send(from, text));
                }
            }
        });
        res.writeHead(200);
        res.end();
    })
    .listen(port);

