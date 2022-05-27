const express = require('express');
const Router = express.Router();
const userSchema = require('../models/user');
const {                         
    authCheck,
    authCheckAdmin
} = require("../middleware/auth");
// const authMiddleware = require('../middleware/auth'); //new
const registerusers = require('../models/user');
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
    //     if(req.session.privilege === 'admin') {                                         //new
    //     res.render('dashboard');
    // } else if (req.session.privilege === 'regular') {
    //     res.render('home');
    // } else {
    //     res.render('register', { title: 'Fill Form', password: '', email: '' });    //end
    // }
    // if (!req.session) {
    //     res.render('register', { title: 'Fill Form', password: '', email: '' });
    // } else if (req.session.privilege === 'admin') {
    //     res.render('dashboard');
    // } else if (req.session.privilege === 'regular') {
    //     res.render('home');
    // } else {
    //     res.render('register', { title: 'Fill Form', password: '', email: '' });
    // }
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

    userSchema.findOne({ email: email }, function (err, result) { //maybe add  'name _id', as second arg
        if ((email === "cwu213@my.bcit.ca"
            || email === "cchao38@my.bcit.ca"
            || email === "jliu436@my.bcit.ca"
            || email === "bzhou24@my.bcit.ca") && password === result.password) {
            
                //new
                req.session.email = email;
                req.session._id = result._id;
                req.session.privilege = 'admin';
                console.log(req.session);
                //end
            res.render('dashboard');
        }else if (err) {
            console.log('no matches found');
            res.redirect('/');
            
        }else if (!result) {
            console.log('no matches found');
            res.redirect('/');
            
        } else if (email === result.email && password === result.password) {
            //new
            req.session.email = email;
            req.session.email = result._id;
            req.session.privilege = 'regular';
            console.log(req.session);
            //end
            res.render('home')
        } else {
            console.log('no matches found');
            res.redirect('/');
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
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(req.session);
            console.log('success');
        }
    })
    req.logout();
    res.redirect('/');
});
/* shows logout code end
 * source: https://codedec.com/tutorials/logout-using-passport-module-in-node-js/
 */

// ====================================================
// User login session
//=====================================================

Router.get('/dash', function (req, res) {
    res.render('dashboard');
})

Router.get('/home',authCheck, (req, res) => { 
    res.render('home');
})

// ============================================================
// Regular user weather page
// ============================================================
Router.get('/weather', function(req, res){
    res.render('weather', {
        tempReal: temp,
        // makes reference to temperature data
        des: weatherDesc,
        // makes reference to weather's description data
        city: city,
        // makes reference to city data
        country: country,
        // makes reference to country data
        img: imgurl
        // makes reference to weather icons data
    });
});

// ============================================================
// AtmosPal easter egg
// ============================================================
Router.get('/easter_egg', function(req, res,){
    res.render('easter_egg');
})

// ============================================================
// Admin user feature
// ============================================================
Router.get('/add_user', function(req, res, next) {
    res.render('add_user', { title: "Add New User" });
});

// ====================================================
// Add new user feature
//=====================================================
/**
   * Create a new user start
   * I found this code on https://youtu.be/nvSVZW2x8BQ.
   *
   * @author Sahil Kumar
   * @see https://youtu.be/nvSVZW2x8BQ
   */
Router.post('/add', function(req, res) {
    const Registerusers = new registerusers({
        name: req.body.name,
        // makes reference to req.body's name data (specified in the name attribute of the form's <input> tag)
        password: req.body.password,
        // makes reference to req.body's password data (specified in the password attribute of the form's <input> tag)
        email: req.body.email,
        // makes reference to req.body's email data (specified in the email attribute of the form's <input> tag)
        number: req.body.number,
        // makes reference to req.body's phone number data (specified in the phone number attribute of the form's <input> tag)
        type: req.body.type,
        // makes reference to req.body's user type data (specified in the type attribute of the div's <input> tag)
    });
    Registerusers.save().then(result => {
        // save new user's data and redirect to admin user profile page 
        res.redirect('/all_users');
    })
});
/* Create a new user end */

// ====================================================
// Users route for admin user
//=====================================================
Router.get('/all_users',authCheck, function(req, res) {
    registerusers.find().exec(function(err, registerusers) {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('all_users', {
                // rendering the all_users.ejs file
                registerusers: registerusers,
            });
        }
    });
});

