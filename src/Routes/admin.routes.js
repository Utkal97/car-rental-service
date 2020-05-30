const router = require('express').Router();

const admin_controller = require('../Controllers/admin.controller');
const isAuthenticated = require('../Middlewares/isAuthenticated');

router.post('/login', admin_controller.login);

router.post('/add_car', isAuthenticated, admin_controller.addCar);

router.put('/update_car', isAuthenticated, admin_controller.updateCar);

router.delete('/delete_car', isAuthenticated, admin_controller.deleteCar);

module.exports = router;