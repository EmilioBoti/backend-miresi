const express = require("express");
const socket = require("socket.io")
const encrypt = require("./encrypting")

const app = express()

const mysql = require("./dbConnect");
const { JSON } = require("mysql/lib/protocol/constants/types");
const { stringify } = require("nodemon/lib/utils");
const { query } = require("express");

const port = 3000
const hostname = "192.168.1.129"

// const objEncrypt =  encrypt.encrypting("holaaaa")

//settings 
app.set('port', process.env.PORT || 3000)
const hostname2 = app.get('port')


//middlewares
app.use(express.json())

const server = app.listen(hostname2,()=>{
    console.log(`listenning on port: ${port}`)
})

//connect to DDBB MYSQL
mysql.connect((error)=>{
    if(error) throw error
    else console.log("Connected")
})

//endpoints
app.post("/api/v1/signup", (req, res)=>{

    const userToRegister = req.body
    const encryptPW = encrypt.encrypting(userToRegister.password) 
    userToRegister.password = encryptPW.content
    const query = `INSERT INTO register_user (name, email, password) VALUES ('${userToRegister.name}','${userToRegister.email}', '${userToRegister.password}')`
    
    mysql.query(query, (err, result)=>{
        if(err) throw err
        console.log(result)
    })
    return res.send(userToRegister)
})

app.post("/api/v1/chat", (req, res)=>{
    const message = req.body
    const query = `INSERT INTO chat (id_u_sender, id_u_receiver, message, checked)
    VALUES ('${message.id_sender}','${message.id_receiver}', '${message.message}', '${message.chekced}')`
    
    mysql.query(query, (err, result)=>{
        if(err) throw err
        return res.send(message)
    })
})

app.get("/api/v1/chat/:idSender/:idReceiver", (req, res)=>{
    const { id, id2 } = req.params

    const query = `SELECT * FROM chat WHERE
    (id_u_sender = ${idSender} AND id_u_receiver = ${idReceiver})
     or (id_u_sender = ${idReceiver} AND id_u_receiver = ${idSender}) `
    
    mysql.query(query, (err, result)=>{
        if(err) throw err
        return res.send(result)
    })
})

//app.use(express.static("public"));
const io = socket(server)
const dataUser = [] 

io.on("connection", (socket)=>{
    let idSocket = socket.id
    // console.log(`User has connected: ${idSocket}`)
    
    socket.on("user", (data)=>{
        const obj = JSON.parse(data)
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
