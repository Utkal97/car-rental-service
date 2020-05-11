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

class ModelCar {

    getModel() {
        return this.model.toUpper();
    }

    getMileage() {
        return this.mileage;
    }

    setMileage(new_mileage) {
        this.mileage = new_mileage
    }

    getSeatCapacity() {
        return this.seat_capacity;
    }

    getRentPerDay() {
        return this.rent_per_day;
    }

    setRentPerDay(new_rent) {
        this.rent_per_day = new_rent;
    }
}

modelCarSchema.loadClass(ModelCar);

module.exports = mongoose.model('Car-Model', modelCarSchema);