const express = require('express');
const router = express.Router();

//Bring in article models
let Article = require('../models/article');

//User model
let User = require('../models/user');

  //Add Route
  router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('add_articles',{
        title:'add articles',
    });
});

  //Add Submit POST Route
  router.post('/add',(req,res)=>{
    req.checkBody('title','Title is required').notEmpty();
    // req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();

    //Get Errors
    let errors = req.validationErrors();
    if(errors){
        res.render('add_articles',{
            title:'Add Article',
            errors:errors
        });
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;
        
        article.save(function(err){
            if(err){
                console.log(err);
            }else{
                req.flash('success','Article Added');
                res.redirect('/');
            }
        });
    }
});
  
 
  //get single articles
  router.get('/:id',(req,res)=>{
      Article.findById(req.params.id,function(err,article){
          User.findById(article.author,(err,user)=>{
            res.render('article',{
                article:article,
                author:user.name
            });
          });
      });
    });
  //load Edit form
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    if(article.author !=req.user._id){
        req.flash('danger','Not Authorized');
        res.redirect('/');
    }
    Article.findById(req.params.id,function(err,article){
  
      if(err){
          console.log('err');
      }else{
          res.render('edit_article',{
              title:'Edit Article',
              article:article
          });
      }
    });
  });

        //delete request
        router.delete('/:id',(req,res)=>{
            if(!req.user._id){
                res.status(500).send();
            }
            let query = {_id:req.params.id}

            Article.findById(req.params.id,function(err,article){
                if(article.author != req.user._id){
                    res.status(500).send();
                }else{
                    Article.remove(query,(err)=>{
                        if(err){
                            console.log(err);
                        }
                        res.send('Success');
                    });
                }
            });
        });
        

    //Update Submit Post
    router.post('/edit/:id',(req,res)=>{
        let article = {};
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;
        
        let query = {_id:req.params.id}
        Article.update(query,article,function(err){
            if(err){
                console.log(err);
            }else{
                req.flash('success', 'article Updated')
                res.redirect('/');
            }
        })
    });

    //Access control
    function ensureAuthenticated(req,res,next){
        if(req.isAuthenticated()){
            return next()
        } else{
            req.flash('danger','please Login');
            res.redirect('/users/login');
        }
    }
  module.exports = router;