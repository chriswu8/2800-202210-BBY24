const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();
var { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());

// GET Page model
const Page = require('../models/page');
const flash = require('connect-flash/lib/flash');

/**
 * GET pages index
 */

router.get('/', function (req, res) {
    Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
        res.render('admin/pages', {
            pages: pages
        })
    })
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

router.post('/addPage',

    body('title').notEmpty(),
    body('content').notEmpty(),


    function (req, res) {

        const title = req.body.title;
        const slug = req.body.slug;
        const content = req.body.content;

        // Finds the validation errors in this request and wraps them in an object
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Error, empty field detected.");
            // document.getElementById('alertError').innerHTML = 'Title and Content fields cannot be empty';
            // return res.status(400).json({ errors: errors.array() });
        } else {
            
            // Page.findOne({ slug: slug }, function (err, page) {  // left slug is in collection, right slug is the variable
            //     if (page) {
            //     // req.flash('danger', 'Page slug exists, choose another.');  // NOT WORKING
            //     res.render('admin/addPage', {
            //         title: title,
            //         slug: slug,
            //         content: content
            //     });
            // } else {
                console.log("This line of code ran!!!!!!!");
                    const page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 100
                });
                
                page.save(function (err) {
                    if (err) return console.log(err);
                    // req.flash("success", 'Page added!'); // NOT WORKING
                    console.log("Success. Page added!");
                    res.redirect('/admin/pages');
                });
            }
    })
        // res.render('admin/addPage');
//     }
// });




/**
 * POST reorder pages
 */


 router.post('/reorderPages', function (req, res) {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiii");

    console.log(req.body);
});



 



// Exports
module.exports = router;