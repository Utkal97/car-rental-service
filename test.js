const car_model = require('./Models/car.model');
const database = require('./database.js');

async function find() {
    try {
        data = {
            "vehicle_number" : "AP11AZ5195",
            "start_time" : "2020-05-04T15:00:00",
            "end_time" : "2020-05-09T14:00:00"
        };
        

        let overlap = await car_model.aggregate([{
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
        }]);
        console.log("result :");
        console.log(overlap);
    }
    catch(err) {
        console.log("err");
        console.log(err);
    }
}

find();