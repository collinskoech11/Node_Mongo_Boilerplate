const Router = require("express").Router;
const router = Router();
const Users = require("../models/Users")
const Posts = require('../models/Posts')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const router = express().router()
// require('crypto').randomBytes(64).toString('hex') => gen access token secret 

// let serializeUser;
router.get('/users', async(req, res) =>{
    const currentUsers = await Users.find({})
    res.json(currentUsers)
})
router.get('/posts',authenticateToken, async(req, res) =>{
    try{
        const currentPosts = await Posts.find({ author: req.user.nameme })// filter articles by current logged in user using access token
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
                    const serializeUser = {nameme: usernameLogged}
                    console.log("data wanted",serializeUser)
                    const accessToken = generateAccessToken(serializeUser)// generate an access token using generateAccessToken Function
                    const refreshToken = jwt.sign(serializeUser, process.env.REFRESH_TOKEN_SECRET)
                    refreshTokens.push(refreshToken)
                    // res.send('Success')
                    res.json(
                        {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
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

let refreshTokens = []// => not a good idea to do this in oroduction since itll be reinitialized each time we refresh

router.post('/token', (req, res) => {// endoint that takes a refresh token and gnerates a new access token 
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, serializeUser) =>{
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: serializeUser.name})
        res.json({ accessToken: accessToken })
    })
    console.log('token found')
})
router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)// => successfully deleted the token 
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
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '35s'})// generate an access token when user logs in and pass in an expiration time 
}

module.exports = router