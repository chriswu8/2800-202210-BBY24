"use strict";
const express = require('express');
var session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
const dashboardRouter = require('./routers/dashboardRouter');
const { body, validationResult } = require('express-validator');
const pageSchema = require('./models/page')
const fileUpload = require('express-fileupload');

const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const port = process.env.PORT || 8000;
const app = express();
// const url = 'mongodb://localhost:27017/cart';
const url = 'mongodb+srv://atmospal:w7BYxfThauyMUO58@realmcluster.s7dvc.mongodb.net/BBY_24_user_for_group_24?retryWrites=true&w=majority';

// ======================================
// sessions
// ======================================
// app.use(session({
//     secret: 'someSecret',
//     resave: true,
//     saveUninitialized: true,
//     store: MongoStore.create({
//         mongoUrl: url,
//         ttl: 24 * 60 * 60,
//         collection: 'mySessions',
//         autoRemove: 'native'
//     })
// })
// );

// express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// express-validator middleware
app.post('/user', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
    }).then(user => res.json(user));
});

app.post(
    '/user',
    // username must be an email
    body('username').isEmail(),
    // password must be at least 8 chars long
    body('password').isLength({ min: 8 }),
    (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        User.create({
            username: req.body.username,
            password: req.body.password,
        }).then(user => res.json(user));
    },
);


//Mongodb atlas
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

mongoose.connect(url, connectionParams)
    .then(
        function () { console.log("Connected to local MongoDB. Nice!"); },
        function(err) { console.log("Did not connect to  MongoDB =(")}
    );

// EJS setup
app.set('views', path.join(__dirname, 'views'));
// app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// set global errors variable
app.locals.errors = null;

// express fileupload middleware
app.use(fileUpload());

app.use(express.static('uploads'));

/**
 * For post requests, which sends data (in the form of some data object) to the server.
 * We need to ask server to store that data (object), which is enclosed in the body (i.e. req.body) of that POST request.
 * express.urlencoded() recognizes the incoming object as strings or arrays, and converts the request body to JSON (which is converted to BSON that gets stored to MongoDB)
 */
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false }));

app.use(passport.session());

app.use('/', dashboardRouter);

app.use('/dashboard', dashboardRouter);

app.use('/home', dashboardRouter);

// Express messages middleware 
app.use(cookieParser());
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// +++++++++++++++++++++++++++
// integration testing below
// ++++++++++++++++++++++++++
const Posting = require('./models/Posting');

// const postingRouter = require('./routers/postings');
// app.use('/login/postings', postingRouter);

app.get('/login/postings', async function (req, res) {

    // const posts = [
    //     {
    //         title: 'Title1.1',
    //         snippet: 'abcdefghijklmnop',
    //         author: 'Chris',
    //         dateCreated: new Date,
    //         img: 'placeholder.jpg'
    //     },
    //     ]

    const posts = await Posting.find().sort({ timeCreated: 'asc' });

    res.render('index', { posts: posts })
});



// +++++++++++++++++++++++++++
// integration testing above
// +++++++++++++++++++++++++++


// Setting routes
const pages = require('./routers/pages'); // for regular users
app.use('/', pages);

const adminPages = require('./routers/adminPages');
app.use('/admin/pages', adminPages);

const adminCategories = require('./routers/adminCategories');
app.use('/admin/categories', adminCategories);

const adminProducts = require('./routers/adminProducts');
app.use('/admin/products', adminProducts);

// ======================================================
// Chat feature (credit to Brad Traversey) - start
// ======================================================
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const server = http.createServer(app);
const io = socketio(server);

const botName = 'AtmosBot ';

var count = 0;
// Run when client connects
io.on('connection', socket => {
  count++;
  console.log("New WS connection!!! BAM! " + count);
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // message to the CURRENT (single) user
    socket.emit('message', formatMessage(botName, 'You are in AtmosChat. How can we help you today?'));

    // message to all clients except to the client who's connecting
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // message to all clients in general
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

// ======================================================
// Chat feature (credit to Brad Traversey) - end
// ======================================================

server.listen(port);
console.log("listening to port " + port + "!");