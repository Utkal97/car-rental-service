const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
        start_time : {
            type : Date,
            required : true,
            tz : 'Asia/Calcutta'
        },
        end_time : {
            type : Date,
            required : true,
            tz : 'Asia/Calcutta'
        },
        customer_id : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Customer' 
        },
        car_id : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Car'
        }
    },
    { versionKey: false }
);

const Booking = require('./Classes/booking.class');
bookingSchema.loadClass(Booking);

module.exports.bookingSchema = bookingSchema;

module.exports.bookingModel = mongoose.model('Booking', bookingSchema);
