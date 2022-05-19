const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();
var { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());
// const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

// GET Product model
const Product = require('../models/product');

// GET Category model
const Category = require('../models/category');
const req = require('express/lib/request');

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
        // const imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
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
                image: imageFile, // may need to modify to for validation later
            });

            product.save(function (err) {
                if (err) return console.log(err);

                fs.ensureDir(dir + product._id).then(() => {
                console.log('success!')
                }).catch(err => {
                console.error(err)
                })

                fs.ensureDir(dir + product._id + '/gallery').then(() => {
                    console.log('success!')
                    }).catch(err => {
                    console.error(err)
                    })

                fs.ensureDir(dir + product._id +'/gallery/thumbs').then(() => {
                    console.log('success!')
                    }).catch(err => {
                    console.error(err)
                    })

                if (imageFile != "") { 
                    var productImage = req.files.image;
                    //var path = 'public/productImages/' + image; //CHANGED THIS TO THE BELOW
                    var path = 'public/productImages/' + product._id + '/' + imageFile;
                    //var path = 'public/productImages/' + product._id + '/' + image;
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
 * GET edit product
 */
router.get('/editProduct/:title', function (req, res) {

    // var errors;

    // if (req.session.errors)
    //     errors = req.sessions.errors;

    // req.session.errors = null;

    Category.findOne({ title: req.params.title }, function (err, product) {
        if (err) {
            console.log(err);
            res.redirect('admin/products')
        } else {
            res.render('admin/editProduct', {
                title: product.title,
                description: product.description,
                categories: product.categories,
                price: product.price,
                image: product.image
            });
        }
    });
});





/**
 * POST edit product
 */

router.post('/editProduct/:title',

    body('title').notEmpty(),
    body('description').notEmpty(),
    body('category').notEmpty(),
    body('price').notEmpty().isDecimal(),
    body('image'),


    function (req, res) {

        const title = req.body.title;
        const description = req.body.description;
        const Category = req.body.Category;
        const price = req.body.price;
        const image = req.body.image;

        // Finds the validation errors in this request and wraps them in an object
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Error, empty field detected.");
            res.redirect('/admin/products');
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