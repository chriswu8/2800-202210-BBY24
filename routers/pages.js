const {
    authCheck,
    authCheckAdmin
} = require("../middleware/auth");
const express = require('express');
const { append } = require('express/lib/response'); 
const router = express.Router();
const Page = require('../models/page');

/**
 * GET index page, after checking the privilege
 * property of the session object. If privilege
 * is 'regular' or 'admin' the index page is rendered.
 */
router.get('/', authCheck, function (req, res) {
    res.render('index', {
        title: 'Home'
    });
});


/**
 * GET chat index page, after checking privilege property 
 * of the session object. If privilege is 'regular' or
 * 'admin' the chatIndex page is rendered.
 */

router.get('/chatIndex', authCheck, function (req, res) {
    Page.find(function (err) {
        if (err) return console.log(err);
        res.render('chatIndex', {
            title: 'chatIndex'
        });
    });
});

/**
 * GET chat page, after checking privilege property
 * of the session object. If privilege is 'regular' or
 * 'admin' the chat page is rendered.
 */
router.get('/chat', authCheck, function (req, res) {
    res.render('chat');
})

/**
 * GET title page, after checking privilege property
 * of the session object. If privilege is 'regular' 
 * or 'admin' the title page is rendered.
 */
router.get('/:title', authCheck, function (req, res) {

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



// Exports
module.exports = router;