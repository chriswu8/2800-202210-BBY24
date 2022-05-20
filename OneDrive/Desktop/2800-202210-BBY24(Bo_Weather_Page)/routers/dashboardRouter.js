const express = require('express');
const Router = express.Router();
const userSchema = require('../models/user');
const {
    checkNotAuthenticated,
    checkAuthenticated,
} = require("../middleware/auth");
const registerusers = require('../models/user');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const weatherApiKey = '331b0695fcab54c85d0b414147df6eaf';
const https = require('https');
const temp = '';
const weatherDesc = '';
const city = '';
const country = '';
const imgurl = "https://cdn.iconscout.com/icon/free/png-256/sunny-weather-1-458138.png";

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

// module.exports = Router;


// ====================================================
// User login session
//=====================================================
// Router.get('/dashboard', checkNotAuthenticated, checkAuthenticated, (req, res) => {
//     res.render('dashboard');
// })

Router.get('/dash', function (req, res) {
    res.render('dashboard');
})

Router.get('/home', checkNotAuthenticated, checkAuthenticated, (req, res) => {
    res.render('home');
})

// ============================================================
// Regular user weather page
// ============================================================
Router.get('/weather', (req, res) => {
    res.render('weather', {
        tempReal: temp,
        des: weatherDesc,
        city: city,
        country: country,
        img: imgurl
    });
});

Router.get('/easter_egg', (req, res,) => {
    res.render('easter_egg');
})

Router.get('/', (req, res, next) => {
    res.render('all_users', { title: "All Users" });
});

Router.get('/add_user', (req, res, next) => {
    res.render('add_user', { title: "Add New User" });
});

// ====================================================
// Upload avatar
//=====================================================
var storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage,
}).single('image');

// ====================================================
// Add new user
//=====================================================
Router.post('/add', upload, (req, res) => {
    const Registerusers = new registerusers({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        number: req.body.number,
        type: req.body.type,
        image: req.file.filename
    });
    Registerusers.save().then(result => {
        // res.status(201).json({
        //   message: "User registered successfully!",
        // });
        res.redirect('/all_users');
    })
});

// ====================================================
// Users route for admin user
//=====================================================
Router.get('/all_users', (req, res) => {
    registerusers.find().exec((err, registerusers) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('all_users', {
                registerusers: registerusers,
            });
        }
    });
});

// ====================================================
// Users route for regular user
//=====================================================
Router.get('/profile', (req, res) => {
    registerusers.find().exec((err, registerusers) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('profile', {
                registerusers: registerusers,
            });
        }
    });
});

// ====================================================
// Edit User Profile
//=====================================================
Router.get('/edit_user/:id', (req, res) => {
    let id = req.params.id;
    registerusers.findById(id, (err, registerusers) => {
        if (err) {
            res.redirect('/all_users');
        } else {
            if (registerusers == null) {
                res.redirect('/all_users');
            } else {
                res.render('edit_user', {
                    title: "Edit User",
                    registerusers: registerusers,
                });
            }
        }
    });
});

// ====================================================
// Update User Profile
//=====================================================
Router.post('/update/:id', upload, (req, res) => {

    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            throw err;
        }
    } else {
        new_image = req.body.old_image;
    }

    registerusers.findByIdAndUpdate(id, {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        number: req.body.number,
        image: new_image
    }, (err, result) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully'
            };
            res.redirect('/all_users');
        }
    })
});

// ====================================================
// Delete User Profile
//=====================================================
Router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    registerusers.findByIdAndRemove(id, (err, result) => {
        if (result.image != '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (err) {
                throw err;
            }
        }

        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: 'info',
                message: 'User deleted sucessfully'
            };
            res.redirect('/all_users');
        }
    });
});

// ======================================================================================================================

const Posting = require('../models/Posting');
const { response } = require('express');

// http://localhost:8000/login/postings/new
Router.get('/new', function (req, res) {
    res.render('new');
});

// takes the argument ${posting.id}; dont forget the : before the parameter name!!!
Router.get('/', async function (req, res) {
    //read operation; thePosting is the object that represents the entire thing submitted from the form
    let thePosting = await Posting.findById(req.params.id);

    if (thePosting) {
        // rendering the show.ejs file, and passing in the 'thePosting' object 
        res.render('show', { thePosting: thePosting });
    } else {
        return res.redirect('/login/postings');
    }
});


