require('dotenv').config();
const express = require('express');
const app = express();
// const server = require('http').createServer(app);
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const { log, table } = require('./custom_modules/log');
const { cap } = require('./custom_modules/cfc');
const { mongoURI, mongoUserCollection } = require('./config/keys');
const { fyi, error, primary } = require('./custom_modules/colormessage');
const PORT = 80 || 8080;

// Passport Config
require('./config/passport')(passport);

// Handlebars Helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    cfc
} = require('./custom_modules/hbs');

// Routers
const index = require('./routes/index');
const user = require('./routes/user');
const auth = require('./routes/auth');

// Map Global Promise
mongoose.Promise = global.Promise;

// Connect To Mongoose Database
mongoose.connect(`${mongoURI}`, {
    useNewUrlParser: true
})
    .then(() => log(primary(`\n\n\t\t\tMongoDB connected\n\n`)))
    .catch(err => error(err));

app.disable('x-powered-by');
app.use(function (req, res, next) {
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

const store = new MongoDBStore({
    uri: mongoURI,
    collection: mongoUserCollection
});

store.on('connected', function () {
    store.client; // The underlying MongoClient object from the MongoDB driver
    // log(store);
});

// Catch errors
store.on('error', function (error) {
    assert.ifError(error);
    assert.ok(false);
});

// View Engine Setup
app.engine('hbs', expressHbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        cfc: cfc
    },
    defaultLayout: 'layout'
}));
app.set('view engine', 'hbs');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Views Path
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: store
}));

// Add flash
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Vars
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.warning_message = req.flash('warning_message');
    res.locals.info_message = req.flash('info_message');
    res.locals.information_message = req.flash('information_message');
    res.locals.primary_message = req.flash('primary_message');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Use Routers
app.use('/', index);
app.use('/auth', auth);
app.use('/user', user);

 server.listen(PORT);

// app.use('/.netlify/functions/api/',index);

// module.exports = server;
module.exports = app;
// module.exports.handler = serverless(app);
