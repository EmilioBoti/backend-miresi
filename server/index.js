const express = require("express");
const socket = require("socket.io")
const app = express()

const mysql = require("./dbConnect")

const port = 3000
const hostname = "192.168.1.129"
const hostname2 = app.get('port')

//settings 
app.set('port', process.env.PORT || 3000)

const server = app.listen(port, hostname,()=>{
    console.log(`listenning on port: ${port}`)
})

//connect to DDBB MYSQL
// mysql.connect((error)=>{
//     if(error) throw error
//     else console.log("Connected")
// })

app.get("/", (req, res)=>{
    res.send("hola")
})

//app.use(express.static("public"));
const io = socket(server)
const dataUser = [] 


io.on("connection", (socket)=>{
    let idSocket = socket.id
    console.log(`User has connected: ${idSocket}`)
    
    socket.on("user", (data)=>{
        const obj = JSON.parse(data)
        // let exists = dataUser.some((e) => e.id == idSocket)
        // if(!exists)
        dataUser.push(obj)
        console.log(`${exists}`)
        io.emit("userConnected", dataUser)
    })
    
    //events happen when a message is send
    socket.on("message", (data,sendToUserId,senderId)=>{
        let byWhose = JSON.parse(data)
        let us =  dataUser.find((e)=> e.id === sendToUserId)

        socket.to(sendToUserId).to(senderId).emit("private", byWhose) //emit events to both socket sender and receiver

        console.log(`Sender:`)
        console.log(senderId)
        console.log(`Receiver`)
        console.log(us)
    })

})  