// the route that gets redirected to from the preview page
Router.post('/postings', async function (req, res) {


    // creating a Posting model (called thePosting)
    let thePosting = new Posting({
        // makes reference to req.body's title data (specified in the name attribute of the form's <input> tag)
        title: req.body.title,
        // makes reference to req.body's author data (specified in the name attribute of the form's <input> tag)
        author: req.body.author,
        // makes reference to req.body's description data (specified in the name attribute of the form's <input> tag)
        description: req.body.description
    });
    console.log(req.body);

    // =======================================
    // Try-catch
    // =======================================
    try {
        // save() WRITES to mongoDB and returns an id to posting
        thePosting = await thePosting.save();
        console.log("id: " + thePosting.id);

        // pass ${posting.id} as parameter; dont forget the / before posting.id!!!
        res.redirect('/login/postings'); // this is the 'prevew page' before returning to the main postings page
    }

    catch (error) {
        console.log("Failed to write to MongoDB");
        console.log(error);
    }
});

// ============================================================
// Integrating / routing to protocols page below
// ============================================================
Router.get('/protocols', function (req, res) {
    res.render('protocols');
});



// ============================================================
// Regular user weather page
// ============================================================
Router.get('/weather', function (req, res) {
    res.render('weather');
});

Router.post('/weather', async (req, res) => {

    const city = req.body.city;
    const unit = 'metric';
    const url_api = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherApiKey + '&units=' + unit;

    https.get(url_api, (response) => {
        response.on('data', (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            res.render('weather', {
                tempReal: realTemperature,
                des: des,
                city: city,
                country: country,
                img: imgurl
            });
        })
    })

});




// ============================================================
// Admin user weather page (Vancouver)
// ============================================================
Router.post('/van_weather', async function (req, res) {

    const city = req.body.city;
    const unit = 'metric';
    const url_api = 'https://api.openweathermap.org/data/2.5/weather?q=Vancouver&appid=' + weatherApiKey + '&units=' + unit;

    https.get(url_api, function (response) {
        response.on('data', function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            res.render('van_weather', {
                tempReal: realTemperature,
                des: des,
                city: city,
                country: country,
                img: imgurl
            });
        })
    })
});


// ============================================================
// Routing to admin user weather page (Vancouver)
// ============================================================
Router.get('/van_weather', function (req, res) {
    res.render('van_weather', {
        tempReal: temp,
        des: weatherDesc,
        city: city,
        country: country,
        img: imgurl
    });
});

// ============================================================
// Admin user weather page (Calgary)
// ============================================================
Router.post('/cal_weather', async function (req, res) {

    const city = req.body.city;
    const unit = 'metric';
    const url_api = 'https://api.openweathermap.org/data/2.5/weather?q=Calgary&appid=' + weatherApiKey + '&units=' + unit;

    https.get(url_api, function (response) {
        response.on('data', function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            res.render('cal_weather', {
                tempReal: realTemperature,
                des: des,
                city: city,
                country: country,
                img: imgurl
            });
        })
    })
});

// ============================================================
// Routing to admin user weather page (Calgary)
// ============================================================
Router.get('/cal_weather', function (req, res) {
    res.render('cal_weather', {
        tempReal: temp,
        des: weatherDesc,
        city: city,
        country: country,
        img: imgurl
    });
});

// ============================================================
// Admin user weather page (Toronto)
// ============================================================
Router.post('/tor_weather', async function (req, res) {

    const city = req.body.city;
    const unit = 'metric';
    const url_api = 'https://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=' + weatherApiKey + '&units=' + unit;

    https.get(url_api, function (response) {
        response.on('data', function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            res.render('tor_weather', {
                tempReal: realTemperature,
                des: des,
                city: city,
                country: country,
                img: imgurl
            });
        })
    })
});

// ============================================================
// Routing to admin user weather page (Toronto)
// ============================================================
Router.get('/tor_weather', function (req, res) {
    res.render('tor_weather', {
        tempReal: temp,
        des: weatherDesc,
        city: city,
        country: country,
        img: imgurl
    });
});

// ============================================================
// Admin user weather page (New Brunswick)
// ============================================================
Router.post('/nb_weather', async function (req, res) {

    const city = req.body.city;
    const unit = 'metric';
    const url_api = 'https://api.openweathermap.org/data/2.5/weather?q=New+Brunswick&appid=' + weatherApiKey + '&units=' + unit;

    https.get(url_api, function (response) {
        response.on('data', function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            res.render('nb_weather', {
                tempReal: realTemperature,
                des: des,
                city: city,
                country: country,
                img: imgurl
            });
        })
    })
});

// ============================================================
// Routing to admin user weather page (New Brunswick)
// ============================================================
Router.get('/nb_weather', function (req, res) {
    res.render('nb_weather', {
        tempReal: temp,
        des: weatherDesc,
        city: city,
        country: country,
        img: imgurl
    });
});




module.exports = Router;