const express = require('express');
const { engine } = require('express/lib/application');
const path = require('path'); //  provides a way of working with directories and file paths.

const app = express();

// EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.send('working');
});

// start server
const port = 8000;
app.listen(port, function() {
    console.log('Listening to port ' + port);
});