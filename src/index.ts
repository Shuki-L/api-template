import bodyParser = require('body-parser');
import express = require('express');
import cors = require('cors');
import mongoose from 'mongoose'
// var mongoose = require('mongoose');

import health = require('./routes/health');
import test = require('./routes/test');
import clusters = require('./routes/clusters');
import dashboard = require('./routes/dashboard');
import statuses = require('./routes/statuses');
import logs = require('./routes/logs');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url, {
    useMongoClient: true
}); // connect to our database




const app = express();
const port = process.env.PORT || 8123;

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/v1/health', health);
app.use('/api/v1/test', test);
app.use('/api/v1/clusters', clusters);
app.use('/api/v1/dashboard', dashboard);
app.use('/api/v1/statuses', statuses);

app.use('/api/v1/logs', logs);

app.use('/*', (req, res) => {
    res.status(404).json({
        description: 'Invalid endpoind - url not found ',
        status: 404,
    });
});

app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    /* tslint:disable-next-line: no-console */
    return console.log(`server is listening on ${port}`);
});

module.exports = app;
