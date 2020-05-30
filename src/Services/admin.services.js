const admin_model = require('../Models/admin.model');
const car_model = require('../Models/car.model');
const modelCar_model = require('../Models/model_car.model');

const generateKey = require('../Utilities/generateKey.js');

function isValidVehicleNumber(input) {
    const vehicle_number_regex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/i;
    return vehicle_number_regex.test(input);
}

class AdminService {


    async login(credentials) {

        const admin = await admin_model
                                .findOne({ 
                                    email : credentials.email, 
                                    password : credentials.password
                                })
                                .select(` -_id`);

        if(!admin)
            throw { message : "Invalid credentials"};

        const generateKey = require('../Utilities/generateKey');
        const token = generateKey( credentials.email );
        return token;
    }



    async addCar(car) {

        if(!isValidVehicleNumber(car.vehicle_number))
            throw { message : `Not a valid registration number` };

        const model_car = await modelCar_model.findOne({ model : car.model });

        if(!model_car) {

            const modelCar_data = {
                model : car.model,
                mileage : car.mileage,
                rent_per_day : car.rent_per_day,
                seat_capacity : car.seat_capacity
            }

            modelCar_model.create(modelCar_data)
                                .then( document => car.model_id = document._id )
                                .catch( err => console.log(err.message) );
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

        const new_car = await car_model.create(car_data);
        return new_car.vehicle_number;
    }



    async updateCar(car_details) {

        const car = await car_model.findOne({ vehicle_number : car_details.vehicle_number });

        if(!car) 
            throw { message : "No such car with given vehicle number." };

        const convert_time = require('../Utilities/addIndianTimeDifference');
        const current_time = convert_time(new Date());
        const isCurrentlyBooked = await car.isBooked(current_time);

        if(isCurrentlyBooked)
            throw { message : "Currently, the car is booked." };

        if(car_details.hasOwnProperty('latitude'))
            car.setLatitude(car_details.latitude);

        if(car_details.hasOwnProperty('longitude'))
            car.setLongitude(car_details.longitude);

        if(car_details.hasOwnProperty('model_id'))
            throw { message : "You can't change the model of a car" };

        const updated_car = await car.save();
        return updated_car.vehicle_number;
    }



    async deleteCar(vehicle_number) {

        //checking if the car is currently booked
        const car = await car_model.findOne({ vehicle_number : vehicle_number });
            
        if(!car) 
            throw { message : "No such car with given vehicle number." };

        const convert_time = require('../Utilities/addIndianTimeDifference');
        const current_time = convert_time(new Date());
        const isCurrentlyBooked = await car.isBooked(current_time);

        if(isCurrentlyBooked)
            throw { message : "Currently the car is booked." };

        await car_model.deleteOne({ vehicle_number : vehicle_number });
    }
}

module.exports = new AdminService();