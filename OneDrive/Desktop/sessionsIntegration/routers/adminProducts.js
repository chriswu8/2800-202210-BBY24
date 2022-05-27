const {
    authCheck,
    authCheckAdmin
} = require("../middleware/auth");
const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router();
var { body, validationResult } = require('express-validator');
const app = express();
app.use(express.json());
const fs = require('fs-extra');
const resizeImg = require('resize-img');

const bodyParser = require('body-parser');

// GET Product model
const Product = require('../models/product');

// GET Category model
const Category = require('../models/category');

var count;

/**
 * GET products index
 */
router.get('/', function (req, res) {


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

const dir = 'public/productImages/'; 

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
                }).catch(err => {
                    console.error(err)
                })

                fs.ensureDir(dir + product._id + '/gallery').then(() => {
                    console.log('success3!')
                }).catch(err => {
                    console.error(err)
                })

                fs.ensureDir(dir + product._id + '/gallery/thumbs').then(() => {
                    console.log('success4!')
                }).catch(err => {
                    console.error(err)
                })

                if (imageFile != "") {
                    var productImage = req.files.image;
                    var path = 'public/productImages/' + product._id + '/' + imageFile;
                    productImage.mv(path, function (err) {
                        return console.log(err);
                    });
                }
                res.redirect('/admin/products');
            });
        }
    })


/**
 * GET edit product
 */
router.get('/editProduct/:id', function (req, res) { 

    var errors;
    if (req.session.errors)
        errors = req.session.errors;
    req.session.errors = null;

    Category.find(function (err, categories) {

        Product.findById(req.params.id, function (err, p) {
            if (err) {
                console.log(err);
                res.render('./admin/products');
            } else {
                var galleryDir = 'public/productImages/' + p._id + '/gallery';
                var galleryImages = null;

                fs.readdir(galleryDir, function (err, files) {
                    if (err) {
                        console.log(err);
                    } else {
                        galleryImages = files;

                        res.render('./admin/editProduct', {
                            title: p.title,
                            errors: errors,
                            description: p.description,
                            categories: categories,
                            category: p.category,
                            price: parseFloat(p.price).toFixed(2),
                            image: p.image,
                            galleryImages: galleryImages,
                            id: p._id
                        });

                    }
                });
            }
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

            Page.findById(id, function (err, page) {  
                if (err)
                    return console.log(err);

                page.title = title;
                page.content = content;

                page.save(function (err) {
                    if (err) return console.log(err);
                    res.redirect('/admin/pages');
                });
            });
        }
    }
);

//POST edit product 
router.post('/editProduct/:id', function (req, res) {

    body('title').notEmpty(),
        body('description').notEmpty(),
        body('category').notEmpty(),
        body('price').notEmpty().isDecimal(); //originally ','

    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;
    const image = req.body.image;
    var pimage = req.body.pimage;
    var id = req.params.id;

    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    //Finds the validation errors in this request and wraps them in an object.
    const errors = validationResult(req);
    console.log(errors);

    if (!errors) { //cannot locate the error, however it exists, but is not fatal
        req.session.errors = errors;
        res.redirect('/admin/products/editProduct/' + id);
    }

    console.log(errors);
    var p = new Product();
    //}

    if (p) {
        Product.findById(id, function (err, p) {
            if (err) {
                console.log(err);
            }

            p.title = title;
            p.description = description;
            p.price = parseFloat(price).toFixed(2);
            p.category = category;
            if (imageFile != "") {
                p.image = imageFile;
            }

            p.save(function (err) {
                if (err) {
                    console.log(err);
                }

                if (imageFile != "") {
                    if (pimage != "") {
                        fs.remove('public/productImages/' + id + '/' + pimage, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });

                    }

                    var productImage = req.files.image;
                    var path = 'public/productImages/' + id + '/' + imageFile;
                    productImage.mv(path, function (err) {
                        return console.log(err);
                    });
                }

                res.redirect('/admin/products/editProduct/' + id);
            });

        });
    }
});

/**
 * POST product gallery 
 */

router.post('/productGallery/:id', function (req, res) {

    var productImage = req.files.file;
    var id = req.params.id;
    var path = 'public/productImages/' + id + '/gallery/' + req.files.file.name;
    var thumbsPath = 'public/productImages/' + id + '/gallery/thumbs/' + req.files.file.name; //???

    productImage.mv(path, function (err) {
        if (err) console.log(err);

        resizeImg(fs.readFileSync(path), { width: 100, height: 100 }).then(function (buf) {
            fs.writeFileSync(thumbsPath, buf);
        });
    });

    res.sendStatus(200);
});


/**
 *  GET delete product 
 */
router.get('/deleteProduct/:id', function (req, res) {
    var id = req.params.id;
    var path = 'public/productImages/' + id;

    fs.remove(path, function (err) {
        if (err) {
            console.log(err);
        } else {
            Product.findByIdAndRemove(id, function (err) {
                console.log(err);
            });
            res.redirect('/admin/products');
        }
    });
});


/**
 * GET delete image 
 */

router.get('/deleteImage/:image', function (req, res) {

    var originalImage = 'public/productImages/' + req.query.id + '/gallery/' + req.params.image;
    var thumbImage = 'public/productImages/' + req.query.id + '/gallery/thumbs/' + req.params.image;

    fs.remove(originalImage, function (err) {
        if (err) {
            console.log(err);
        } else {
            fs.remove(thumbImage, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/admin/products/editProduct/' + req.query.id);
                }
            });
        }

    });
});

// =======================================




// /**
//  * GET delete product
//  */

// router.get('/deleteProduct/:id', function (req, res) {
//     Product.findByIdAndRemove(req.params.id, function (err) {
//         if (err)
//             return console.log(err);

//         res.redirect('/admin/products');
//         // req.flash("Success", 'Page deleted.'); // not working for some reason =/
//     })
// });




// Exports
module.exports = router;