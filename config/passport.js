const mongoose = require('mongoose');
const passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth20').Strategy,
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook'),
	GitHubStrategy = require('passport-github2').Strategy;	
const bcrypt = require('bcryptjs');
const { log, table } = require('../custom_modules/log');

// Load Models
require('../models/User');
const User = mongoose.model('user');

// Load Keys
const keys = require('../config/keys');

// Debug Output
const verbose = (arg) => {
	log(`\n\n\n`);
	log(arg);
	log(`\n\n\n`);
};

// Strategy Options
const facebookProfileFields = [
	'id',
	'displayName', 
	'email',
	'birthday', 
	'friends', 
	'first_name', 
	'last_name', 
	'middle_name', 
	'gender', 
	'link',
	'photos',
	'publish',
	'feed'
];

module.exports = (passport) => {
	
	// Github Strategy
	passport.use('github-login', 
		new GitHubStrategy({
			clientID: keys.githubClientID,
			clientSecret: keys.githubClientSecret,
			callbackURL: keys.githubCallbackUrl
		},
		(accessToken, refreshToken, profile, done) => {
			log(`\n\n\n   Profile Keys:\n\t${Object.keys(profile)}\n\n\n 
			  Raw:\n\t${JSON.stringify(profile._raw)}\n\n\n`);
			const firstName = JSON.parse(profile._raw).first_name || null;
			const lastName = JSON.parse(profile._raw).last_name || null;
			const email = JSON.parse(profile._raw).email || null;
			
			const newGithubUser = {
				githubID: profile.id,
				firstName: firstName,
				lastName: lastName,
				// middleName: profile.name.middleName || '',
				displayName: profile.displayName || '',
				// nickName: profile.name.nickName || '',
				userName: profile.username,
				email: profile.emails[0].value || '',
				// gender: profile.gender,
				profileUrl: profile.profileUrl,
				image: profile.photos[0].value,
				provider: profile.provider,
				raw: JSON.stringify(profile._raw)
			};
			   
			// Check for existing user
			User.findOne({
				githubID: profile.id
			})
				.then(user => {
					if (user) {
						// Return user
						return done(null, user);
					} else {
						// Create user
						new User(newGithubUser)
						   .save()
						   .then(user => done(null, user))
						   .catch(err => log(err));
					}
				})
				.catch(err => table(err));
		}
	));
	
	// Facebook Strategy
	passport.use('facebook-login',
		new FacebookStrategy({
			clientID: keys.fackbookClientID,
			clientSecret: keys.facebookClientSecret,
			callbackURL: keys.facebookCallbackUrl,
			profileFields: facebookProfileFields
		},
		(accessToken, refreshToken, profile, done) => {
			// verbose(`\n\n\n Profile String: ${JSON.stringify(profile)}\n`);
			// verbose(`\tProfile Keys: ---> ${Object.keys(profile)}\n`);
			
			// verbose(`\n\n\n`);	
			const firstName = profile._json['name'].split(' ')[0];
			const lastName = profile._json['name'].split(' ')[1];
			
			const newFacebookUser = {
				facebookID: profile.id,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				middleName: profile.name.middleName || '',
				displayName: profile.displayName || '',
				nickName: profile.name.nickName || '',
				username: profile.username,
				email: profile.emails[0].value,
				gender: profile.gender,
				profileUrl: profile.profileUrl,
				image: profile.photos[0].value,
				provider: profile.provider,
				raw: JSON.stringify(profile._raw)
			};
			   
			// Check for existing user
			User.findOne({
				facebookID: profile.id
			})
				.then(user => {
					if (user) {
						// Return user
						return done(null, user);
					} else {
						// Create user
						new User(newFacebookUser)
						   .save()
						   .then(user => done(null, user))
						   .catch(err => log(err));
					}
				})
				.catch(err => table(err));		
			
		}
	));

	// Google Strategy
	passport.use('google-login',
		new GoogleStrategy({
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true
		},(accessToken, refreshToken, profile, done)=> {
			// Log Google connection
			// verbose(profile);
			
			// Capture user's avatar and nick name
			const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
			const nickName = JSON.parse(profile._raw.toString()).nickname;
			
			const newUser = {
				googleID: profile.id,
				email: profile.emails[0].value,
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				nickName: nickName,
				gender: profile.gender,
				image: image,
				provider: profile.provider,
				raw: JSON.stringify(profile._raw)
			};
			   
			// Check for existing user
			User.findOne({
				googleID: profile.id
			})
				.then(user => {
					if (user) {
						// Return user
						return done(null, user);
					} else {
						// Create user
						new User(newUser)
						   .save()
						   .then(user => done(null, user))
						   .catch(err => log(err));
					}
				})
				.catch(err => log(err));
		})		
	);	
		
	 // Local Strategy
	passport.use('local-login',
		new LocalStrategy({
			usernameField: 'usernameOrEmail',
			passwordField: 'password',
			passReqToCallback: true	
		}, (req, usernameOrEmail, password, done) => {
			// log(`\n\n\n\tMade it to Passport Local\n\n\n`);
		
			// Match the user
			User.findOne({ $or: [{ email: usernameOrEmail }, { userName: usernameOrEmail} ]})
				.then(user => {
					// log(`\n\n\t\tLooking for user: ${user.firstName}\n\n`);
					if(!user) {
						// log(`\n\n\t\tDid not find user: ${user.firstName}\n\n`);
						// req.flash('error_message', 'User does not exist');
						return done(null, false, { message: 'User does not exists' });
					}
					
					// log(`\n\n\t\tFound User: ${user.firstName}\n\n`);
					
					// Match the password
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if(err) throw err;
						
						if(isMatch) {
							// log(`\n\n\t\tPassword was matched\n\n`);
							return done(null, user.withoutPassword());
						}
						else {
							// log(`\n\n\t\tPassword Failed!!!!\n\n\n`);
							// req.flash('error_message', 'Authentication Failed')
							return done(null, false, { message: 'Authentication Failed' });
						}
					});
				})
				.catch(err => done(null, false, { message: 'Authentication Failed' }));
	}));
	 
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

};