// ====================================================
// Users route for regular user
//=====================================================
Router.get('/profile', authCheck, function(req, res){
    registerusers.find().exec(function(err, registerusers) {
        if (err) {
            res.json({ message: err.message });
        } else {
            // rendering the profile.ejs file 
            res.render('profile', {
                registerusers: registerusers,
            });
        }
    });
});

// ====================================================
// Edit User Profile
//=====================================================
Router.get('/edit_user/:id', authCheckAdmin, function(req, res) {
    let id = req.params.id;
    registerusers.findById(id, function(err, registerusers) {
        if (err) {
            res.redirect('/all_users');
        } else {
            if (registerusers == null) {
                res.redirect('/all_users');
            } else {
                // rendering the edit_user.ejs file, get user's data
                res.render('edit_user', {
                    title: "Edit User",
                    registerusers: registerusers,
                });
            }
        }
    });
});
/* Edit a user end */

// ====================================================
// Update User Profile
//=====================================================
/**
   * Update a user information start
   * I found this code on https://youtu.be/7NnBCKJTZkc.
   *
   * @author Sahil Kumar
   * @see https://youtu.be/7NnBCKJTZkc
   */
Router.post('/update/:id', function(req, res) {

    let id = req.params.id;

    //find user data based on ID
    registerusers.findByIdAndUpdate(id, {
        name: req.body.name,
        // makes reference to req.body's name data (specified in the name attribute of the form's <input> tag)
        password: req.body.password,
        // makes reference to req.body's password data (specified in the password attribute of the form's <input> tag)
        email: req.body.email,
        // makes reference to req.body's email data (specified in the email attribute of the form's <input> tag)
        number: req.body.number,
        // makes reference to req.body's phone number data (specified in the phone number attribute of the form's <input> tag)
    }, (err, result) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully'
            };
            // rendering the all_users.ejs file 
            res.redirect('/all_users');
        }
    })
});
/* Update a user information end */

// ====================================================
// Delete User Profile
//=====================================================
/**
   * Delete a user start
   * I found this code on https://youtu.be/7NnBCKJTZkc.
   *
   * @author Sahil Kumar
   * @see https://youtu.be/7NnBCKJTZkc
   */
Router.get('/delete/:id', function(req, res) {
    let id = req.params.id;
    //find user data based on ID and delete it
    registerusers.findByIdAndRemove(id, function(err, result) {

        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: 'info',
                message: 'User deleted sucessfully'
            };
            // rendering the all_users.ejs file 
            res.redirect('/all_users');
        }
    });
});
/* Delete a user end */

// ======================================================================================================================

const Posting = require('../models/Posting');
const { response } = require('express');
const user = require('../models/user');

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
    // rendering the protocols.ejs file 
    res.render('protocols');
});



// ============================================================
// Regular user weather page
// ============================================================
/**
   * Implement weather API start
   * I found this code on https://youtu.be/3DGReM57lOo.
   *
   * @author Rahul Nimkande
   * @see https://youtu.be/3DGReM57lOo
   */
Router.get('/weather', function (req, res) {
    res.render('weather');
});

