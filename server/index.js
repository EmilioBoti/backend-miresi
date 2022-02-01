const express = require("express");
const socket = require("socket.io")
const app = express()
// var server = require("http").Server(app);

const port = 3000
const hostname = "192.168.1.129"

const server = app.listen(port, hostname,()=>{
    console.log(`listenning on port: ${port}`)
})

const json = {
    "id": 5,
    "name": "Emilio"
}

app.use(express.static("public"));
const io = socket(server)


app.get("/", (req, res)=>{
    res.status(200).send("<h1>Hello World</h1>")
})

io.on("connection", (socket)=>{
    console.log(`User has connected: ${socket.id}`)

    socket.on("message", (data)=>{
        console.log(`data from ${socket.id}: ${data}`)
        io.emit("newMessage", data)
    })
})

