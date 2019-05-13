module.exports = {
	mongoURI: process.env.MONGODB_URI,
	mongoDbName: process.env.MONGO_DB_NAME,
	mongoUserCollection: process.env.MONGO_USER_COLLECTION,
	googleRickjwApiKey: process.env.GOOGLE_RICKJW_API_KEY,
	googleClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	googleClientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
	googleServerApiKey: process.env.GOOGLE_SERVER_API_KEY,
	youtubeApiKey: process.env.YOUTUBE_API_KEY,
	fackbookClientID: process.env.FACEBOOK_APP_ID,
	facebookClientSecret: process.env.FACEBOOK_APP_SECRET,
	facebookCallbackUrl: process.env.FACEBOOK_APP_CALLBACK_URL,
	githubClientID: process.env.GITHUB_CLIENT_ID,
	githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
	githubCallbackUrl: process.env.GITHUB_APP_CALLBACK_URL,
	jwtClientSecret: process.env.JWT_SECRET,
	PORT: process.env.PORT
}
