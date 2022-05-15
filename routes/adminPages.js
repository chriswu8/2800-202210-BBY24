const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();
var { body, validationResult} = require('express-validator');
const app = express();
app.use(express.json());

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

router.post('/addPage', 
    
    body('title').notEmpty(),
    body('content').notEmpty(),

    function (req, res) {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            console.log("errors");
          return res.status(400).json({ errors: errors.array() });
        } else {
        console.log("success");
    }
        res.render('admin/addPage');
});



router.get('/test', function (req, res) {
    res.send('bbbbbbbbbb');
});






// Exports
module.exports = router;