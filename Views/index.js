const Router = require("express").Router;
const router = Router();
const Users = require("../models/Users")
const Posts = require('../models/Posts')
const jwt = require('jsonwebtoken')
// const router = express().router()
// require('crypto').randomBytes(64).toString('hex') => gen access token secret 

// let serializeUser;
router.get('/users', async(req, res) =>{
    const currentUsers = await Users.find({})
    res.json(currentUsers)
})
router.post('/users/new', async(req,res, next) => {

    console.log(req.body);
    try{
        const user = {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            Age: req.body.Age,
            country: req.body.country
        }
        const newUser = new Users(user)
        newUser.save()
        .then(() => {
            console.log("Successfully added user")
            // res.redirect("/")
        })
        .catch((err) => console.log(err))
        return res.status(200).json({user: newUser, status: "success"})
    } catch(err){
        console.log(err)

    } 

    return res.status(400).json({message: "Error"})
})
router.post('/users/login', async(req, res) => {
    try{
        const userFind = await Users.findOne({phoneNumber:req.body.phoneNumber})
        if(userFind == null) {
            return res.status(400).send('Cannot find user').json()
        }
        else {
            console.log(userFind)
            try{
                if(req.body.phoneNumber ==  userFind.phoneNumber){
                    const usernameLogged = req.body.name
                    const serializeUser = {nameme: usernameLogged}
                    console.log("data wanted",serializeUser)
                    // res.send('Success')
                    res.json(
                        {
                            message: "Success"
                        }
                    )
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
router.delete('/logout', (req, res) => {
    res.json(
        {
            message:"umetolewa kwa server"
        }
    )// => successfully deleted the token 
})

module.exports = router