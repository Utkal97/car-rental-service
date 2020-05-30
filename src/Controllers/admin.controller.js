const AdminService = require('../Services/admin.services.js');

class AdminController {

    async login(req, res) {

        try {
            const credentials = {
                email : req.body.email,
                password : req.body.password
            };

            const token  = await AdminService.login(credentials);

            if(token)
                res.status(200).json({'auth_token' : token });
        }
        catch(error) {
            res.status(401).end(error.message);
        }
    }

    async addCar(req, res) {

        try {

            const car = req.body;
            console.log(car);

            const new_car = await AdminService.addCar(car);
            res.status(200).send(`Added new car: ${new_car}`);
        }
        catch(error) {
            console.log(`Error : ${error.message}`);
            res.status(400).end(error.message);
        }
    }

    async updateCar(req, res) {
        try {
            const req_data = req.body;

            const vehicle_number = await AdminService.updateCar(req_data);
            res.status(200).send(`Updated details for the car: ${vehicle_number}`);
        }
        catch(error) {
            console.log(`Error : ${error.message}`)
            res.status(400).send(error.message);
        }
    }

    async deleteCar(req, res) {

        try {
            const vehicle_number = req.body.vehicle_number;

            await AdminService.deleteCar(vehicle_number);
            res.status(200).send(`Deleted the car: ${vehicle_number} from service.`);
        }
        catch(error) {
            console.log(`Error : ${error.message}`)
            res.status(400).send(error.message);
        }
    }
}

module.exports = new AdminController();