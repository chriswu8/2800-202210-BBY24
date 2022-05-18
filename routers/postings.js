// const express = require('express');
// const router = express.Router();
// const Posting = require('../models/Posting')

// // http://localhost:8000/login/postings/new
// router.get('/new', function (req, res) {
//     res.render('new');
// });

// // takes the argument ${posting.id}; dont forget the : before the parameter name!!!
// router.get('/:id', async function (req, res) {
//     //read operation; thePosting is the object that represents the entire thing submitted from the form
//     let thePosting = await Posting.findById(req.params.id);

//     if (thePosting) {
//         // rendering the show.ejs file, and passing in the 'thePosting' object 
//         res.render('show', { thePosting: thePosting });
//     } else {
//         return res.redirect('/login/postings');
//     }
// });


// // the route that gets redirected to from the preview page
// router.post('/postings', async function (req, res) {


//     // creating a Posting model (called thePosting)
//     let thePosting = new Posting({
//         // makes reference to req.body's title data (specified in the name attribute of the form's <input> tag)
//         title: req.body.title,
//         // makes reference to req.body's author data (specified in the name attribute of the form's <input> tag)
//         author: req.body.author,
//         // makes reference to req.body's description data (specified in the name attribute of the form's <input> tag)
//         description: req.body.description
//     });
//     console.log(req.body);

//     // =======================================
//     // Try-catch
//     // =======================================
//     try {
//         // save() WRITES to mongoDB and returns an id to posting
//         thePosting = await thePosting.save();
//         console.log("id: " + thePosting.id);

//         // pass ${posting.id} as parameter; dont forget the / before posting.id!!!
//         res.redirect('/postings/${thePosting.id}'); // this is the 'prevew page' before returning to the main postings page
//     }

//     catch (error) {
//         console.log("Failed to write to MongoDB");
//         console.log(error);
//     }
// });



// module.exports = router;