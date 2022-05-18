const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();
var { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());

// GET Category model
const Category = require('../models/category');


/**
 * GET category index
 */

router.get('/', function (req, res) {
    Category.find(function (err, categories) {
        if (err) return console.log(err);
        res.render('admin/categories', {
            categories: categories
        });
    });
});


/**
 * GET add category
 */

router.get('/addCategory', function (req, res) {
    const title = "";

    res.render('admin/addCategory', {
        title: title
    });

});



/**
 * POST add category
 */

router.post('/addCategory',

    body('title').notEmpty(),


    function (req, res) {

        const title = req.body.title;
        const slug = req.body.slug;

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
            const category = new Category({
                title: title,
                slug: slug
            });

            category.save(function (err) {
                if (err) return console.log(err);
                req.flash("success", 'Category added!'); // NOT WORKING
                console.log("Success. Category added!");
                res.redirect('/admin/categories');
            });
        }
    })



/**
 * GET edit category
 */
router.get('/editCategory/:title', function (req, res) {
    Category.findOne({ title: req.params.title }, function (err, category) {
        if (err)
            return console.log(err);

        res.render('admin/editCategory', {
            title: category.title,
            id: category._id
        });
    });
});





/**
 * POST edit category
 */

router.post('/editCategory/:id',

    body('title').notEmpty(),

    function (req, res) {

        const title = req.body.title;
        const id = req.params.id;

        // Finds the validation errors in this request and wraps them in an object
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Error, empty field detected.");
            // insert flash message here if possible
            res.redirect('/admin/categories');
        } else {

            Category.findById(id, function (err, category) {
                if (err)
                    return console.log(err);

                category.title = title;

                category.save(function (err) {
                    if (err) return console.log(err);
                    res.redirect('/admin/categories');
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