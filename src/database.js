let mongoose = require('mongoose');

class Database {

    constructor() {
        mongoose.set('useUnifiedTopology', true );
        this._connect();
    }
    
    _connect() {
        const user = process.env.DB_USERNAME;
        const user_password = process.env.DB_PASSWORD;
        const database = process.env.DB_NAME;
        
        const uri = `mongodb+srv://${user}:${user_password}@car-rental-service-ecvzz.gcp.mongodb.net/${database}?retryWrites=true&w=majority`
        
        mongoose.connect(uri, {useNewUrlParser : true, useCreateIndex : true })
            .then(() => console.log('Database connection successful') )
            .catch(err => console.error(`Database Connection Error : ${err.message}`) );
    }
}

module.exports = new Database();