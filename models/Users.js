const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    phoneNumber:{
        type: String,
        required:true
    },
    Age:{
        type:Number,
        required:true
    },
    country:{
        type: String,
        required:true
    }
})

module.exports = new mongoose.model("Users", UsersSchema)