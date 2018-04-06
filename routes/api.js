const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/localstrategy');
const router = express.Router();

const pool = require('../modules/pool');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(req.user);
    } else {
        res.sendStatus(403);
    }
});

router.post('/register', (req, res, next) => {
    const username = req.body.username;
    const password = encryptLib.encryptPassword(req.body.password);
    const saveUser = {
        username: req.body.username,
        password: encryptLib.encryptPassword(req.body.password)
    };
    console.log('new user:', saveUser);
    pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
        [saveUser.username, saveUser.password], (err, result) => {
            if (err) {
                console.log("Error inserting data: ", err);
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        });
});

router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});


router.get('/users', function (req, res) {
    pool.connect(function (err, db, done) {
        if (err) {
            console.error(err);
            res.status(500).send({ 'error': err });
        } else {
            db.query('SELECT * FROM users', function (err, table) {
                done();
                if (err) {
                    return res.status(400).send({ error: err })
                } else {
                    return res.status(200).send(table.rows)
                }
            })
        }
    })
});

router.post('/new-user', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    pool.connect((err, db, done) => {
        if (err) {
            console.error('error open connection', err);
            return res.status(400).send({ error: err });
        }
        else {
            db.query('INSERT INTO users( username, password ) VALUES ($1, $2)',
                [username, password], (err, table) => {
                    done();
                    if (err) {
                        console.error('error running query', err);
                        return res.status(400).send({ error: err });
                    }
                    else {
                        console.log('Data Inserted: successfully!');
                        res.status(201).send({ message: 'Data Inserted!' })
                    }
                })
        }
    });
    console.log(req.body);
});

// Handles Ajax request for user information if user is authenticated
router.get('/dashboard', function (req, res) {
    console.log('get /user route');
    // check if logged in
    if (req.isAuthenticated()) {
        // send back user object from database
        console.log('logged in', req.user);
        var userInfo = {
            username: req.user.username
        };
        res.send(userInfo);
    } else {
        // failure best handled on the server. do redirect here.
        console.log('not logged in');
        // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
        res.send(false);
    }
});

module.exports = router;