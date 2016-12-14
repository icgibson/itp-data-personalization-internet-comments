var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geocoder = require('geocoder');

// our db model
var Casualty = require("../models/model.js");

var geocodeKey = process.env.GOOGLE_GEOCODER_KEY;

// simple route to render am HTML form that can POST data to our server
// NOTE that this is not a standard API route, and is really for testing
router.get('/create-casualty', function(req,res){
  res.render('pet-form.html')
})

// simple route to render an HTML page that pulls data from our server and displays it on a page
// NOTE that this is not a standard API route, and is really for testing
router.get('/the-volunteers', function(req,res){
  res.render('show-casualties.html')
})

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {
  
  var jsonData = {
  	'name': 'node-express-api-boilerplate',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});

// simple route to show an HTML page
router.get('/sample-page', function(req,res){
  res.render('sample.html')
})

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new animal, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/create', function(req, res){

    //console.log(req.body);

    // pull out the information from the req.body
    var name = req.body.name;
    var rank = req.body.rank;
    var branch = req.body.branch; // split string into array
    var age = req.body.age;
    var homeCity = req.body.homeCity;
    var homeState = req.body.homeState;
    var homeString = String(homeCity +', ' +homeState);

    geocoder.geocode(homeString, function ( err, data ) {
      homeGeometry = [
        data.results[0].geometry.location.lng,
        data.results[0].geometry.location.lat
      ]
    }, geocodeKey);

    var unit = req.body.unit;
    var stationedCity = req.body.stationedCity;
    var stationedState = req.body.stationedState;
    var stationedString = String(stationedCity +', ' +stationedState);

    geocoder.geocode(stationedString, function ( err, data ) {
      stationedGeometry = [
        data.results[0].geometry.location.lng,
        data.results[0].geometry.location.lat
      ]
    }, geocodeKey);

    var causeOfDeath = req.body.causeofDeath;
    var dateOfDeath = req.body.dateOfDeath;
    var cityOfDeath = req.body.cityOfDeath;
    var countryOfDeath = req.body.countryOfDeath;
    var deathString = String(cityOfDeath +', ' +countryOfDeath);

    geocoder.geocode(deathString, function ( err, data ) {
      deathGeometry = [
        data.results[0].geometry.location.lng,
        data.results[0].geometry.location.lat
      ]
    }, geocodeKey);

    var awards = req.body.awards.split('~');
    var family = req.body.family;
    var bio = req.body.bio;
    var quotes = req.body.quotes.split('~');
    var conflict = req.body.conflict;
    var photo = req.body.photo;

    var casualtyObj = {};

    // hold all this data in an object
    // this object should be structured the same way as your db model
    setTimeout(function() {
      casualtyObj = {
        name: name,
        rank: rank,
        branch: branch,
        age: age,
        homeState: homeState,
        homeCity: homeCity,
        homeGeometry: {
          homeLon: homeGeometry[0],
          homeLat: homeGeometry[1]
        },
        unit: unit,
        stationedState: stationedState,
        stationedCity: stationedCity,
        stationedGeometry: {
          stationedLon: stationedGeometry[0],
          stationedLat: stationedGeometry[1]
        },
        dateOfDeath: dateOfDeath,
        causeOfDeath: causeOfDeath,
        cityOfDeath: cityOfDeath,
        countryOfDeath: countryOfDeath,
        deathCoordinates: {
          homeLon: deathGeometry[0],
          homeLat: deathGeometry[1]
        },
        awards: awards,
        family: family,
        bio: bio,
        quotes: quotes,
        photo: photo,
        conflict: conflict
      };

      var casualty = new Casualty(casualtyObj);

      console.log(casualty);

      casualty.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving animal'};
        return res.json(error);
      }

      console.log('saved a new animal!');
      console.log(data);

      // now return the json data of the new animal
      var jsonData = {
        status: 'OK',
        animal: data
      }

      return res.json(jsonData);

    }) 


    },1000);

    // create a new animal model instance, passing in the object
    

    // now, save that animal instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save     
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the animal to get
//  * @param  {String} req.params.id - The animalId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Animal.findById(requestedId, function(err,data){

    // if err or no user found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that animal'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the animal
    var jsonData = {
      status: 'OK',
      animal: data
    }

    return res.json(jsonData);
  
  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all animal details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Casualty.find(function(err, data){
    // if err or no casualties found, respond with error 
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find casualties'};
      return res.json(error);
    }

    // otherwise, respond with the data 

    var jsonData = {
      status: 'OK',
      casualties: data
    } 

    res.json(jsonData);

  })

})

// /**
//  * GET '/api/search'
//  * Receives a GET request to search an animal
//  * @return {Object} JSON
//  */
router.get('/api/search', function(req,res){

  // first use req.query to pull out the search query
  var searchTerm = req.query.name;
  console.log("we are searching for " + searchTerm);

  // let's find that animal
  Animal.find({name: searchTerm}, function(err,data){
    // if err, respond with error 
    if(err){
      var error = {status:'ERROR', message: 'Something went wrong'};
      return res.json(error);
    }

    //if no animals, respond with no animals message
    if(data==null || data.length==0){
      var message = {status:'NO RESULTS', message: 'We couldn\'t find any results'};
      return res.json(message);      
    }

    // otherwise, respond with the data 

    var jsonData = {
      status: 'OK',
      animals: data
    } 

    res.json(jsonData);        
  })

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the animal to update, updates db, responds back
//  * @param  {String} req.params.id - The animalId to update
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.params.id;

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var name, age, weight, color, url; 

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.name) {
      name = req.body.name;
      // add to object that holds updated data
      dataToUpdate['name'] = name;
    }
    if(req.body.age) {
      age = req.body.age;
      // add to object that holds updated data
      dataToUpdate['age'] = age;
    }
    if(req.body.weight) {
      weight = req.body.weight;
      // add to object that holds updated data
      dataToUpdate['description'] = {};
      dataToUpdate['description']['weight'] = weight;
    }
    if(req.body.color) {
      color = req.body.color;
      // add to object that holds updated data
      if(!dataToUpdate['description']) dataToUpdate['description'] = {};
      dataToUpdate['description']['color'] = color;
    }
    if(req.body.url) {
      url = req.body.url;
      // add to object that holds updated data
      dataToUpdate['url'] = url;
    }

    var tags = []; // blank array to hold tags
    if(req.body.tags){
      tags = req.body.tags.split(","); // split string into array
      // add to object that holds updated data
      dataToUpdate['tags'] = tags;
    }


    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that animal
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
    Animal.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error updating animal'};
        return res.json(error);
      }

      console.log('updated the animal!');
      console.log(data);

      // now return the json data of the new person
      var jsonData = {
        status: 'OK',
        animal: data
      }

      return res.json(jsonData);

    })

})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the animal to delete
 * @param  {String} req.params.id - The animalId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.params.id;

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Animal.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that animal to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

module.exports = router;