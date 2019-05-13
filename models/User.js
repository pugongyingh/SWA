const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    googleID: {
        type: String
    },
	facebookID: {
		type: String
	},
	githubID: {
		type: String
	},
	profileId: {
		type: String
	},
    email: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
	middleName: {
		type: String
	},
	nickName: {
		type: String
	},
	userName: {
		type: String
	},
	displayName: {
		type: String
	},
	profileUrl: {
		type: String
	},
    image: {
        type: String
    },
    gender: {
        type: String
    },
	provider: {
		type: String
	},
	raw: {
		type: String
	},
	password: {
		type: String
	}
});

UserSchema.methods.withoutPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Create collection and add schema
const User = mongoose.model('user', UserSchema);
module.exports = User;