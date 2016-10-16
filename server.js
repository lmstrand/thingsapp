// Get the packages we need
const express = require('express');
const app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var bodyParser = require('body-parser');

//var Thing = require('./models/thing');

// Connect to the things MongoDB
//var MongoClient = require('mongodb').MongoClient
//  , assert = require('assert');

// Connect to MongoDB and create/use database called thingsTest
mongoose.connect('mongodb://localhost/thingsTest');

// Create a schema
var ThingSchema = new mongoose.Schema({
  name: String,
  type: String,
  latitude: String,
  longitude: String,
  active: { type: String, default: "false" },
  battery: { type: String, default: "100%" },
  updated_at: { type: Date, default: Date.now },
});

// Create a model based on the schema
var Thing = mongoose.model('Thing', ThingSchema);

// Connection URL
//var url = 'mongodb://localhost:27017/things';

// Promise error "Mongoose: mpromise (mongoose's default promise library) is 
// deprecated, plug in your own promise library instead: 
// http://mongoosejs.com/docs/promises.html"

// MongoClient.Promise = global.Promise;


// Use connect method to connect to the server
// MongoClient.connect(url, function(err, db) {
	
//   assert.equal(null, err);
//   if (err)
//   	console.log(err);
//   console.log("Connected successfully to server");

//   db.close();
// });

// Create Express application
//var app = express();

// Use the body-parser package in our application

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.use(bodyParser.urlencoded({
//   extended: true
// }));


// Use environment defined port or 3000
const port = process.env.PORT || 3000;

// Create Express router
var router = express.Router();



// Register all our routes with /api
//defined routes will be prefixed with ‘/api’
app.use('/api', router);





// -- DB -- //

// application -------------------------------------------------------------
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});



// Create a new route with the prefix /things
var thingsRoute = router.route('/things');

// Create endpoint /api/things for POSTS
thingsRoute.post(function(req, res) {
  // Create a new instance of the Thing model
  var thing = new Thing();

  // Set the properties that came from the POST data
  thing.name = req.body.name;
  console.log(req.body.name);
  thing.type = req.body.type;
  thing.latitude = req.body.latitude;
  thing.longitude = req.body.longitude;
  thing.active = req.body.active;
  thing.battery = req.body.battery;

  // Save the thing and check for errors
  thing.save(function(err){
  if(err)
    console.log(err);
  else
  	console.log("added: ");
    console.log(thing);
    //res.json({ message: 'Success!' })

  });
});




// Create endpoint /api/things for GET
thingsRoute.get(function(req, res) {
  // Use the thing model defined in the beginning to find all things
  Thing.find(function(err, things) {
    if (err)
      res.send(err);

    res.json(things);
  });
});




// Create a new route with the /things/:thing_id prefix for single thing action
var thingRoute = router.route('/things/:thing_id');

// Create endpoint /api/things/:thing_id for DELETE
thingRoute.delete(function(req, res) {
  // Use the Thing model to find a specific thing and remove it
  Thing.findByIdAndRemove(req.params.thing_id, function(err) {
    if (err)
      res.send(err);

    //res.json({ message: 'Removed!' });
  });
});

// Create endpoint /api/things/:_id for PUT
thingRoute.put(function(req, res) {

  //req.body.active = "true";
  // Use the Beer model to find a specific beer
  //console.log(req);
  //req.params.active;
  //console.log(req);

  Thing.findById(req.params.thing_id, function(err, thing) {
  if (!thing)
    return next(new Error('Could not load Document'));
  else {
    console.log(thing);
    // do your updates here
    thing.active = req.body.active;
    console.log(thing);

    thing.save(function(err) {
      if (err)
        console.log('error')
      else
        console.log('Activated: ' + thing.active)
    });
  }
});
    
    // Update the existing thing
  //thing.name = req.body.name;
  //thing.type = req.body.type;
  //thing.latitude = req.body.latitude;
  //thing.longitude = req.body.longitude;
  
   //thing.active = req.params.active;

  
      
      //res.json(thing);
  //   });
  
  //     thing.active = req.params.active;
  //     console.log(thing);

  //  // Save the thing and check for errors
  //   thing.save(function(err) {
  //     if (err)
  //       res.send(err);
  //   });
  });



// where to load static resources, like html files, gif files, css files etc.
app.use(express.static('client'));


// Start the server
app.listen(port);
console.log('Server running on localhost: ' + port);
