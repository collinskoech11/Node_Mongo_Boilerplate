const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    author: {
        type: String,
        required: false
    }
})

module.exports = new mongoose.model("Posts", PostSchema)