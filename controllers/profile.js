const express = require('express');
const mongoose = require('mongoose');
const Router = express.Router();
const registerusers = mongoose.model('registerusers');

//User profile page
Router.get('/all_users', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
    res.render('all_users');
})

//Add user feature page
Router.get('/add_user', (req, res) => {
    res.render('add_user');
})

function insertRecord(req, res) {
    var registerusers = new registerusers();
    registerusers.name = req.body.name;
    registerusers.password = req.body.password;
    registerusers.cpassword = req.body.cpassword;
    registerusers.email = req.body.email;
    registerusers.user_type = req.body.user_type;
    registerusers.save = ((err, doc) => {
        if (!err)
            res.redirect('/all_users');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('add_user', {
                    registerusers: req.body
                });
            }
            else
                throw err;
        }
    });
}

function updateRecord(req, res) {
    registerusers.findOneAndUpdate({ _id: req.body._id }. req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('all_users'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('add_user', {
                    registerusers: req.body
                });
            }
            else
                throw err;
        }
    })
}

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['NameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

Router.get('')

module.exports = Router;