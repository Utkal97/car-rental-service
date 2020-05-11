let mongoose = require('mongoose');

class Database {

    constructor() {
        mongoose.set('useUnifiedTopology', true );
        this._connect();
    }
    
    _connect() {
        const user = "utkal";
        const user_password = "1234";
        const database = "car-rental-service";
        
        const uri = `mongodb+srv://${user}:${user_password}@car-rental-service-ecvzz.gcp.mongodb.net/${database}?retryWrites=true&w=majority`
        mongoose.connect(uri, {useNewUrlParser : true, useCreateIndex : true })
        .then(() => {
            console.log('Database connection successful');
        })
        .catch(err => {
            console.error(`Database Connection Error : ${err.message}`);
        });
    }
}

module.exports = new Database();