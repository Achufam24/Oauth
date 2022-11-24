const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const GithubStrategy = require('passport-github2');

const User = require('../model/user');

//serialize user
passport.serializeUser((user,done) => {
   done(null, user._id);
});


   

passport.deserializeUser((id,done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})




passport.use(new GoogleStrategy( {
    //options for strategy
    callbackURL:"http://localhost:3030/auth/google/redirect",
    clientID:process.env.clientID,
    clientSecret:process.env.clientSecret
}, function(accessToken,refreshToken,profile,done){
    console.log('callback function fired!');
    console.log(profile);

    //check if user exists
    User.findOne({googleId:profile.id}).then((currentUser) => {
        if (currentUser) {
            console.log("user is:", currentUser);
            done(null,currentUser);
        }else{
            //create new user, if it does not exists
            new User({
                username:profile.displayName,
                googleId:profile.id,
                thumbnail:profile.photos.at(0).value
            }).save().then((newUser) => {
                console.log(newUser);
                done(null, newUser);
            })
        }
    })
} ) );


passport.use(new FacebookStrategy({
    clientID: process.env.facebookClientID,
    clientSecret: process.env.facebookClientSecret,
    callbackURL: "http://localhost:3030/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'photos']
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(profile);

    //check if user exists
    User.findOne({facebookId:profile.id}).then((currentUser) => {
        if (currentUser) {
            console.log("User is:", currentUser);
            done(null,currentUser)
        }else{
            //create new user if it does not exists
            new User({
                username:profile.displayName,
                facebookId:profile.id,
                thumbnail:profile.photos.at(0).value
            }).save().then((newUser) => {
                console.log(newUser);
                done(null,newUser)
            })
        }
    })
  }));

  passport.use(new GithubStrategy({
    clientID:process.env.githubClientID,
    clientSecret:process.env.githubClientSecret,
    callbackURL: "http://localhost:3030/auth/github/redirect"
  },
  function(accessToken,refreshToken,profile,done) {
    console.log(profile);

    User.findOne({githubId:profile.id}).then((currentUser) => {
        if (currentUser) {
            console.log('User is:', currentUser);
            done(null, currentUser)
        }else{
            new User({
                username:profile.displayName,
                githubId:profile.id,
                thumbnail:profile.photos.at(0).value
            }).save().then((newUser) => {
                console.log(newUser);
                done(null, newUser)
            })
        }
    })
  }));

 