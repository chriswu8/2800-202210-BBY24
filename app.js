const express = require('express');
const { engine } = require('express/lib/application'); // automatically generated
const path = require('path'); //  provides a way of working with directories and file paths.
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const { body, validationResult } = require('express-validator');


// connect to db
mongoose.connect('mongodb://localhost:27017/cart')
    .then(
        function () { console.log("Connected to local MongoDB. Nice!"); },
        err => { handleError(error) }
    );

// EJS setup
app.set('views', path.join(__dirname, 'views')); //?
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // parses & encode incoming requests into URL-encoded format

//
app.get('/store', function(req, res) {
    res.render('index');
});


// express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// express-validator middleware
app.post('/user', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
    }).then(user => res.json(user));
});

app.post(
    '/user',
    // username must be an email
    body('username').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }),
    (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        User.create({
            username: req.body.username,
            password: req.body.password,
        }).then(user => res.json(user));
    },
);

// Express messages middleware 
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// Setting routes
const pages = require('./routes/pages');
app.use('/', pages);

const adminPages = require('./routes/adminPages');
app.use('/admin/pages', adminPages);

// start server
const port = 8000;
app.listen(port, function () {
    console.log('Listening to port ' + port);
});