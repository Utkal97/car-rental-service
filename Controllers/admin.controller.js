const admin_model = require('../Models/admin.model');
const car_model = require('../Models/car.model');
const modelCar_model = require('../Models/model_car.model');

const jwt = require('jsonwebtoken');

const secret_key = process.env.SECRET_KEY || "custom secret key";
const jwt_headers = {
                        algorithm : 'HS256',
                        expiresIn : 123459876
                    }

function isValidVehicleNumber(input) {
    return input.match(/[a-zA-Z][a-zA-Z]\d\d[a-zA-Z][a-zA-Z]\d\d\d\d/i);
}

class AdminController {

    async login(req, res) {

        const req_email = req.body.email;
        const req_password = req.body.password;

        try {
            const admin = await admin_model
                                    .findOne({email : req_email, password : req_password})
                                    .select(` -_id`);

            if(!admin)
                throw { message : "Invalid credentials"};

            const token = jwt.sign({
                                    email : admin.email,
                                },
                                secret_key,
                                jwt_headers
                            );

            res.status(200).json({'auth_token' : token });
            res.end();
        }
        catch(error) {
            res.status(401).end(error.message);
        }
    }

    async addCar(req, res) {

        try {

            const car = req.body;
            console.log(car);

            if(!isValidVehicleNumber(car.vehicle_number))
                throw { message : `Not a valid registration number` };

            car.model_id = "";

            const model_car = await modelCar_model.findOne({ model : car.model });
            console.log(model_car);
            
            if(!model_car) {

                const modelCar_data = {
                    model : car.model,
                    seat_capacity : car.seat_capacity,
                    mileage : car.mileage,
                    rent_per_day : car.rent_per_day,
                }

                modelCar_model.create(modelCar_data)
                    .then((document) => { 
                        res.status(200).send(`added a new model ${car.model}`);
                        car.model_id = document._id;
                    })
                    .catch(err => { throw err.message});
            }
            else
                car.model_id = model_car._id;

            const car_data = {
                vehicle_number : car.vehicle_number,
                latitude : car.latitude,
                longitude : car.longitude,
                bookings : [],
                model_id : car.model_id
            };

            car_model.create(car_data)
                .then(() => res.send(`added ${car.vehicle_number} to the service.`))
                .catch(err => { res.status(400).send(`couldn't add ${car.vehicle_number} to service.`) });
        }
        catch(error) {
            console.log(`Error : ${error.message}`);
            res.status(400).end(error.message);
        }
    }

    async updateCar(req, res) {
        try {
            const vehicle_number = req.body.vehicle_number;
            const request_data = req.body;

            const car = await car_model.findOne({ vehicle_number : vehicle_number });
            
            if(!car) 
                throw { message : "No such car with given vehicle number." };

            const convert_time = require('../Utilities/addIndianTimeDifference');
            const current_time = convert_time(new Date());
            const isCurrentlyBooked = await car.isBooked(current_time);

            if(isCurrentlyBooked)
                throw { message : "Currently the car is booked." };

            if(request_data.hasOwnProperty('latitude'))
                car.setLatitude(request_data.latitude);

            if(request_data.hasOwnProperty('longitude'))
                car.setLongitude(request_data.longitude);
            
            if(request_data.hasOwnProperty('model_id'))
                throw { message : "You can't change the model of a car" };
            
            car.save()
                .then( () => res.status(200).send("Updated car successfully"))
                .catch(err => console.log(err.message));
        }
        catch(err) {
            res.status(400).send(err.message);
        }
    }

    async deleteCar(req, res) {

        try {
            const vehicle_number = req.body.vehicle_number;

            //For checking if the car is currently booked
            const car = await car_model.findOne({ vehicle_number : vehicle_number });
            
            if(!car) 
                throw { message : "No such car with given vehicle number." };

            const convert_time = require('../Utilities/addIndianTimeDifference');
            const current_time = convert_time(new Date());
            const isCurrentlyBooked = await car.isBooked(current_time);

            if(isCurrentlyBooked)
                throw { message : "Currently the car is booked." };

            
            car_model.deleteOne({ vehicle_number : vehicle_number })
                .then( () => res.status(200).send(`Deleted ${vehicle_number} successfully`))
                .catch( err => { res.status(400).send(err.message);});
        }
        catch(err) {
            res.status(400).send(err.message);
        }
    }
}

module.exports = new AdminController();