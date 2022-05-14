const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();


router.get('/', function(req, res) {
    res.send("Admin Page")
});



router.get('/test', function(req, res) {
    res.send('bbbbbbbbbb');
});






// Exports
module.exports = router;