const mongoose = require('mongoose');
const isEmail = require('validator').isEmail;

const customerSchema = new mongoose.Schema({
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            validate : (value) => { return isEmail(value); }
        },
        name : {
            type : String,
            required : true
        },
        phone_no : {
            type : Number,
            required : true
        },
        password : {
            type : String,
            required : true
        }
    }, 
    { versionKey: false }
);

const Customer = require('./Classes/customer.class');
customerSchema.loadClass(Customer);

module.exports = new mongoose.model('Customer', customerSchema)