const express = require("express");
const mongoose = require("mongoose");
const app = express()
const Users = require("./models/Users")
const usersRouter = require("./Views")
const cors = require('cors')

require("dotenv").config()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:  true}))
app.use("/",usersRouter);


mongoose.connect(process.env.MONGO_STRING,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)



app.listen(4000)