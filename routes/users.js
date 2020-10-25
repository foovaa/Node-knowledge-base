const express      = require('express');
const bodyP        = require('body-parser');
const User         = require('../models/user');
const bcrypt       = require('bcryptjs');
const passport     = require('passport');
// var csrf           = require('csurf');

const {findById, deleteOne, updateOne}  = require('../models/post');
// const { userValidationRules, validate } = require('./validator.js')
const { body, check, validationResult } = require('express-validator')

const router             = express.Router();

// var csrfProtection = csrf({ cookie: true });

const url_encoded_parser = bodyP.urlencoded({ extended: false });
const url_encoded_json   = bodyP.json();

router.get('/', (req, res) => users(req, res));
router.get('/user/login/', (req, res) => getLogin(req, res));
router.get('/user/logout/', (req, res) => getLogout(req, res));
router.get('/user/:id/dashboard/', (req, res) => dashboard(req, res));
router.get('/user/register/', (req, res) => getNewUser(req, res));

// router.post('/user/login/', url_encoded_parser,
//                             passport.authenticate('local', { successRedirect: '/'}),
//                             (req, res, next) => postLogin(req, res, next));

router.post('/user/login', passport.authenticate('local', { successRedirect: '/',
                                                        failureRedirect: '/users/user/login',
                                                        failureFlash: true })
);

router.post('/user/register/', 
            url_encoded_parser,
            // csrfProtection,
            [
                body('username').notEmpty().withMessage('Username is required'),
                body('email').notEmpty().withMessage('Email is required'),
                body('email').isEmail(),
                body('password').notEmpty(),    
            ], (req, res) => postNewUser(req, res));


function users(req, res) {

    User.find({}, function(err, users){
        if (err) 
            console.log(err);
        else {
            res.render('user/users', {
                title: 'Users',
                users: users
            }); 
        }
    });
}


function getLogout(req, res) {
    req.logout();
    req.flash('success', 'You logged out!');
    res.redirect('/users/user/login');
}


function getLogin(req, res) {
    
    res.render('user/login',
    {
        title: "Sign In",
        // csrfToken: req.csrfToken()
    });
}

// function dashboard(req, res) {
//     User.findById(req.body.id, )
// }

function postLogin(req, res, next) {
    res.redirect('/');
}
// function postLogin(req, res, next) {
//     passport.authenticate('local', { successRedirect: '/',
//                                     failureRedirect: '/users/user/login',
//                                     failureFlash: true })(req, res, next);
// }


function getNewUser(req, res) {
    res.render('user/register',
    {
        title: "Sign Up",
        // csrfToken: req.csrfToken()
    });
}



function postNewUser(req, res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.render('user/register', {
            title: 'Sign Up',
            // csrfToken: req.csrfToken(),
            errors: errors
        });
        return;
    } 
    const username = req.body.username;
    const email    = req.body.email;
    const password = req.body.password;
    
    const user    = new User();
    user.username = username;
    user.email    = email;


    console.log(req.body.username);
    console.log(req.body.email);
    console.log(req.body.password);

        
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash){
            if (err) {
                console.log("hash >>>>>>>>>>>>>>>>>>>>>>>");
                console.log(err);
                return ;
            } else {
                user.password = hash;    
                console.log(user.password);
                user.save(function(err){

                    if (err) {
                        console.log('err>>>>>>>>>>>.');
                        console.log(err);
                        return;
                    }
                    else {
                        req.flash("success", 'User created');
                        res.redirect('/users/');
                    }
                });
            }
        });
    });


}





module.exports = router;