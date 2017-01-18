//importing passport, strategies and config

const passport = require('passport'),
      User = require('../models/user'),
      config = require('./main'),
      JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt,
      LocalStrategy = require('passport-local');

// we will tell passport that we have opted to use the email field rather than the default username field:
const localOptions = {usernameField: 'email'};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions,function(email,password,done){
  User.findOne({email:email},function(err,user){
    if(err) return done(err);
    if(!user) return done(null,false,{error: 'Your login details could not be verified!'});

    user.comparePassword(password,function(err,isMatch){
      if(err) return done(err);
      if(!isMatch) return done(null,false,{error: 'Your login details could not be verified!'});
      return done(null,user);
    })
  })
})

//set up the JWT authentication options
const jwtOptions = {
  //Telling passport to check authorization headers for jwt
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  //Telling Passport where to find the secret
  secretOrKey: config.secret
}

// Now, we can set up our JWT login strategy and pass our options through
const jwtlogin = new JwtStrategy(jwtOptions,function(payload,done){
  console.log(payload);
  User.findById(payload._id,function(err,user){
    if(err) return done(err,false);

    if(user){
      done(null,user);
    }else{
      done(null,false);
    }
  })
})


passport.use(jwtlogin);
passport.use(localLogin);

