const model = require('./Models/car.model');
const database = require('./database.js');

async function find() {
    try {
        data = {
            "vehicle_number" : "AP11AZ5195",
            "start_time" : "2020-05-04T15:00:00",
            "end_time" : "2020-05-09T14:00:00"
        };
        
        console.log(data);

        let overlap = await model.aggregate([{
                "$match" : {
                        "vehicle_number" : data.vehicle_number,
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
        console.log("result :");
        console.log(overlap);
    }
    catch(err) {
        console.log("err");
        console.log(err);
    }
    return;
}

find();


                                                            // .find()
                                                            // .populate({
                                                            //     path : "model_id",
                                                            //     match : {
                                                            //         seat_capacity : filter.seat_capacity
                                                            //     }
                                                            // })
                                                            // .exec(function(err, cars) {
                                                            //     if(err)
                                                            //         throw err;
                                                                
                                                            //     console.log(cars);
                                                            //     console.log("FILTERING");
                                                            //     const result = cars.filter(car => 
                                                            //         car.model_id 
                                                            //     );
                                                            //     return result;
                                                            // });