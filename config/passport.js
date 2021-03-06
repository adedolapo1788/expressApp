const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const passport = require('passport');
const bcrypt = require('bcryptjs');

module.exports = ()=>{
    //local strategy
    passport.use(new LocalStrategy(
        function(username, password, done) {
            let query = {username:username};
          User.findOne(query, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }

            // match password
            bcrypt.compare(password, user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(null, false, { message: 'Incorrect password.' });
                }
            }); 
          });
        }));

        passport.serializeUser(function(user, done) {
            done(null, user.id);
          });
          
          passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
              done(err, user);
            });
          });
}
