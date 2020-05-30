const mongoose = require('mongoose');

const modelCarSchema = new mongoose.Schema({

    model : {
        type : String,
        required : true,
        unique : true
    },
    mileage : {
        type : Number,
        default : 0
    },
    rent_per_day : {
        type : Number,
        required : true
    },
    seat_capacity : {
        type : Number,
        required : true
    },
});

const ModelCar = require('./Classes/model_car.class');
modelCarSchema.loadClass(ModelCar);

module.exports = mongoose.model('Car-Model', modelCarSchema);