const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();
var { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());

// GET Page model
const Page = require('../models/page');
const flash = require('connect-flash/lib/flash');
const { getMaxListeners, count } = require('../models/page');


/**
 * GET pages index
 */

router.get('/', function (req, res) {
    Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
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
            const page = new Page({
                title: title,
                slug: slug,
                content: content,
                sorting: 100
            });

            page.save(function (err) {
                if (err) return console.log(err);
                req.flash("success", 'Page added!'); // NOT WORKING
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
    var ids = req.body['id[]'];
    console.log(req.body);

    console.log(ids);
    var count = 0;

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        count++;

        (function (count) {
            // wrapped in a closure
            Page.findById(id, function (err, page) {
                page.sorting = count;
                page.save(function (err) {
                    if (err)
                        return console.log(err);
                });
            });

        }) (count);
    }
});




/**
 * GET edit page
 */
router.get('/editPage/:title', function (req, res) {
    Page.findOne({ title: req.params.title }, function (err, page) {
        if (err)
            return console.log(err);

        res.render('admin/editPage', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    });
});





/**
 * POST edit page
 */

router.post('/editPage/:title',

    body('title').notEmpty(),
    body('content').notEmpty(),


    function (req, res) {

        const title = req.body.title;
        const slug = req.body.slug;
        const content = req.body.content;
        const id = req.body.id;

        // Finds the validation errors in this request and wraps them in an object
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Error, empty field detected.");
            // insert flash message here if possible
        } else {

            Page.findById(id, function (err, page) {  // left slug is in collection, right slug is the variable
                if (err)
                    return console.log(err);

                page.title = title;
                page.slug = slug;
                page.content = content;

                page.save(function (err) {
                    if (err) return console.log(err);
                    res.redirect('/admin/pages');
                    // req.flash("Success", 'Page updated.');   // not working for some reason =/
                });
            });
        }
    }
);





/**
 * GET delete page
 */

router.get('/deletePage/:id', function (req, res) {
    Page.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        res.redirect('/admin/pages');
        // req.flash("Success", 'Page deleted.'); // not working for some reason =/
    })
});







// Exports
module.exports = router;