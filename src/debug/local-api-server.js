const express = require('express'),
    path = require('path'),
    readline = require('readline'),
    rl = readline.createInterface(process.stdin),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    bodyParser = require('body-parser')

function loadDebugData() {
    data = {
        lxcas: require('./data/lxcas.json')
    };
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ok(something) {
    return {
        RetCode: 'OK',
        RetMessage: '',
        Data: something || null
    };
}

function error(message, data) {
    return {
        RetCode: 'Error',
        RetMessage: message,
        Data: data || null
    };
}

app.use(bodyParser.json());

app.get('/api/download', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, './data/download.sample.zip'));
});

app.all('*', (req, res, next) => {
    console.log();
    let date = new Date();
    console.log(date.toLocaleString());
    console.log(req.query);
    console.log(`X-Feature-Path: ${req.header('X-Feature-Path')}`);
    return next();
});

app.all(
    '/api/nodes/:node/features/LenovoServerManagement/',
    async (req, res, next) => {
        switch (req.query.operation) {
            case 'Session.Login':
                return res.json(ok()).end();
            default:
                return next();
        }
    }
);

function start() {
    loadDebugData();
    server.listen(8000, () => {
        console.log(`api @ 8000`);
        console.log(`press enter to reset data to initial state`);
    });
}

rl.addListener('line', () => {
    console.log(`closing...`);
    server.close(() => {
        console.log(`restarting...`);
        start();
    });
});

start();