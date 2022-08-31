const express = require('express')
const mongoose = require('mongoose');
const { use } = require('./routes');


const app = express();

// connection to mongodb cluster 

mongoose.connect("mongodb+srv://collins:allion.com123@cluster0.imelere.mongodb.net/?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)
// middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set("view engine", "ejs")

// import routes

app.use(require("./routes/index"))
app.use(require("./routes/todo"))
//server configs

app.listen(3000, () => console.log("server started on port 3000"))