const mongoose = require('mongoose');
const isEmail = require('validator').isEmail;

const adminSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        validate : (value) => { return isEmail(value); }
    },
    password : {
        type : String,
        required : true
    }
})

class Admin {
    set setPassword(new_password) {
        this.password = new_password;
    }
}

adminSchema.loadClass(Admin);

module.exports = mongoose.model('Admin', adminSchema, 'admins');