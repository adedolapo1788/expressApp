const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

//Bring in user model
let User = require('../models/user');

//Register Form
router.get('/register',(req,res)=>{
    res.render('register');
});

//Register Process
router.post('/register',(req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('password2', 'password do not match').equals(req.body.password);

    let errors = req.validationErrors();
    if(errors){
        res.render('register',{
            errors:errors
        });
    }else {
        let newUser = new User({
            name:name,
            email:username,
            username:username,
            password:password
        });
        bcrypt.genSalt(10,function(error,salt){
            bcrypt.hash(newUser.password,salt,function(err,hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(error){
                        console.log(err);
                        return;
                    }else {
                        req.flash('success', 'You are now registered and can Log In');
                        res.redirect('/users/login');
                    }
                })
            });
        });
    }
});


//login form
router.get('/login',(req,res)=>{
    res.render('login');
})
//login process
router.post('/login',function(req,res,next){
   passport.authenticate('local',{
       successRedirect:'/',
       failureRedirect:'/users/login',
       failureFlash:true
   })(req,res,next);
});

//Logout out 
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','You are logged out');
    res.redirect('/users/login');
});

module.exports=router;