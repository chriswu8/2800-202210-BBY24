const express = require('express');
const { append } = require('express/lib/response'); // automatically generated
const router = express.Router();
const Page = require('../models/page');

/**
 * GET /
 */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Home'
    });
});


/**
 * GET chat index 
 */

 router.get('/chatIndex', function (req, res) {
    Page.find(function (err) {
        if (err) return console.log(err);
        res.render('chatIndex', {
            title: 'chatIndex'
        });
    });
});

/**
 * GET chat index 
 */
router.get('/chat', function (req, res) {
    res.render('chat');
})

/**
 * GET a page
 */
router.get('/:title', function (req, res) {

    const title = req.params.title;
    Page.findOne({ title: title }, function (err, page) {
        if (err)
            console.log(err);

        if (!page) {
            res.render('home');
        } else {
            res.render('index', {
                title: page.title,
                content: page.content
            });
        }
    });
}
);



router.get('/test', function (req, res) {
    res.send('test test test test test test test test test test test test');
});








// Exports
module.exports = router;