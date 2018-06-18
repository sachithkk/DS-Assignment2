const passport                              = require('passport'); //get passport module
const User                                  = require('../models/user'); // get user model
const googleUser                            = require('../models/googleUser'); // get googleUser model
const localStrategy                         = require('passport-local').Strategy; // get passport-local module
const GoogleStrategy                        = require('passport-google-oauth20').Strategy; // get passport-google-oauth2 module
const GoogleKeys                            = require('./googleKeys');

/* this is serializeUser method.
*  serializeUser determines, which data of the user object should be stored in the session.
*  in here use user id.
* */
passport.serializeUser( (user, done) => {
    done(null , user.id);
});

/* this is serializeUser method. */
passport.deserializeUser( (id, done) => {
    // findById mongo method
    User.findById(id , (err, user) => {
        done(err, user);
    });
});

// User sign up
passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

} , function(req, email, password, done, fname, lname)  {

    // Validation part.
    req.checkBody('fname', '*First Name Required*').notEmpty();
    req.checkBody('lname', '*Last Name Required*').notEmpty();
    req.checkBody('email', 'Invalied email').notEmpty().isEmail();
    req.checkBody('password', 'Invalied password').notEmpty().isLength({min:4});

    // If errors occur that error message push into array and return array.
    var error = req.validationErrors();
    if(error){
        var messages = [];
        error.forEach((error) => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    //Find the user in mongo database with given email.
    User.findOne({'email': email}, function(err, user){
        //In case of any error return
        if(err){
           return done(err);
        }
        // If user existing for give email return message to user.
        if(user){
            return done(null, false, {message: "Email is alread in use"});
        }
        // If user is new user save details into mongo databse.
        var newUser = new User();
         newUser.fname = req.body.fname;
         newUser.lname = req.body.lname;
         newUser.email = email;
         newUser.password = newUser.encryptPassword(password);
         newUser.save(function(err, result){
             if(err){
                 return done(err);
             }
             return done(null, newUser);
         });

    });
}));

 // User sign in.
passport.use('local.signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    // Validation part.
    req.checkBody('email', 'Invalied email').notEmpty().isEmail();
    req.checkBody('password', 'Invalied Password').notEmpty();
    var error = req.validationErrors();
    if(error){
        var message = [];
        error.forEach(function (error) {
            message.push(error.msg);
        });
        return done(null, false, req.flash('error' , message));
    }
    User.findOne({email:email}, function (err, user) {
        //In case of any error return
        if(err){
            return done(err);
        }
        // Can not find user return error message.
        if(!user){
            return done(null, false, {message: "No user found"})
        }
        // Password is not match return error message.
        if(!user.validPassword(password)){
            return done(null, false, {message:"Password not match"})
        }
        // if user find return user.
        return done(null, user);
    })
}));


// Implementation of Google OAuth2
passport.use(
    new GoogleStrategy({
        callbackURL: '/user/profile',
        clientID: GoogleKeys.google.clientID, // google Id
        clientSecret: GoogleKeys.google.clientSecret // google secret key

    }, (accessToken, refreshToken, profile, done) => {

        // find user existing in our database if user find no add again user details into Database
        googleUser.findOne({googleId:profile.id})
            .then((currentUser) => {
                if(currentUser){
                    console.log("User is "+ currentUser);
                    done(null, currentUser);
                }else{
                    new googleUser({
                        username:profile.displayName,
                        googleId:profile.id
                    })
                        .save()
                        .then((newUser) => {
                            console.log(newUser);
                            done(null, newUser);
                        })

                }
            });



    })
);

