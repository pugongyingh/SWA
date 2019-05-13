const express = require('express');
const path = require('path');
const router = express.Router();
const { ensureGuest } = require('../custom_modules/auth');

// const index = require('./routes/index');
/* const user = require('./user');
const auth = require('./auth'); */

router.get('/', ensureGuest, (req, res) => {
    res
        .status(200)
        .render('landing/index', { title: 'ick JW' });
        // .json({ status: 'done' });
});

router.get('/about',ensureGuest, (req, res) => {
    res
        .status(200)
        .render('landing/about', { title: 'About' });
});

// View file in browser example
router.get('/crest/:name',ensureGuest, (req, res, next) => {
    const options = {
        root: `${path.resolve(__dirname,'../')}/public/graphics/`,
        dotfiles: 'deny',
        // dotfiles: 'allow',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    const fileName = req.params.name;
    res.sendFile(`${fileName}.jpg`, options, function (err) {
        if (err) {
            console.log(`\n\n\n\t\t\t\t\t
                ${err.message.toUpperCase()}\n\n\n`);
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

// Download a file example
router.get('/logo/:name',ensureGuest, (req, res) => {
    const filename = `${path.resolve(__dirname, '../')}/public/graphics/${req.params.name}.jpg`;

    console.log(`\n\n\n\n\t\t\t\t\t\tFile Name: ${req.params.name.toUpperCase()}\n\t\t\t\t\t\tFile Path: ${filename}\n\n\n\n`);

    res.download(filename);
});

/* router.use('/user', user);
router.use('/auth', auth); */

module.exports = router;
