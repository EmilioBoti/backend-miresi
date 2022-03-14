require("dotenv").config()

const express = require("express");
const router = require("./router/router")
// const {cloudinaryConfig, uploader } = require("./config/cloudinaryConfig")

const app = express()
const port = 3000

 
//settings 
app.set('port', process.env.PORT || port)

//middlewares
app.use(express.static("public"))
app.use(express.static("assets"))
app.use(express.json())
app.use(express.urlencoded({extended: false}));
// app.use("*", cloudinaryConfig)
app.use('/api', router)


module.exports = app