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

    async addBooking(data) {
        try {
            console.log(`Booking request`);
            console.log(data);

            const this_model = this.constructor;
            
            let overlapped_bookings = await this_model.aggregate([{
                "$match" : {
                    "vehicle_number" : this.vehicle_number,
                    "bookings" : {
                        "$elemMatch" : {
                            "$or" : [
                                { 
                                    "$and" : [
                                        { start_time : { $lt : data.start_time} },
                                        { end_time : { $gt : data.start_time } }
                                    ]
                                },
                                { 
                                    "$and" : [
                                        { start_time : { $lt : data.end_time} },
                                        { end_time : { $gt : data.end_time } }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }]);
 
            if( overlapped_bookings.length >= 1 )
                throw {message : "Requested slot not available."}

            const update = await this_model.updateOne({ _id : this._id }, {
                $push : { 
                    bookings : {
                        $each : [ data ],
                        $sort : { start_time : 1 }
                    }
                }
            });

            return "Success";
        }
        catch(err) {
            console.log(`Error (at instance method \'.addBooking()') : ${err.message}`);
            return "Failure";
        }
    }
}

module.exports = Car;