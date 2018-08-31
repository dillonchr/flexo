require('dotenv').config();
const http = require('http');
const sms = require('./responder');
const body = require('./body');
const errors = require('./errors.js');
const routes = require('./routes');

http
    .createServer((req, res) => {
        body(req, (err, data) => {
            if (err) {
                errors.track(err);
                res.writeHead(500);
            } else {
                const {from, text, applicationId} = data;
                if (applicationId === process.env.BANDWIDTH_APP_ID) {
                    const matchedRoute = routes.find((route) => {
                        return route.match(text, from);
                    });

                    if (matchedRoute) {
                        res.writeHead(200);
                        matchedRoute(text, from, responseText => sms.send(from, responseText));
                    } else {
                        res.writeHead(404);
                    }
                } else {
                    res.writeHead(401);
                }
            }
            res.end();
        });
    })
    .listen(process.env.port || 3000);

