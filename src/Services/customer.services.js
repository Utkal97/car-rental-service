const customer_model = require('../Models/customer.model');
const car_model = require('../Models/car.model');
const car_queries = require('./Queries/car.queries');

class CustomerService {
    async login(credentials) {
        const customer = await customer_model
                                    .findOne({email : credentials.email, password : credentials.password})
                                    .select(` -_id`);

        if(!customer)
            throw { message : "Invalid credentials" };

        const generateKey = require('../Utilities/generateKey');
        const token = generateKey(customer.email);
        return token;
    }

    async showCars(filter) {
        let filtered_cars = [];

        if( filter.hasOwnProperty('seat_capacity') && 
            !filter.hasOwnProperty('at_time') )
        {
            filtered_cars = await car_queries.filterBySeatCapacity(filter.seat_capacity);
        }

        else if( filter.hasOwnProperty('at_time') && 
                !filter.hasOwnProperty('seat_capacity') ) 
        {
            filter.at_time = new Date(filter.at_time);
            filtered_cars = await car_queries.filterByTime(filter.at_time);
        }

        //if filter has to be done on both seat capacity and time for booking
        else {
            filter.at_time = new Date(filter.at_time);
            filtered_cars = await car_queries.filterByTimeAndSeatCapacity(filter);
        }

        return filtered_cars;
    }

    async bookCar(booking_request) {

        if(booking_request.start_time >= booking_request.end_time)
            throw { message : "start time of booking  >= end time of booking" };

        const current_time = new Date();

        if(booking_request.start_time < current_time)
            throw { message : "you can't book cars in past" };

        const date_difference = (booking_request.start_time.getDate() - current_time.getDate()) 
                                + (booking_request.start_time.getMonth() - current_time.getMonth())*30 ;

        const threshold = 60;   //defines the number of days beyond which booking can't be done.


        if(date_difference >= threshold)
            throw { message : "can't book a car beyond 60 days from now"};

        const car = await car_model.findOne({ vehicle_number : booking_request.vehicle_number });

        const customer_id = await customer_model
                                        .findOne({ email : booking_request.email })
                                        .select(`_id`);

        const convert_time = require('../Utilities/addIndianTimeDifference');
        booking_request.start_time = convert_time(new Date(booking_request.start_time));
        booking_request.end_time = convert_time(new Date(booking_request.end_time));

        const booking_data = {
            start_time : booking_request.start_time,
            end_time : booking_request.end_time,
            customer_id : customer_id._doc._id,
            car_id : car._doc._id
        }

        let overlapped_bookings = await car_queries.getOverlappedBookings(vehicle_number, booking_data);

        if( overlapped_bookings.length >= 1)
            throw { message : "Requested slot not available." }

        await car_queries.addBooking(booking_request.vehicle_number, booking_data);
    }

    async getDetails(vehicle_number) {
        const car_details = await car_queries.getCarDetails(vehicle_number)
        return car_details;
    }
}

module.exports = new CustomerService();