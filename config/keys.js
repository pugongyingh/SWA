module.exports = {
	mongoURI: "mongodb+srv://pgyh:mmmmmm88@cluster0-ddyp4.mongodb.net/test?retryWrites=true&w=majority",
	mongoDbName: "pgyh",
	mongoUserCollection: "pgyh",
	: process.env.GOOGLE_RICKJW_API_KEY,
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
	PORT: 8080
}
