const express = require('express');
const { append } = require('express/lib/response'); // automatically generated
const router = express.Router();


router.get('/', function(req, res) {
    res.render('index', {
        title: 'Home'
    });
});


router.get('/test', function(req, res) {
    res.send('aaaaaaaaaaaaaa');
});






// Exports
module.exports = router;