<<<<<<< HEAD
"use strict";
const express = require('express');
var session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const dashboardRouter = require('./routers/dashboardRouter');
const {
    checkNotAuthenticated,
    checkAuthenticated,
  } = require("./middleware/auth");
const port = process.env.PORT || 8000;
const app = express();
const url = 'mongodb+srv://atmospal:bby24@cluster0.airlv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';


// ======================================
// sessions
// ======================================
app.use(session({
    secret: 'someSecret',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: url,
        ttl: 24 * 60 * 60,
        collection: 'mySessions',
        autoRemove: 'native'
    })
})
);


//Mongodb atlas
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect(url, connectionParams)
    .then(() => {
        console.info('Connected to the database!!')
    })
    .catch((err) => {
        throw err;
    })


app.set('view engine', 'ejs');

app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static('public'));

app.use(express.static('uploads'));

/**
 * For post requests, which sends data (in the form of some data object) to the server.
 * We need to ask server to store that data (object), which is enclosed in the body (i.e. req.body) of that POST request.
 * express.urlencoded() recognizes the incoming object as strings or arrays, and converts the request body to JSON (which is converted to BSON that gets stored to MongoDB)
 */
app.use(express.urlencoded({ extended: false }));

app.use(passport.session());

app.use('/', dashboardRouter);

app.use('/dashboard', checkNotAuthenticated, dashboardRouter);

app.use('/home', checkNotAuthenticated, dashboardRouter);


// +++++++++++++++++++++++++++
// integration testing below
// ++++++++++++++++++++++++++
const Posting = require('./models/Posting');

// const postingRouter = require('./routers/postings');
// app.use('/login/postings', postingRouter);

app.get('/login/postings', async function (req, res) {

    // const posts = [
    //     {
    //         title: 'Title1.1',
    //         snippet: 'abcdefghijklmnop',
    //         author: 'Chris',
    //         dateCreated: new Date,
    //         img: 'placeholder.jpg'
    //     },
    //     ]

        const posts = await Posting.find().sort({ timeCreated: 'asc' });

        res.render('index', { posts: posts })
});



// +++++++++++++++++++++++++++
// integration testing above
// +++++++++++++++++++++++++++




app.listen(port);
console.log("listening to port " + port + "!");
=======
const express = require('express');
const { engine } = require('express/lib/application'); // automatically generated
const path = require('path'); //  provides a way of working with directories and file paths.
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const { body, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const pageSchema = require('./models/page')
const fileUpload = require('express-fileupload');
const fs = require('fs-extra');


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

// set global errors variable
app.locals.errors = null;

// express fileupload middleware
app.use(fileUpload());

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })); // parses & encode incoming requests into URL-encoded format

//
app.get('/store', function (req, res) {
    res.render('index');
});


// express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
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
    // password must be at least 8 chars long
    body('password').isLength({ min: 8 }),
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

app.post(
    '/addProduct',
    body('image').custom(value => {
        var extension = (path.extname(filename)).toLowerCase();
        switch (extension) {
            case '.jpg':
                return '.jpg';
            case '.jpeg':
                return '.jpeg';
            case '.png':
                return '.png';
            default:
                return false;
        }
    })
);

// Express messages middleware 
app.use(cookieParser());
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// Setting routes
const pages = require('./routes/pages');
app.use('/', pages);

const adminPages = require('./routes/adminPages');
app.use('/admin/pages', adminPages);

const adminCategories = require('./routes/adminCategories');
app.use('/admin/categories', adminCategories);

const adminProducts = require('./routes/adminProducts');
app.use('/admin/products', adminProducts);


// start server
const port = 8000;
app.listen(port, function () {
    console.log('Listening to port ' + port);
});
>>>>>>> shoppingCart
