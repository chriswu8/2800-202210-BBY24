const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();
var { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

// GET Product model
const Product = require('../models/product');

// GET Category model
const Category = require('../models/category');

/**
 * GET products index
 */
router.get('/', function (req, res) {
    var count;

    Product.count(function (err, c) {
        count = c;
    });

    Product.find(function (err, products) {
        res.render('admin/products', {
            products: products,
            count: count
        });
    });
});


/**
 * GET add product
 */

router.get('/addProduct', function (req, res) {
    const title = "";
    const description = "";
    const price = "";

    Category.find(function (err, categories) {
        res.render('admin/addProduct', {
            title: title,
            description: description,
            categories: categories,
            price: price
        });
    });

});



/**
 * POST add product
 */

router.post('/addProduct',

    body('title').notEmpty(),
    body('description').notEmpty(),
    body('category').notEmpty(),
    body('price').notEmpty().isDecimal(),
    body('image'),


    function (req, res) {

        const title = req.body.title;
        const description = req.body.description;
        const price = req.body.price;
        const category = req.body.category;
        const image = req.body.image;

        // Finds the validation errors in this request and wraps them in an object
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Error, empty field detected.");
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
            const price2 = parseFloat(price).toFixed(2);
            const product = new Product({
                title: title,
                description: description,
                price: price2,
                category: category,
                image: image, // may need to modify to for validation later
            });

            product.save(function (err) {
                if (err) return console.log(err);

                // make folder
                mkdirp('public/productImages/' + product._id, function (err) {
                    console.log("This line ran#######");
                    if (err) return console.log(err);
                });

                mkdirp('public/productImages/' + product._id + '/gallery', function (err) {
                    if (err) return console.log(err);
                });

                mkdirp('public/productImages/' + product._id + '/gallery/thumbs', function (err) {
                    if (err) return console.log(err);
                });

                if (image != "") {
                    var productImage = req.files.image;
                    var path = 'public/productImage/' + product._id + '/' + image;
                    productImage.mv(path, function (err) {
                        return console.log(err);
                    });
                }
                console.log("Success. Product added!");
                res.redirect('/admin/products');
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

        })(count);
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
            res.redirect('/admin/pages');
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