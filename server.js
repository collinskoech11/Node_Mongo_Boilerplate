const express = require("express");
const mongoose = require("mongoose");
const app = express()
const Users = require("./models/Users")
const usersRouter = require("./Views")

require("dotenv").config()
app.use(express.json())
app.use("/",usersRouter);


mongoose.connect(process.env.MONGO_STRING,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)



app.listen(3000)