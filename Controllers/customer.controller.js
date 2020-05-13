const customer_model = require('../Models/customer.model');
const car_model = require('../Models/car.model');
const modelCar_model = require('../Models/model_car.model');

const extractData = require('../Utilities/extractData');

class CustomerController {

    async login(req, res) {

        try {

            const req_email = req.body.email;
            const req_password = req.body.password;
    
            const customer = await customer_model
                                    .findOne({email : req_email, password : req_password})
                                    .select(` -_id`);

            if(!customer)
                throw { message : "Invalid credentials"};

            const generateKey = require('../Utilities/generateKey');
            const token = generateKey(customer.email);

            res.status(200).json({'auth_token' : token });
            res.end();
        }
        catch(error) {
            res.status(401).end(error.message);
        }
    }

    async showCars(req, res) {

        try {
            const filter = req.body;

            const car_queries = require('./Queries/car.queries');

            let filtered_cars;
            if( filter.hasOwnProperty('seat_capacity') && 
                    !filter.hasOwnProperty('at_time') )
            {
                filtered_cars = await car_queries.filterBySeatCapacity(filter.seat_capacity);
                
                res.status(200).send(filtered_cars); 
                return;
            }

            else if( filter.hasOwnProperty('at_time') && 
                    !filter.hasOwnProperty('seat_capacity') ) 
            {
                filter.at_time = new Date(filter.at_time);

                filtered_cars = await car_queries.filterByTime(filter.at_time);

                res.status(200).send(filtered_cars);
                return;
            }

            //if filter has to be done on both seat capacity and time for booking
            else {

                filter.at_time = new Date(filter.at_time);

                filtered_cars = await car_queries.filterByTimeAndSeatCapacity(filter);

                res.status(200).send(filtered_cars);
            }
        }
        catch(err) {
            console.log(err.message);
            res.status(400).send(err.message);
        }
    }

    async bookCar(req, res) {
        try {

            let start_time = new Date(req.body.start_time);
            let end_time = new Date(req.body.end_time);

            if(start_time >= end_time)
                throw { message : "start time of booking  >= end time of booking" };

            const date_now = new Date();

            const date_difference = (start_time.getDate() - date_now.getDate()) 
                                    + (start_time.getMonth() - date_now.getMonth())*30 ;

            if(date_difference >= 60)
                throw { message : "can't book a car beyond 60 days from now"};

            const vehicle_number = req.body.vehicle_number;
            const car = await car_model.findOne({ vehicle_number : vehicle_number });
            
            const email = extractData(req.headers.auth_token);
            const customer_id = await customer_model
                                        .findOne({ email : email })
                                        .select(`_id`);

            const convert_time = require('../Utilities/addIndianTimeDifference');
            start_time = convert_time(new Date(req.body.start_time));
            end_time = convert_time(new Date(req.body.end_time));

            const booking_data = {
                start_time : start_time,
                end_time : end_time,
                customer_id : customer_id._doc._id,
                car_id : car._doc._id
            }

            //addBooking is instance method of car schema (check "car.model.js")
            const booking = await car.addBooking(booking_data);

            if(booking === "Success")
                res.status(200).send("Booking complete");
            else
                throw { message : "Couldn't book the car. Slot not available" };
        }
        catch(err) {
            res.status(400).send(err.message);
        }
    }

    async getDetails(req, res) {

        try {
            const vehicle_number = req.body.vehicle_number;

            const car_details = await car_model
                                        .findOne({ vehicle_number : vehicle_number})
                                        .select(`-_id`);

            const car_model_details = await modelCar_model
                                        .findOne({ _id : car_details.model_id})
                                        .select(`-_id`);
            
            if(car_details && car_model_details) {

                //"model_id" of car lies in "__doc" property
                delete car_details._doc.model_id;

                console.log(car_details.getLocation());

                res.status(200).send({car_details : car_details, car_model_details : car_model_details});
            }
            else
                throw { message : "Couldn't find details of required car" };
    
        }
        catch(err) {
            console.log(`Error occured : ${err.message}`);
            res.status(404).send(err.message);
        }
    }
}

module.exports = new CustomerController();