Router.post('/weather', async (req, res) => {

    const city = req.body.city;
    const unit = 'metric';
    const url_api = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherApiKey + '&units=' + unit;

    https.get(url_api, (response) => {
        response.on('data', (data) => {
            //convert JSON String from weather api passed into the function
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            // rendering the weather.ejs file 
            res.render('weather', {
                tempReal: realTemperature,
                // makes reference to temperature data
                des: des,
                // makes reference to weather's description data
                city: city,
                // makes reference to city data
                country: country,
                // makes reference to country data
                img: imgurl
                // makes reference to weather icons data
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
            //convert JSON String from weather api passed into the function
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            // rendering the van_weather.ejs file 
            res.render('van_weather', {
                tempReal: realTemperature,
                // makes reference to temperature data
                des: des,
                // makes reference to weather's description data
                city: city,
                // makes reference to city data
                country: country,
                // makes reference to country data
                img: imgurl
                // makes reference to weather icons data
            });
        })
    })
});


// ============================================================
// Regular user weather page
// ============================================================
Router.get('/weather', function (req, res) {
    // rendering the weather.ejs file 
    res.render('weather');
});

Router.post('/weather', async (req, res) => {

    const city = req.body.city;
    const unit = 'metric';
    const url_api = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherApiKey + '&units=' + unit;

    https.get(url_api, (response) => {
        response.on('data', (data) => {
            //convert JSON String from weather api passed into the function
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            // rendering the weather.ejs file 
            res.render('weather', {
                tempReal: realTemperature,
                // makes reference to temperature data
                des: des,
                // makes reference to weather's description data
                city: city,
                // makes reference to city data
                country: country,
                // makes reference to country data
                img: imgurl
                // makes reference to weather icons data
            });
        })
    })

});

// ============================================================
// Admin weather page
// ============================================================
Router.get('/adminWeather', function (req, res) {
    // rendering the adminWeather.ejs file 
    res.render('adminWeather');
});

Router.post('/adminWeather', async (req, res) => {

    const city = req.body.city;
    const unit = 'metric';
    const url_api = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + weatherApiKey + '&units=' + unit;

    https.get(url_api, (response) => {
        response.on('data', (data) => {
            //convert JSON String from weather api passed into the function
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            // rendering the weather.ejs file 
            res.render('weather', {
                tempReal: realTemperature,
                // makes reference to temperature data
                des: des,
                // makes reference to weather's description data
                city: city,
                // makes reference to city data
                country: country,
                // makes reference to country data
                img: imgurl
                // makes reference to weather icons data
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
            //convert JSON String from weather api passed into the function
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            // rendering the van_weather.ejs file 
            res.render('van_weather', {
                tempReal: realTemperature,
                // makes reference to temperature data
                des: des,
                // makes reference to weather's description data
                city: city,
                // makes reference to city data
                country: country,
                // makes reference to country data
                img: imgurl
                // makes reference to weather icons data
            });
        })
    })
});


// ============================================================
// Routing to admin user weather page (Vancouver)
// ============================================================
Router.get('/van_weather', function (req, res) {
    // rendering the van_weather.ejs file 
    res.render('van_weather', {
        tempReal: temp,
        // makes reference to temperature data
        des: weatherDesc,
        // makes reference to weather's description data
        city: city,
        // makes reference to city data
        country: country,
        // makes reference to country data
        img: imgurl
        // makes reference to weather icons data
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
            //convert JSON String from weather api passed into the function
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            // rendering the cal_weather.ejs file 
            res.render('cal_weather', {
                tempReal: realTemperature,
                // makes reference to temperature data
                des: des,
                // makes reference to weather's description data
                city: city,
                // makes reference to city data
                country: country,
                // makes reference to country data
                img: imgurl
                // makes reference to weather icons data
            });
        })
    })
});

// ============================================================
// Routing to admin user weather page (Calgary)
// ============================================================
Router.get('/cal_weather', function (req, res) {
    // rendering the cal_weather.ejs file 
    res.render('cal_weather', {
        tempReal: temp,
        // makes reference to temperature data
        des: weatherDesc,
        // makes reference to weather's description data
        city: city,
        // makes reference to city data
        country: country,
        // makes reference to country data
        img: imgurl
        // makes reference to weather icons data
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
            //convert JSON String from weather api passed into the function
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            // rendering the tor_weather.ejs file 
            res.render('tor_weather', {
                tempReal: realTemperature,
                // makes reference to temperature data
                des: des,
                // makes reference to weather's description data
                city: city,
                // makes reference to city data
                country: country,
                // makes reference to country data
                img: imgurl
                // makes reference to weather icons data
            });
        })
    })
});

// ============================================================
// Routing to admin user weather page (Toronto)
// ============================================================
Router.get('/tor_weather', function (req, res) {
    // rendering the tor_weather.ejs file 
    res.render('tor_weather', {
        tempReal: temp,
        // makes reference to temperature data
        des: weatherDesc,
        // makes reference to weather's description data
        city: city,
        // makes reference to city data
        country: country,
        // makes reference to country data
        img: imgurl
        // makes reference to weather icons data
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
            //convert JSON String from weather api passed into the function
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const realTemperature = temp;
            const country = weatherData.sys.country;
            const des = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgurl = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

            // rendering the nb_weather.ejs file 
            res.render('nb_weather', {
                tempReal: realTemperature,
                // makes reference to temperature data
                des: des,
                // makes reference to weather's description data
                city: city,
                // makes reference to city data
                country: country,
                // makes reference to country data
                img: imgurl
                // makes reference to weather icons data
            });
        })
    })
});

// ============================================================
// Routing to admin user weather page (New Brunswick)
// ============================================================
Router.get('/nb_weather', authCheck, function (req, res) {
    res.render('nb_weather', {
        tempReal: temp,
        // makes reference to temperature data
        des: weatherDesc,
        // makes reference to weather's description data
        city: city,
        // makes reference to city data
        country: country,
        // makes reference to country data
        img: imgurl
        // makes reference to weather icons data
    });
});
/* Implement weather API end */



module.exports = Router;
