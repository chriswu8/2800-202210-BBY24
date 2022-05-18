"use strict";
const express = require('express');
var session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const dashboardRouter = require('./routers/dashboardRouter');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const {
    checkNotAuthenticated,
    checkAuthenticated,
  } = require("./middleware/auth");
const port = process.env.PORT || 8000;
const app = express();
const url = 'mongodb+srv://atmospal:w7BYxfThauyMUO58@realmcluster.s7dvc.mongodb.net/BBY_24_user_for_group_24?retryWrites=true&w=majority';


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

// Express messages middleware 
app.use(cookieParser());
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


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