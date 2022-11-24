const express = require('express');
const passport = require('passport');



const router = express.Router();


router.get('/login',(req,res) => {
    res.render('login', {user: req.user});
});



router.get('/logout', function(req, res, next) {
    //handle with passport
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  

//auth with google
router.get('/google',passport.authenticate('google',{
    scope:['profile'],
    prompt: 'select_account'
}));



//callback route for google
router.get('/google/redirect', passport.authenticate('google'),(req,res) => {
    res.redirect('/profile');
    console.log(req.user.username);
});

router.get('/facebook',
  passport.authenticate('facebook', { authType: 'reauthenticate', }));

router.get('/facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

  //Github
  router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

  router.get('/github/redirect', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });


module.exports = router;