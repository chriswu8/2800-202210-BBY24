const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();
var { body, validationResult} = require('express-validator');
const app = express();

/**
 * GET pages index
 */

router.get('/', function (req, res) {
    res.send("Admin Page")
});


/**
 * GET add page
 */

router.get('/addPage', function (req, res) {
    const title = "";
    const slug = "";
    const content = "";

    res.render('admin/addPage', {
        title: title,
        slug: slug,
        content: content
    });

});



/**
 * POST add page
 */

router.post('/addPage', function (req, res) {

    // req.checkBody('title', 'Title must have a value').notEmpty();
    // req.checkBody('content', 'Content must have a value').notEmpty();

    const title = req.body.title;
    const slug = req.body.slug; // \s+ means 
    if (slug == "") slug = title;
    const content = req.body.content;

    const errors = validationResult(req);
    if (errors) {
        console.log("errors");

        res.render('admin/addPage', {
            errors: errors,
            title: title,
            slug: slug,
            content: content 
        });
    } else {
        console.log("success");
    }
});



router.get('/test', function (req, res) {
    res.send('bbbbbbbbbb');
});






// Exports
module.exports = router;