const CustomerService = require('../Services/customer.services.js');

const extractData = require('../Utilities/extractData');

class CustomerController {

    async login(req, res) {

        try {

            const credentials = {
                email : req.body.email,
                password : req.body.password
            }

            const token = await CustomerService.login(credentials);
            res.status(200).json({'auth_token' : token });
        }
        catch(error) {
            console.log(`Error : ${error.message}`);
            res.status(401).end(error.message);
        }
    }



    async showCars(req, res) {

        try {
            const filter = req.body;

            const filtered_cars = await CustomerService.showCars(filter);
            res.status(200).send(filtered_cars);
        }
        catch(err) {
            console.log(`Error : ${err.message}`);
            res.status(400).send(err.message);
        }
    }



    async bookCar(req, res) {
        try {

            let start_time = new Date(req.body.start_time);
            let end_time = new Date(req.body.end_time);

            const email = extractData(req.headers.auth_token);
        
            const booking_request = {
                start_time : start_time,
                end_time : end_time,
                vehicle_number : req.body.vehicle_number,
                email : email
            }

            await CustomerService.bookCar(booking_request);

            res.status(200).send("Booking complete");
        }
        catch(error) {
            console.log(`Error : ${error.message}`);
            res.status(400).send(error.message);
        }
    }



    async getDetails(req, res) {

        try {
            const vehicle_number = req.body.vehicle_number;

            const car_details = await CustomerService.getDetails(vehicle_number);

            res.status(200).send(car_details);
        }
        catch(err) {
            console.log(`Error occured : ${err.message}`);
            res.status(404).send(err.message);
        }
    }
}

module.exports = new CustomerController();