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

class Customer {
    get getName() {
        return `${this.name}`;
    }

    set setName(new_name) {
        this.name = new_name;
    }

    get getPhoneNumber() {
        return this.phone_no;
    }

    set setPhoneNumber(new_number) {
        this.phone_no = new_number;
    }

    set setPassword(new_password) {
        this.password = new_password;
    }

    static findByName(searched_name) {
        return this.findOne({searched_name});
    }
}

customerSchema.loadClass(Customer);

module.exports = new mongoose.model('Customer', customerSchema)