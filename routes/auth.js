const express = require('express');
const csrf = require('csurf');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator/check');
const { ensureGuest, ensureAuthenticated } = require('../custom_modules/auth');
const { log } = require('../custom_modules/log');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const csrfProtection = csrf();

router.get('/register', csrfProtection, ensureGuest, (req, res) => {
    res.render('auth/register', { title: 'Register', csrfToken: req.csrfToken() });
});

router.get('/login', csrfProtection, ensureGuest, (req, res) => {
    res.render('auth/login', { title: 'Login', csrfToken: req.csrfToken() });
});
 
// Google Authentication
router.get('/google', passport.authenticate('google-login', { scope: [
	'profile', 
	'email'] }));

router.get('/google/callback',
	passport.authenticate( 'google-login', {
		successRedirect: '/user/dashboard',
		failureRedirect: '/'
}));

// Facebook Authentication
router.get('/facebook',
  passport.authenticate('facebook-login', { scope: [
	'email', 'public_profile', 'user_location'] }));

router.get('/facebook/callback',
	passport.authenticate('facebook-login', { failureRedirect: '/' }),
		function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/user/dashboard');
	}
);

// GitHub Authentication
router.get('/github',
  passport.authenticate('github-login', { scope: [ 'user:email', 'public', 'private' ] }));

router.get('/github/callback',
	passport.authenticate('github-login', { failureRedirect: '/' }),
		function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/user/dashboard');
	}
);

// Local Authentication
router.post('/login', csrfProtection,(req, res, next) => {
	passport.authenticate('local-login', {
		successRedirect: '/user/dashboard',
		failureRedirect: '/auth/login',
		failureFlash: true
	})(req, res, next);
});

router.post('/register',csrfProtection,
	[		
		check('email', 'Invalid email')
			.exists({ checkFalsy: true }).withMessage('Missing email')
			.isEmail(),		
		check('pwd', 'Passwords don\'t match')
			.isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
			.custom((value, { req }) => value === req.body.pwd2),
		check('fname')
			.exists({ checkFalsy: true }).withMessage('Missing first name'),
		check('lname')
			.exists({ checkFalsy: true }).withMessage('Missing last name')
	],
	(req, res) => {	
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			let errorMessage = '';
			let i = 0;
			
			for (let e in errors.array()) {
				let error = errors.array()[e];
				
				if (i < (errors.array().length - 1)) {
					errorMessage += `${error.msg},`;
				}
				else {
					errorMessage += `${error.msg}`;
				}
				i++;
			}
			
			log(errorMessage);
			req.flash('error_message', errorMessage);
			res.redirect('/auth/register');
		}
		else {
			/*TODO:
				Implement JWT token in client's cookie */
			User
				.findOne({ $or: [ {email: req.body.email}, {userName: req.body.uname} ]})
				.then(user => {
					if (user) {
						if(user.userName === req.body.uname) {
							req.flash('error_message', 'Username already taken');
							res.redirect('/auth/register');
						} else {
							req.flash('error_message', 'Email is already registered');
							res.redirect('/auth/register');
						}
					}
					else {	
						let nU = {
							firstName: req.body.fname,
							lastName: req.body.lname,
							email: req.body.email,
							password: req.body.pwd
						};

						if (req.body.uname) {
							nU.userName = req.body.uname;
						}

						const newUser = new User(nU);
						
						bcrypt.genSalt(10, (err, salt) => {
							bcrypt.hash(newUser.password, salt, (err, hash) => {
								if (err) throw err;
								newUser.password = hash;
								newUser.save()
									.then(user => {
										req.flash('success_message', 'You are now registered');
										res.redirect('/auth/login');
									})
									.catch(err => {
										log(err);
										req.flash('error_message', err.message);
										res.redirect('/auth/register');
									});
							});
						});						
					}
				});			
		}
});

router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get( '/verify', (req, res) => {
    if (req.user) {
        log(req.user);
    } else {
        log('Not Authorized');
    }
	res.redirect('/');
});

module.exports = router;
