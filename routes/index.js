var express = require('express');
var rp = require('request-promise');
var items = require('./items');
var router = express.Router();
var async = require('async');
var config = require('../config/config');

const headers = {
    'X-App-Id': config.appId,
    'X-App-Token': config.appToken
};
const apiRoot = 'https://api.voucherify.io/v1/vouchers/';

router.post('/referrer', function (req, res) {
    rp({
        uri: apiRoot + 'publish',
        method: 'POST',
        headers: headers,
        body: {
            campaign: config.campaign,
            customer: {
                source_id: req.body.email,
                email: req.body.email,
                name: req.body.fullname
            }
        },
        json: true
    }).then(function (resp) {
        res.send(resp);
    }).catch(function () {
        res.status(400).send("Error");
    });
});

router.get('/item', function (req, res) {
    res.send(items.randomElement());
});

router.get('/verify', function (req, res) {
    const code = req.query.code;
    rp({
        uri: apiRoot + code,
        headers: headers,
        json: true
    }).then(function (resp) {
        res.send({
            status: resp.active,
            discount: resp.discount
        });
    }).catch(function () {
        res.status(400).send({status: false});
    });
});

router.post('/finalize', function (req, res) {
    const code = req.body.code;
    const game = req.body.game;
    const body = {
        customer: {
            name: "Test test",
            email: "test@morgan.com"
        },
        order: {
            amount: 1,
            items: []
        },
        metadata: game
    };
    rp({
        uri: apiRoot + code + '/redemption',
        method: 'POST',
        headers: headers,
        body: body,
        json: true
    }).then(function (resp) {
        res.send(resp);
    }).catch(function () {
        res.status(400).send("Error");
    });
});

router.get('/getRedemptions', function (req, res) {
    const code = req.query.code;
    async.parallel({
        data: function (call) {
            rp({
                uri: apiRoot + code,
                headers: headers,
                json: true
            }).then(function (res1) {
                call(null, res1.publish.entries[0]);
            }).catch(function (err) {
                call(err);
            });
        },
        entries: function (call) {
            rp({
                uri: apiRoot + code + '/redemption',
                headers: headers,
                json: true
            }).then(function (res2) {
                call(null, res2)
            }).catch(function (err) {
                call(err);
            });
        }
    }, function (err, results) {
        if (err) res.status(400).send({status: false});
        res.send({
            customer: results.data,
            entries: results.entries.redemption_entries,
            total: results.entries.total
        });
    });
});

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
};

module.exports = router;
