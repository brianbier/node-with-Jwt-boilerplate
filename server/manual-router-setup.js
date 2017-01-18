// This file is not used anywhere in in the site. it is just used as an example of what 
// you can do with the login route manually


const AuthenticationController = require('./controllers/authentication'),  
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport'),
      jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      User = require('./models/user'),
      config = require('./config/main');

//Middleware to require login/auth
const requireAuth = passport.authenticate('jwt',{ session: false });
const requireLogin = passport.authenticate('local',{ session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin",  
      REQUIRE_OWNER = "Owner",
      REQUIRE_CLIENT = "Client",
      REQUIRE_MEMBER = "Member";


module.exports = function(app){
  app.use(passport.initialize())
  //initializing route group
  const apiRoutes = express.Router();
        // authRoutes = express.Router();

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  // apiRoutes.use('/auth',authRoutes);

  // Registration route
  apiRoutes.post('/register',AuthenticationController.register)    

  //login route
  apiRoutes.post('/login',function(req,res,next){
    User.findOne({email:req.body.email},function(err,user){
        if(err){return  next(err)}
    if(!user){
      return res.status(422).send({error: 'Authenciation Failed. User not Found'});
    }else{
      // Check if passport matches
      user.comparePassword(req.body.password,function(err,isMatch){
        if(isMatch && !err){
          // Create token if the password matched and no error was thrown
          var token = jwt.sign(user,config.secret,{
              expiresIn: 10080 // in seconds
          });
          const userInfo = {
              _id: user._id,
              firstName: user.profile.firstName,
              lastName: user.profile.lastName,
              email: user.email,
              role: user.role
            }

          res.status(200).json({success: true, token: 'JWT' + token, user: userInfo})
        }else{
          res.status(422).send({error: "Authenciation failed. password did not match"})
        }
      })
    }
    })
  });
  //Set url for Api group routes
  app.use('/api',apiRoutes)    
}