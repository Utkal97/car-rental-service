const router = require('express').Router();

const customer_controller = require('../Controllers/customer.controller');
const isAuthenticated = require('../Utilities/isAuthenticated');

router.post('/login', customer_controller.login);
    
router.get('/show_cars', customer_controller.showCars);
    
router.post('/book_car', isAuthenticated, customer_controller.bookCar);
    
router.get('/car_details', customer_controller.getDetails);

module.exports = router;