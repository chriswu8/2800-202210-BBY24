"use strict";
const express = require('express');
var session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const dashboardRouter = require('./routers/dashboardRouter');
const port = 8000;
const app = express();
const url = 'mongodb+srv://bby24:bby24@cluster0.caisp.mongodb.net/BBY24Database?retryWrites=true&w=majority';


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

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.use(passport.session());

app.use('/', dashboardRouter);




// +++++++++++++++++++++++++++
// integration testing below
// ++++++++++++++++++++++++++
const Posting = require('./models/Posting');

const postingRouter = require('./routers/postings');
app.use('/login/postings', postingRouter);

app.get('/login/postings', async function (req, res) {

    const posts = [
        {
            title: 'Title1.1',
            snippet: 'abcdefghijklmnop',
            author: 'Chris',
            dateCreated: new Date,
            img: 'placeholder.jpg'
        },
        ]

        // const posts = await Posting.find().sort({ timeCreated: 'asc' });

        res.render('index', { posts: posts })
});



// +++++++++++++++++++++++++++
// integration testing above
// +++++++++++++++++++++++++++




app.listen(port);
console.log("listening to port " + port + "!");