require("dotenv").config()

const app = require("./app")
const socket = require("socket.io")
const hostname2 = app.get('port')
const mysql = require("./db/dbConnect")
const Queries = require("./db/queries")

const server = app.listen(hostname2,()=>{
    console.log(`listenning on port: ${hostname2}`)
})

const io = socket(server)

io.on("connection", (socket)=> {
    let idSocket = socket.id
    
    console.log(`User has connected: ${idSocket}`)

    socket.on("user", (id, socketId)=>{

        try {
       
            const query = `UPDATE users SET socketId = '${socketId}' WHERE id = ${id}`
            mysql.query(query, (err, result)=>{
                if(err) throw err
                console.log(result)
            })    
        } catch (error) {
            console.error(error)
        }
    })
    
    // //events happen when a message is send
    socket.on("message", (data) => {
        let message = JSON.parse(data)
        console.log(message)

        const query = `INSERT INTO chat (id_u_sender, id_u_receiver, message, checked)
        VALUES ('${message.from}','${message.to}', "${message.sms}", '${message.check}')`
        
        mysql.query(query, (err, result)=>{
            if(err) throw err
                returnMessage(message.from, message.to, message.sms)
        })

    })
})

function returnMessage(idSender,idReceiver,message){

    const query = `SELECT id, name, socketid FROM users WHERE id = ${idSender} OR id = ${idReceiver}`
    let sms = message
    mysql.query(query, (err, result)=>{
        if(err) throw err
        
        console.log(result)
        const message = { 
            userSenderId: result[0].id,
            userReceiverId: result[1].id,
            fromUser: result[0].name,
            sms: sms,
            checked: 0
        }
        io.to(result[1].socketid).to(result[0].socketid).emit("private", JSON.stringify(message)) //emit events to both socket sender and receiver
    })

}

module.exports = io