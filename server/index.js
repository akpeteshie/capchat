const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

// establishing router
const app = express();

// establishing database
const db = monk(process.env.MONGO_URI || 'localhost/meower');
const mews = db.get('mews');
filter = new Filter();


// securing connection to frontend
app.use(cors());
app.use(express.json());


// testing communication
app.get('/', (req, res) => {
    res.json({
        message: 'Capchat!'
    });
});

// turning the database into json for display
app.get('/mews', (req, res) => {
    mews
        .find()
        .then(mews => {
            res.json(mews);
        });
});

app.use(rateLimit({
    windowMs: 30 * 1000,
    max: 1  
}));

// validating the received data
function isValidMew(mew) {
    return mew.name && mew.name.toString().trim() !== '' &&
        mew.content && mew.content.toString().trim() !== '';
}

// receiving data from frontend and sending back the database   
app.post('/mews', (req, res) => {
    if (isValidMew(req.body)) {
        // creating object with frontend data
        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        // adding frontend data to database
        mews
            .insert(mew)
            .then(createdMew => {
                res.json(createdMew);
            });
    } else {
        // error handling
        res.status(422);
        res.json({
            message: 'Hey! Name and Content are required'
        })
    }
});

// defining port to receive data from frontend
app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
});