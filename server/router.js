const AuthenticationController = require('./controllers/authentication'),  
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport');

//Middleware to require login/auth
// You would use requireAuth as a middleware for a route you want to protect. Maybe your app sends an email or something, but you only want authenticated users to be able to send an email:
// emailRoutes.post('/login', requireAuth, EmailController.sendEmail);
const requireAuth = passport.authenticate('jwt',{ session: false });

// This middle ware requires you to be login
const requireLogin = passport.authenticate('local',{ session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin",  
      REQUIRE_OWNER = "Owner",
      REQUIRE_CLIENT = "Client",
      REQUIRE_MEMBER = "Member";


module.exports = function(app) {  
  // Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router();

  //=========================
  // Auth Routes
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  
  // Registration route
  authRoutes.post('/register', AuthenticationController.register);

  // Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

// Set url for API group routes
  app.use('/api', apiRoutes);
};