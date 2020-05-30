const extractData = require('../Utilities/extractData');

const isAuthenticated = async function(req, res, next) {

    try {

        const user_data = extractData(req.headers.auth_token);

        if(req.baseUrl == "/api/admin") {
 
            const admin_model = require('../Models/admin.model');

            const admin = await admin_model.findOne({email : user_data});

            if(admin)
                return next();
            else
                throw { message : "Administrator not authenticated"};
            
        }
        else if(req.baseUrl == "/api/customer") {

            const customer_model = require('../Models/customer.model');

            const customer = await customer_model.findOne({email : user_data});

            if(customer)
                return next();
            else
                throw { message : "Customer not authenticated."};
        }
    }
    catch(error) {
        console.log(`Error : ${error.message}`);
        res.status(401).send(`Not authenticated.`);
    }
}

module.exports = isAuthenticated;