const {
    authCheck,
    authCheckAdmin
} = require("../middleware/auth");
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
        } else {

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
 * GET delete category
 */

/**
 * 
 * @author easylearning97
 * @source 
 */
router.get('/deleteCategory/:id', function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        res.redirect('/admin/categories');
    })
});







// Exports
module.exports = router;