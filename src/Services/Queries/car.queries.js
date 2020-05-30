const car_model = require('../../Models/car.model');

const queries = {

    getAllCars : car_model.find(),
    
    filterBySeatCapacity : async function(seat_capacity) {

        return await car_model
                            .aggregate([
                                { "$lookup" : {
                                        "from" : "car-models",
                                        "localField" : "model_id",
                                        "foreignField" : "_id",
                                        "as" : "model"
                                    }
                                },
                                { "$unwind" : "$model" },
                                { "$match" : { 
                                        "model.seat_capacity" : seat_capacity
                                    }
                                },
                                {
                                    "$project" : {
                                        "_id" : false,
                                        "model._id" : false,
                                        "model_id" : false,
                                        "model.__v" : false,
                                        "bookings._id" : false,
                                        "bookings.car_id" : false,
                                        "bookings.customer_id" : false
                                    }
                                }
                            ]);
    },

    filterByTime : async function(at_time) {

        return await car_model
                            .aggregate([
                                { "$lookup" : {
                                        "from" : "car-models",
                                        "localField" : "model_id",
                                        "foreignField" : "_id",
                                        "as" : "model"
                                    }
                                },
                                { "$unwind" : "$model" },
                                { "$match" : {
                                        "bookings" : {
                                            "$not" : {
                                                "$elemMatch" : {
                                                    "$and" : [
                                                        { "start_time" : { $lt : at_time } },
                                                        { "end_time" : { $gt : at_time } }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    "$project" : {
                                        "_id" : false,
                                        "model._id" : false,
                                        "model.__v" : false,
                                        "model_id" : false,
                                        "bookings._id" : false,
                                        "bookings.car_id" : false,
                                        "bookings.customer_id" : false
                                    }
                                }
                            ]);
    },
    
    filterByTimeAndSeatCapacity : async function(filter) {

        return await car_model
                            .aggregate([ 
                                    { "$lookup" : {
                                            "from" : "car-models",
                                            "localField" : "model_id",
                                            "foreignField" : "_id",
                                            "as" : "model"
                                        }
                                    },
                                    { "$unwind" : "$model" },
                                    { "$match" : {
                                            "bookings" : {
                                                "$not" : {
                                                    "$elemMatch" : {
                                                        "$and" : [
                                                            { "start_time" : { $lt : filter.at_time } },
                                                            { "end_time" : { $gt : filter.at_time } }
                                                        ]
                                                    }
                                                }
                                            },
                                            "model.seat_capacity" : filter.seat_capacity
                                        }
                                    },
                                    {
                                        "$project" : {
                                            "_id" : false,
                                            "model._id" : false,
                                            "model.__v" : false,
                                            "model_id" : false,
                                            "bookings._id" : false,
                                            "bookings.car_id" : false,
                                            "bookings.customer_id" : false
                                        }
                                    }
                                ]);
    },
    
    getCarDetails : async function(vehicle_number) {
        return await car_model
                            .aggregate([ 
                                { "$lookup" : {
                                        "from" : "car-models",
                                        "localField" : "model_id",
                                        "foreignField" : "_id",
                                        "as" : "model"
                                    }
                                },
                                { "$unwind" : "$model" },
                                { "$match" : { vehicle_number : vehicle_number } },
                                {
                                    "$project" : {
                                        "_id" : false,
                                        "model._id" : false,
                                        "model.__v" : false,
                                        "model_id" : false,
                                        "bookings._id" : false,
                                        "bookings.car_id" : false,
                                        "bookings.customer_id" : false
                                    }
                                }
                            ]);
    },

    getOverlappedBookings : async function(vehicle_number, booking_data) {
        return await car_model
                            .aggregate([{
                                "$match" : {
                                    "vehicle_number" : vehicle_number,
                                    "bookings" : {
                                        "$elemMatch" : {
                                            "$or" : [
                                                { 
                                                    "$and" : [
                                                        { start_time : { $lte : booking_data.start_time} },
                                                        { end_time : { $gte : booking_data.start_time } }
                                                    ]
                                                },
                                                { 
                                                    "$and" : [
                                                        { start_time : { $lte : booking_data.end_time} },
                                                        { end_time : { $gte : booking_data.end_time } }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }]);
    },
    
    addBooking : async function(vehicle_number, booking_data) {
        await car_model.updateOne(
            { vehicle_number : vehicle_number }, 
            {
                $push : { 
                    bookings : {
                        $each : [ booking_data ],
                        $sort : { start_time : 1 }
                    }
                }
        });
    }
}

module.exports = queries;