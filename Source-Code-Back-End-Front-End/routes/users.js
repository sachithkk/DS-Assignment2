var express                                 = require('express');
var router                                  = express.Router();

const csrf                                  = require('csurf');
const passport                              = require('passport');

const csrfProtection                        = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('user/profile');
});

router.get('/logout', (req, res) => {
    req.logout();
    req.session.cart = null;
    res.redirect('/');
});

router.get('/', notLoggedIn, (req, res, next) => {
  next();
});

router.get('/signup' , (req, res) => {
    var messages= req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages:messages, hasErrors:messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup',{
    failureRedirect: '/user/signup',
    failureFlash: true
}) , function(req, res) {
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect('/');
    }
});

router.get('/signin', (req, res, next) => {
    var messages= req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages:messages, hasErrors:messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res, next){

    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect('/user/profile');

    }
    else{
        res.redirect('/');
    }
});

router.get('/google', passport.authenticate('google', {
    scope:['profile']
}));

router.get('/google/profile', passport.authenticate('google'), (req, res) => {
    
    res.redirect('/profile', {csrfToken: req.csrfToken(), messages:messages, hasErrors:messages.length > 0})
    
});


module.exports = router;
function isLoggedIn(req, res, next){
    // This is a function include in passport.js, It check if a user is authenticated or not
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function notLoggedIn(req, res, next){

    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}