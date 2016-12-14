var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var casualtySchema = new Schema({
	name: {type:String,required:true},
	rank: String,
	branch: String,
	age: Number,
	homeState: String,
	homeCity: String,
	homeGeometry: {
		homeLon: Number,
		homeLat: Number
	},
	unit: String,
	stationedState: String,
	stationedCity: String,
	stationedGeometry: {
		stationedLon: Number,
		stationedLat: Number
	},
	dateOfDeath: Date,
	causeOfDeath: String,
	cityOfDeath: String,
	countryOfDeath: String,
	deathCoordinates: {
		homeLon: Number,
		homeLat: Number
	},
	awards: Array,
	family: String,
	bio: String,
	quotes: Array,
	photo: String,
	conflict: String
})

// export 'Animal' model so we can interact with it in other files
module.exports = mongoose.model('Casualty',casualtySchema);