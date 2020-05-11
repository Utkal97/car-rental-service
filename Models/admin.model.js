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

const Admin = require('./Classes/admin.class');
adminSchema.loadClass(Admin);

module.exports = mongoose.model('Admin', adminSchema, 'admins');