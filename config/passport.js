const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models')
const social = require('./social')

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user)=> {
            done(err, user)
        })
    })
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, (req, email, password, done) => {
        process.nextTick(()=>{
            User.findOne({'email': email}, (err, user)=> {
                if(err){
                    return done(err)
                }
                if(user) {
                    return done(null, false);
                } else {
                    let newUser = new User();
                    newUser.email = email;
                    newUser.password = newUser.generateHash(password);
                    newUser.firstname = req.body.firstname;
                    newUser.lastname = req.body.lastname;
                    newUser.phone = req.body.phone
                    newUser.save((err, user)=>{
                        if(err) throw err;
                        return done(null, user) 
                    })
                }
            })
        })
    }))
    passport.use('local-login', new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
        session:false
    },
    (req, email, password, done) => {
        User.findOne({'email': email}, (err, user) => {
            if(err) return done(err);
            if(!user){
                return done(null, false)
            }
            if(!user.validPassword(password, user.password)){
                return done(null, false)
            }
            return done(null, user);
        });
    }));

    passport.use('facebook', new FacebookStrategy({
        clientID: social.facebook.id,
        clientSecret: social.facebook.secret,
        callbackURL: social.facebook.callback
    },
    function(accessToken, refreshToken, profile, done){
        User.findOne({"facebook.id": profile.id}, function (err, user){
            if(err){
                console.log(err)
            }
            if(!err && user !== null){
                done(null, user)
            } else {
                let newUser = new User ({
                    "facebook.id": profile.id,
                    "facebook.token": "3k392345353434",
                    "facebook.name" : profile.displayName
                });
                newUser.save(function(err){
                    if(err) throw err;
                    return done(null, newUser)
                })
            }
        })
    }))
}






