const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const DB = require('./server/db/index');
// const config = require('./server/config');
const app = express();
const fs = require('fs');
require.extensions['.sql'] = (module, filename) => {
    module.exports = fs.readFileSync(filename, 'utf8')
};

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../')));

app.use('*', express.static(path.join(__dirname, '../index.html')));

app.use(function error404Handler(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.use(function (err, req, res, next) {
    // console.log("DEFAULT ERROR HANDLER");
    console.error("err: " + err.message, "stack: " + err.stack);
    res.status(err.status || 500).send({ success: false, err: err.message })
});


let debug = require('debug')('untitled:server');
let http = require('http');

let port = 3000;
app.set('port', port);

let server = http.createServer(app);

server.listen(port);
server.on('error',
    function onError(error) {
        switch (error.code) {
        case 'EACCES':
            console.error(`${port} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${port} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
        }
    });
server.on('listening', function onListening() {
    debug('Listening on ' + port);
});


module.exports = app;