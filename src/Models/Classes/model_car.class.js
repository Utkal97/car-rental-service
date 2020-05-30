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

module.exports = ModelCar;