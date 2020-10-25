const express    = require('express');
const path       = require('path');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const expressS   = require('express-session');
const flash      = require('connect-flash');
const config     = require('./config/database');
const passport   = require('passport');
// const csrf       = require('csurf');
var cookieParser = require('cookie-parser');

const { validationResult } = require('express-validator');

// Mine
const Post       = require('./models/post');

// Routing Apps
const posts = require('./routes/posts');
const users = require('./routes/users');


/////////////////////////////////////////////////
//////////// DO NOT FORGET ORDERS ///////////////
/////////////////////////////////////////////////

// Init app
const app  = express()
const port = 3000
app.use(cookieParser());


////////////////////// DB ////////////////////////
// DATABASE configuration
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.once('open', function(){
    console.log('App is Connected to Mongodb...');
});
// Check for db's errors
db.on('error', function(err){
    console.log(err);
});
////////////////////// DB ////////////////////////

// Set Views
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');
// Set Static files
app.use(express.static(path.join(__dirname, "public")));


// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Express Sessions Middleware
app.use(expressS({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


// Passport validate middleware
require('../nodekb/config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// app.use(csrf({ cookie: true }))


// Express Messages Middleware
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});




// Posts
app.use('/posts/', posts); 
// Users
app.use('/users/', users); 

app.get('*', function(req, res, next){
    res.locals.user = req.user;
    next();
});

// ES6 syntax
// app.get('/', (req, res) => {
app.get('/', function(req, res) {

    Post.find({}, function(err, posts){
        if (err) 
            console.log(err);
        else {
            res.render('index', {
                title: 'Hello, world!',
                posts: posts
            }); 
        }
    });

});


// Start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})