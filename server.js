const express = require("express");
const mongoose = require("mongoose");
const Users = require("./models/Users")
const bcrypt = require('bcrypt')
require("dotenv").config()
const app = express()
app.use(express.json())


mongoose.connect(process.env.MONGO_STRING,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}
)

app.get('/users', async(req, res) =>{
    const currentUsers = await Users.find({})
    res.json(currentUsers)
})
app.post('/users/new', async(req,res) => {
    try{
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }
        const newUser = new Users(user)
        newUser.save()
        .then(() => {
            console.log("Successfully added user")
            // res.redirect("/")
        })
        .catch((err) => console.log(err))
        res.json(newUser)
    } catch(err){
        console.log(err)
    } 
})
app.post('/users/login', async(req, res) => {
    try{
        const userFind = await Users.findOne({name:req.body.name})
        if(userFind == null) {
            return res.status(400).send('Cannot find user').json()
        }
        else {
            console.log(userFind)
            // res.json(userFind)
            try{
                if(await bcrypt.compare(req.body.password, userFind.password)){
                    res.send('Success')
                } else {
                    res.send('Authentication denied')
                }
            } catch(err){
                console.log(err)
            }
        }
    } catch(err){
        console.log(error)
    }
   
})

app.listen(3000)