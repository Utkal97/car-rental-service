class Car {

    getVehicleNumber() {
        return this.vehicle_number
    }

    getLocation() {
        return { latitude : this.latitude, longitude : this.longitude};
    }

    setLocation(new_location) {
        this.latitude = new_location.latitude;
        this.longitude = new_location.longitude;
    }

    setLongitude(new_longitude) {
        console.log("changing longitude");
        this.longitude = new_longitude;
    }

    setLatitude(new_latitude) {
        console.log("changing latitude");
        this.latitude = new_latitude;
    }

    getBookings() {
        return this.bookings;
    }

    async isBooked(at_time) {

        const model = this.constructor;

        let overlapping_booking = await model.aggregate([{
            "$match" : {
                "vehicle_number" : this.vehicle_number,
                "bookings" : {
                    "$elemMatch" : {
                        "$and" : [
                            { start_time : { $lt : at_time } },
                            { end_time : { $gt : at_time } }
                        ]
                    }
                }
            }
        }]);

        //if there had been a booking, the array wouldn't be empty
        if( overlapping_booking.length )
            return true;

        return false;
    }
}

module.exports = Car;