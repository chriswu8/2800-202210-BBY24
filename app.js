const express = require('express');
const { engine } = require('express/lib/application'); // automatically generated
const path = require('path'); //  provides a way of working with directories and file paths.
const app = express();
const mongoose = require('mongoose');

// connect to db
mongoose.connect('mongodb://localhost:27017/cart')
    .then(
        function () { console.log("Connected to local MongoDB. Nice!"); },
        err => { handleError(error) }
    );

// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.send('working');
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