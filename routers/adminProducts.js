const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();
var { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());
//const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
//NEW
const bodyParser = require('body-parser');

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

const dir = 'public/productImages/'; //NEWLY ADDED

/**
 * POST add product
 */

router.post('/addProduct',




    body('title').notEmpty(),
    body('description').notEmpty(),
    body('category').notEmpty(),
    body('price').notEmpty().isDecimal(),
    //image check?


    function (req, res) {
        //ADDED THE BELOW
        console.log(req.files.image);

        //NEW
        var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

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

            const price2 = parseFloat(price).toFixed(2);
            const product = new Product({
                title: title,
                description: description,
                price: price2,
                category: category,
                image: imageFile
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

                fs.ensureDir(dir + product._id + '/gallery/thumbs').then(() => {
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

/**
 * GET delete product
 */

router.get('/deleteProduct/:id', function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        res.redirect('/admin/products');
    })
});




// Exports
module.exports = router;