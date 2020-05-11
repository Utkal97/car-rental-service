const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

const bookingSchema = require('./booking.model').bookingSchema;

const carSchema = new mongoose.Schema({

        vehicle_number : {
            type : String,
            required : true,
            unique : true,
            uppercase : true
        },
        bookings : {
            type : [bookingSchema],
            default : []
        },
        latitude : {
            type : Number,
            required : true
        },
        longitude : {
            type : Number,
            required : true
        },
        model_id : {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Car-Model' 
        }
    }, 
    { versionKey: false }
);

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

        let overlapping_booking = await model.find({
            bookings : {
                $elemMatch : {
                    start_time : { $lt : at_time},
                    end_time : { $gt : at_time}
                }
            }
        });

        if(overlapping_booking.length >= 1 && 
                overlapping_booking.vehicle_number === this.vehicle_number) {
            console.log(overlapping_booking);
            return true;
        }
        return false;
    }

    async addBooking(data) {
        try {
            console.log(`Booking request`);
            console.log(data);

            const model = this.constructor;
            

            let overlap = await model.aggregate([{
                "$match" : {

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
                
                // {
                //     "$project" : {
                //         "booking" : {
                //             "$filter" : {
                //                 "input" : "$booking",
                //                 "as" : "booking",
                //                 "cond" : {
                //                     "$eq" : [ "$$booking.vehicle_number", data.vehicle_number ]
                //                 }
                //             }
                //         }
                //     }
                // }
            }]);

            console.log("Overlapping :");
            console.log(overlap);

            // let overlapping_booking = await model.find({
            //     bookings : {
            //         $elemMatch : {
            //             start_time : { $lt : data.start_time},
            //             end_time : { $gt : data.start_time}
            //         }
            //     }
            // });

            // if(overlapping_booking.length >= 1 && 
            //     overlapping_booking.vehicle_number === this.vehicle_number) {

            //     throw {message : "Start time overlapping with other slot."}
            // }

            // overlapping_booking = await model.find({ 
            //     bookings : {
            //         $elemMatch : {
            //             start_time : { $lt : data.end_time},
            //             end_time : { $gt : data.end_time }
            //         }
            //     }
            // });
            
            // if(overlapping_booking.length >= 1 && 
            //     overlapping_booking.vehicle_number === this.vehicle_number) {

            //     throw {message : "End time overlapping with other slot."}
            // }

            // const update = await model.updateOne({ _id : this._id }, {
            //     $push : { 
            //         bookings : {
            //             $each : [data],
            //             $sort : { start_time : 1 }
            //         }
            //     }
            // });

            return "Success";
        }
        catch(err) {
            console.log(`Error (at instance method \'.addBooking()') : ${err.message}`);
        }
    }
}

carSchema.plugin(beautifyUnique);
carSchema.loadClass(Car);

module.exports = mongoose.model('Car', carSchema);