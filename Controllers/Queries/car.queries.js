const car_model = require('../../Models/car.model');

const queries = {

    getAllCars : car_model.find(),
    
    filterBySeatCapacity : async function(seat_capacity) {
                                
                                const result = await car_model
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
                                return result;
                            },

    filterByTime : async function(at_time) {

                        const result = await car_model
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

                        return result;
                    },
    
    filterByTimeAndSeatCapacity : async function(filter) {

                                    const result = await car_model
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

                                    return result;
                                },
    
    getCarDetails : async function(vehicle_number) {
                    const result = await car_model
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
                    return result;
                }
}

module.exports = queries;