const express = require('express');
const Router = express.Router();
const userSchema = require('../models/user');

// =====================================================
// user registration (Help from and credits to Ali Babar)
// =====================================================
/**
   * Performs the user registration start
   * I found this code on https://www.youtube.com/watch?v=oLuuIgiyxmg.
   *
   * @author Ali Babar
   * @see https://www.youtube.com/watch?v=oLuuIgiyxmg 
   */


Router.get('/', function (err, res) {
    res.render('register', { title: 'Fill Form', password: '', email: '' })
})


Router.post('/register', async function (req, res) {
    try {
        const { name, number, email, password, cpassword } = req.body;
        if (password === cpassword) {
            const userData = new userSchema({ name, number, email, password });

            userData.save(function (err) {
                if (err) {
                    throw err;
                } else {
                    res.render('register', { title: 'Done', password: '', email: '' });
                }
            });

            const userEmail = await userSchema.findOne({ email: email });
            if (email === userEmail.email) {
                res.render('register', { title: '', password: '', email: 'Email taken' });
            } else {
                throw err;
            }

        } else {
            res.render('register', { title: '', password: 'Unmatching password', email: '' })
        }
    } catch (error) {
        res.render('register', { title: 'Error in Code', password: '', email: '' });
    }
})
/* Performs the user registration end */


// =====================================================
// logging in
//=====================================================

// the /login is the form's action attribute
Router.post('/login', function (req, res) {

    const { email, password } = req.body;

    userSchema.findOne({ email: email }, function (err, result) {
        if ((email === "cwu213@my.bcit.ca"
            || email === "cchao38@my.bcit.ca"
            || email === "jliu436@my.bcit.ca"
            || email === "bzhou24@my.bcit.ca") && password === result.password) {

            res.render('dashboard');
        } else if (email === result.email && password === result.password) {

            res.render('home')
        } else {
            throw err;
        }
    })
});


// =====================================================
// logout
//=====================================================

/* shows logout code start
 * This performs the logout feature
 * source: https://codedec.com/tutorials/logout-using-passport-module-in-node-js/
 */
Router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
/* shows logout code end
 * source: https://codedec.com/tutorials/logout-using-passport-module-in-node-js/
 */

module.exports = Router;