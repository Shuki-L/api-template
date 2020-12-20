import bodyParser = require('body-parser');
import express = require('express');
import cors = require('cors');

const mongoose = require('mongoose');

import health = require('./routes/health');
import test = require('./routes/test');
import clusters = require('./routes/clusters');
import dashboard = require('./routes/dashboard');
import statuses = require('./routes/statuses');
import logs = require('./routes/logs');

const configDB = require('./config/database');

// configuration ===============================================================
mongoose.connect(configDB.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}); // connect to our database
// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!

    const kittySchema = new mongoose.Schema({
        name: String,
    });

    // NOTE: methods must be added to the schema before compiling it with mongoose.model()
    kittySchema.methods.speak = function () {
        const greeting = this.name
            ? 'Meow name is ' + this.name
            : "I don't have a name";
        console.log(greeting);
    };

    const Kitten = mongoose.model('Kitten', kittySchema);
    const silence = new Kitten({ name: 'Silence' });
    console.log(silence.name);

    const fluffy = new Kitten({ name: 'fluffy' });
    fluffy.speak();

    silence.save(function (err, fluffy) {
        if (err) return console.error(err);
        fluffy.speak();
    });
});

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

app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    /* tslint:disable-next-line: no-console */
    return console.log(`server is listening on ${port}`);
});

module.exports = app;
