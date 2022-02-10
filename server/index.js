const express = require("express");
const socket = require("socket.io")
const encrypt = require("./encrypting")

const app = express()

const mysql = require("./dbConnect")

const port = 3000
const hostname = "192.168.32.244"
const hostname2 = app.get('port')

const objEncrypt =  encrypt.encrypting("holaaaa")

//settings 
app.set('port', process.env.PORT || 3000)

const server = app.listen(port, hostname,()=>{
    console.log(`listenning on port: ${port}`)
    console.log(objEncrypt.content)
    console.log(encrypt.decrypt(objEncrypt))
})

//connect to DDBB MYSQL
mysql.connect((error)=>{
    if(error) throw error
    else console.log("Connected")
})

app.get("/", (req, res)=>{

    mysql.query("Select * from register_users", (err, result)=>{
        if(err) throw err
        console.log(result)
    })
    res.send("hola")
})

//app.use(express.static("public"));
const io = socket(server)
const dataUser = [] 

io.on("connection", (socket)=>{
    let idSocket = socket.id
    // console.log(`User has connected: ${idSocket}`)
    
    socket.on("user", (data)=>{
        const obj = JSON.parse(data)
        // let exists = dataUser.some((e) => e.id == idSocket)
        dataUser.push(obj)
        io.emit("userConnected", dataUser)
    })
    
    //events happen when a message is send
    socket.on("message", (data,sendToUserId,senderId)=>{
        let byWhose = JSON.parse(data)
        // let us =  dataUser.find((e)=> e.id === sendToUserId)
        io.to(sendToUserId).to(senderId).emit("private", byWhose) //emit events to both socket sender and receiver
    })
})  
