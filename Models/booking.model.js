const mongoose = require('mongoose');
const customer_model = require('./customer.model');
const car_model = require('./car.model');

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

class Booking {
    getBookingDetails() {
        const customer_details = customer_model
                                    .findOne({ _id : this.customer_id })
                                    .select(`name phone_no`);

        const vehicle_number = car_model
                            .findOne({ _id : this.car_id })
                            .select(`vehicle_number`);

        console.log(`requested booking details from instance method :`);
        console.log(customer_details);
        console.log(vehicle_number);
        console.log(this.start_time);
        console.log(this.end_time);

        return { 
                customer_details : customer_details, 
                vehicle_number : vehicle_number,
                start_time : this.start_time, 
                end_time : this.end_time 
            };
    }

}

bookingSchema.loadClass(Booking);

module.exports.bookingSchema = bookingSchema;

module.exports.bookingModel = mongoose.model('Booking', bookingSchema);
