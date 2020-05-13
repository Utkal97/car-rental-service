const customer_model = require('../customer.model');
const car_model = require('../car.model');

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

module.exports = Booking;