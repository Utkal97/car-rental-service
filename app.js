const express = require('express');
const database = require('./database.js');

const admin_routes = require('./Routes/admin.routes');
const customer_routes = require('./Routes/customer.routes');

try {

    const app = express();
    
    app.use(express.json());

    app.use('/api/admin', admin_routes);
    app.use('/api/customer', customer_routes);
    
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Service is up and is running on port : ${PORT}.`);
    });
}
catch(err) {
    console.log(`Error : ${err.message}`);
}