const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../custom_modules/auth');
const User = require('../models/User');

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res
        .render('user/dashboard',
            { title: 'Dashboard' });
});

router.get('/profile', ensureAuthenticated, (req, res) => {
    res
        .render('user/profile',
            { title: 'Profile', viewProfile: true });
});

router.get('/profile/edit', ensureAuthenticated, (req, res) => {
    res.render('user/profile', { title: 'Profile', viewProfile: false,
    gender: { male: (req.user.gender == 'male'), 
    female: (req.user.gender == 'female'),
     other: (req.user.gender == 'other') }  });
});

router.post('/profile', ensureAuthenticated, (req, res) => {
    const updatedProfile = {};

    if (req.body.fname) {
        updatedProfile.firstName = req.body.fname;
    }

    if (req.body.mname) {
        updatedProfile.middleName = req.body.mname;
    } else {
        updatedProfile.middleName = '';
    }
    
    if (req.body.lname) {
        updatedProfile.lastName = req.body.lname;
    }
    
    if (req.body.nname) {
        updatedProfile.nickName = req.body.nname;
    } else {
        updatedProfile.nickName = '';
    }
    
    if (req.body.dname) {
        updatedProfile.displayName = req.body.dname;
    } else {
        updatedProfile.displayName = '';
    }
    
    if (req.body.uname) {
        updatedProfile.userName = req.body.uname;
    } else {
        updatedProfile.userName = '';
    }
    
    if (req.body.email) {
        updatedProfile.email = req.body.email;
    }
    
    if (req.body.imageUrl) {
        updatedProfile.image = req.body.imageUrl;
    } else {
        updatedProfile.imageUrl = '';
    }

    if (req.body.gender) {
        updatedProfile.gender = req.body.gender;
    }

    User.findOneAndUpdate({ _id: req.user._id }, updatedProfile, (err, user) => {
        if (err) {
            req.flash('warning_message', err.message);
        }
        req.flash('success_message', 'Profile successfully updated - changes will appear at next login');
        res.redirect('/user/profile');
    });
});

module.exports = router;

function manageCookie(res, opts = undefined) {
    let options = (alive(opts)) ? opts : defaultOptions();
    res.cookie('anon-user', JSON.stringify(options), options);
}

function defaultOptions() {
    return {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        signed: false,
        sameSite: true
    };
}

function alive(options) {
    return (null != options &&
        undefined != options &&
        null !== options &&
        undefined !== options &&
        "undefined" != options &&
        "undefined" !== options);
}
