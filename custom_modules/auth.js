module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_message', 'Not Authorized');
        res.redirect('/auth/login')
    },	
    ensureGuest: function(req, res, next) {
        if (req.isAuthenticated()) {
            // res.clearCookie('connect.sid');
            res.redirect('/user/dashboard');
        } else {
			return next();
		}
    }
}