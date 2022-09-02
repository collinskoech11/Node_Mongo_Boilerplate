const Router = require("express").Router;
const router = Router();
const Users = require("../models/Users")
const Posts = require('../models/Posts')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const router = express().router()
// require('crypto').randomBytes(64).toString('hex') => gen access token secret 

let serializeUser;
router.get('/users', async(req, res) =>{
    const currentUsers = await Users.find({})
    res.json(currentUsers)
})
router.get('/posts',authenticateToken, async(req, res) =>{
    try{
        const currentPosts = await Posts.find({ author: req.user.nameme })
        res.json(currentPosts)
    } catch(err){
        console.log(err, "err=====")
        res.json("err++++++", err)
    }
    
})
router.post('/users/new', async(req,res) => {
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
router.post('/Post/new', async(req, res) => {
    try{
        const post = {
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        }
        const newPost = new Posts(post)
        newPost.save()
        .then(() => {
            console.log("Post created", newPost)
            res.json(newPost)
        })
        .catch((err) => {
            console.log(err)
        })
    } catch(err){
        console.log(err)
    }
})
router.post('/users/login', async(req, res) => {
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
                    const usernameLogged = req.body.name
                    serializeUser = {nameme: usernameLogged}
                    console.log("data wanted",serializeUser)
                    const accessToken = jwt.sign(serializeUser, process.env.ACCESS_TOKEN_SECRET)
                    // res.send('Success')
                    res.json(
                        {
                            accessToken: accessToken,
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

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token  = authHeader && authHeader.split(' ')[1]
    if(token ==null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, serializeUser) => {
        if(err) return res.sendStatus(403)
        req.user = serializeUser
        next() // move out of the middleware
    })
    // Bearer TOKEN
}

module.exports = router