const functions = require('firebase-functions');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const express = require('express');
const admin = require('firebase-admin');
require('ejs');
const cors = require('cors');

// const getIDByToken = require('./utils/Utils').getIDByToken;

const firebaseConfig = require('./firebaseServicekey.json');

admin.initializeApp({ credential: admin.credential.cert(firebaseConfig) });

// admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const csrfMiddleware = csrf({ cookie: true });

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(csrfMiddleware);
app.use(cors({ origin: true }));


app.use(require('express-session')({
    secret: 'Rusty is a dog',
    resave: false,
    saveUninitialized: false,
}));

app.all('*', (req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
});

app.get('/login', function (req, res) {
    const sessionCookie = req.cookies.session || '';
    const data = req.cookies.data || null;
    console.log('data', data);
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
            res.redirect('/profile');
        })
        .catch((error) => {
            res.render('login', { csrfToken: req.csrfToken() });
        });

});

app.get('/signup', function (req, res) {
    res.render('signup');
});

app.post('/authLogin', (req, res) => {
    console.log('agyaaa', req.body);
    const idToken = req.body.idToken.toString();
    const data = req.body.data;
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then(
            (sessionCookie) => {
                console.log('sessionCookie', sessionCookie);
                const options = { maxAge: expiresIn, httpOnly: true };
                res.cookie('data', data, options);
                res.cookie('session', sessionCookie, options);
                res.end(JSON.stringify({ status: 'success' }));
            },
            (error) => {
                console.log('error', error);
                res.status(401).send(error);
            },
        );
});


app.get('/profile', async function (req, res) {
    const sessionCookie = req.cookies.session || '';
    const data = req.cookies.data || null;
    console.log('data', data);
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
            res.render('profile', { data });
        })
        .catch((error) => {
            res.redirect('/login');
        });
});

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/sessionLogout', (req, res) => {
    res.clearCookie('session');
    res.clearCookie('data');
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});

// exports.nodeAuth = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.app = functions.https.onRequest(app);
