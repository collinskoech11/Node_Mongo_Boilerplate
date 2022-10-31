const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    phoneNumber:{
        type: String,
        required:false
    },
    Age:{
        type:Number,
        required:false
    },
    country:{
        type: String,
        required:false
    }
})

module.exports = new mongoose.model("Users", UsersSchema)