require("dotenv").config()

const app = require("./app")
const socket = require("socket.io")
const hostname2 = app.get('port')
const mysql = require("./db/dbConnect")
const { objt } = require("./db/queries")

const server = app.listen(hostname2,()=>{
    console.log(`listenning on port: ${hostname2}`)
})

const io = socket(server)

io.on("connection", (socket)=> {
    let idSocket = socket.id
    
    console.log(`User has connected: ${idSocket}`)
    
    socket.on("user", (id, socketId)=>{
        objt.updateSockectIt(id, socketId)
    })
    
    //events happen when a message is send
    socket.on("message", async (data) => {
        let message = JSON.parse(data)
        
        if(message.sms != "" ){
            insertMessage(message)
            .then( message =>{
                // console.log(message)
                returnMessage(message.from, message.to, message.sms)
            })
        }
    })
})

const insertMessage = (message) => new Promise((resolve, reject)=> {
    try {
        const query = `INSERT INTO chat (id_u_sender, id_u_receiver, message, date ,checked)
            VALUES ('${message.from}','${message.to}', "${message.sms}", CURRENT_TIMESTAMP(),'${message.check}')`
            
        mysql.query(query, (err, result)=>{        
            if(err) throw err
            resolve(message)
        })
    } catch (error) {
        reject(null)
    }
})

function returnMessage(idSender,idReceiver,message) {
    const query = `SELECT id, name, socketid FROM users WHERE id = ${idSender} OR id = ${idReceiver}`
    let sms = message
    
    mysql.query(query, (err, result) => {
        if(err) throw err
        const fromUser = result.find((elem) => elem.id == idSender)
        const toUser = result.find((elem) => elem.id == idReceiver)
        const message = { 
            userSenderId: fromUser.id,
            userReceiverId: toUser.id,
            fromUser: fromUser.name,
            sms: sms,
            checked: 0
        }
        //emit events to both socket sender and receiver
        io.to(result[1].socketid).to(result[0].socketid).emit("private", JSON.stringify(message))
    })
}

module.exports = io