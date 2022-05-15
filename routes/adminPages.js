const express = require('express');
const { append } = require('express/lib/response'); // auto generated
const router = express.Router();

/**
 * GET pages index
 */

router.get('/', function(req, res) {
    res.send("Admin Page")
});


/**
 * GET add page
 */

 router.get('/addPage', function(req, res) {
    const title = "";
    const slug = "";
    const content = "";
    
    res.render('admin/addPage', {
        title: title,
        slug: slug,
        content: content
    });

});



router.get('/test', function(req, res) {
    res.send('bbbbbbbbbb');
});






// Exports
module.exports = router;