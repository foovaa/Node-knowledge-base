const express = require('express');
const Post    = require('../models/post');
const bodyP   = require('body-parser');
const csrf    = require('csurf');

const {findById, deleteOne, updateOne}  = require('../models/post');
// const { userValidationRules, validate } = require('./validator.js')
const { body, validationResult } = require('express-validator');
const e = require('express');

// create application/json parser
var jsonParser = bodyP.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyP.urlencoded({ extended: false });
 


const router  = express.Router();

const csrfProtection = csrf({ cookie: true });

router.post('/post/add', urlencodedParser, csrfProtection, (req, res) => postNewPost(req, res));


function postNewPost(req, res) {   
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    res.render('post/addPost', {
        title: 'Create Post',
        errors: errors
    });
//   return res.status(400).json({ errors: errors.array() });
        return;
    }

    const post  = new Post()
    post.title  = req.body.title;
    post.author = req.user._id;
    post.body   = req.body.body;

    post.save(function(err){
        if (err) {
            console.log(err);
            return;
        }
        else {
            req.flash("success", 'Post created');
            res.redirect('/');
        }
    });

}

router.get('/:id', urlencodedParser, csrfProtection, function(req, res){
    Post.findById(req.params.id, function(err, post){
        console.log(post);
        res.render('post/post', {
            post: post,
            csrfToken: req.csrfToken()
        });
        return;
    });
});


router.get('/post/add/', loginRequired, csrfProtection, function(req, res){
    res.render('post/addPost', {
        title: 'I want to add post',
        csrfToken: req.csrfToken()
    });
});

// // Submit post method route
// router.post('/post/add/',
//     urlencodedParser,

//     function(req, res) {   
        
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             res.render('post/addPost', {
//                 title: 'Create Post',
//                 errors: errors
//             });
//         //   return res.status(400).json({ errors: errors.array() });
//             return;
//         }

//         const post  = new Post()
//         post.title  = req.body.title;
//         post.author = req.body.author;
//         post.body   = req.body.body;

//         post.save(function(err){
//             if (err) {
//                 console.log(err);
//                 return;
//             }
//             else {
//                 req.flash("success", 'Post created');
//                 res.redirect('/');
//             }
//         });

// }); 



router.get('/:id/edit/', csrfProtection, function(req,res){
    Post.findById(req.params.id, function(err, post){
        res.render('post/editPost', 
        { 
            post: post,
            csrfToken: req.csrfToken()
        });
        return;
    });
});


// Submit post method route
router.post('/:id/edit/', 
    urlencodedParser, csrfProtection,
    [
        body('title').notEmpty(),
        body('body').notEmpty(),
    ],

    function(req, res){
    
        let post    = {};
        post.title  = req.body.title;
        post.author = req.user._id;
        post.body   = req.body.body;

        let query   = {_id: req.params.id }

        Post.updateOne(query, post, function(err){
            if (err) {
                console.log(err);
                return;
            }
            else {
                res.redirect('/');
            }
    });

}); 

router.delete('/:id/delete', jsonParser, csrfProtection,
function(req, res){
        let query = Post.findById(req.params.id);
        Post.deleteOne(query, function(err){
            if (err)
                console.log(err);
            else 
                res.send('Success');
                // res.redirect('/');
    })
});


function loginRequired(req, res, next) {
    if(req.isAuthenticated())
        return next();
    else {
        req.flash('info', 'Please login first');
        res.redirect('/users/user/login');
    }
}

module.exports = router;