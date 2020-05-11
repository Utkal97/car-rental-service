const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const bookingSchema = require('./booking.model').bookingSchema;

const carSchema = new mongoose.Schema({

        vehicle_number : {
            type : String,
            required : true,
            unique : true,
            uppercase : true
        },
        bookings : {
            type : [bookingSchema],
            default : []
        },
        latitude : {
            type : Number,
            required : true
        },
        longitude : {
            type : Number,
            required : true
        },
        model_id : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Car-Model' 
        }
    }, 
    { versionKey: false }
);

carSchema.plugin(beautifyUnique);

const Car = require('./Classes/car.class');
carSchema.loadClass(Car);

module.exports = mongoose.model('Car', carSchema);