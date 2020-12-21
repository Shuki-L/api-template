import bodyParser = require('body-parser');
import express = require('express');
import cors = require('cors');
import * as dotenv from 'dotenv';

import health from './routers/health';
import auth from './routers/auth';
import users from './routers/users';

const mongoose = require('mongoose');

dotenv.config();
const app = express();
const port = process.env.PORT || 8123;

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// configuration ===============================================================
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).
catch(error => {console.log(error); process.exit(1);});; // connect to our database

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

app.use('/api/v1/health', health);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

app.use('/*', (req, res) => {
    res.status(404).json({
        description: 'Invalid endpoind - url not found ',
        status: 404,
    });
});


app.listen(port, () => {
    console.info(`Server ready on port ${port}`);
  });

//   app.listen(port).on("error",  { console.log("ss")});



module.exports = app;
