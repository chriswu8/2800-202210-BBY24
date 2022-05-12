const express = require('express');
const router = express.Router();
const Posting = require('./../models/Posting')

// http://localhost:8000/login/postings/new
router.get('/new', function (req, res) {
    res.render('new');
})

// takes the argument ${posting.id}; dont forget the : before the parameter name!!!
router.get('/:id', async function (req, res) {
  let thePosting = await Posting.findById(req.params.id);

  if (thePosting) {
      res.render('show', {thePosting: thePosting});
  } else {
      return res.redirect('/login/postings');
  }
});


// the route that handle the new post
router.post('/login/postings', async function (req, res) {
    console.log(req.body);
    let thePosting = new Posting({
        // references req.body
        title: req.body.title,
        author: req.body.author,
        description: req.body.description
    });

    // =======================================
    // Try-catch
    // =======================================
    try {
        // save() returns an id to posting
        thePosting = await thePosting.save();
        console.log("id: " + thePosting.id);

        // pass ${posting.id} as parameter; dont forget the / before posting.id!!!
        res.redirect(`/login/postings/${thePosting.id}`);
    }

    catch (error) {
        console.log(error);
    }
});

module.exports = router;