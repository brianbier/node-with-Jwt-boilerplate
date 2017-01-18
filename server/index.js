const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      logger = require('morgan'),
      router = require('./router');
      config = require('./config/main');

mongoose.connect(config.database);

//Setting up basict middleware for all Express requests
app.use(logger('dev')); // Log request to API using morgan

//Enable CORS from client-side
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
})

// body-parser, so we can parse urlencoded bodies to JSON and expose the object in req.body when we start building endpoints.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Start server 
const server = app.listen(config.port);
console.log('Your server is running on '+ config.port + '.')

router(app);
