require("dotenv").config()

const app = require("./app")
const socket = require("socket.io")
const hostname2 = app.get('port')

const server = app.listen(hostname2,()=>{
    console.log(`listenning on port: ${hostname2}`)
})

const io = socket(server)
const dataUser = []

io.on("connection", (socket)=>{
    let idSocket = socket.id
    socket.data.name = "Ook"    
    socket.data.last = "Ook2"

    socket.handshake.auth = {
        "name": "emilio"
    }
    
    console.log(`User has connected: ${idSocket}`)

    socket.on("user", (data)=>{
        const obj = JSON.parse(data)
        console.log(obj)
        dataUser.push(obj)

        const query = `UPDATE register SET socketId = '${obj.socketId}' WHERE id = ${obj.id}`
        mysql.query(query, (err, result)=>{
            if(err) throw err
            console.log(result)
        })

        io.emit("userConnected", dataUser)
    })
    
    // //events happen when a message is send
    socket.on("message", (data, userReceiverId, userSenderId) =>{
        let byWhose = JSON.parse(data)
     
        const query = `INSERT INTO chat (id_user_sender, id_user_receiver, message, checked)
        VALUES ('${byWhose.senderIdDb}','${byWhose.receiverIdDb}', '${byWhose.sms}', '${byWhose.checked}')`
    
        mysql.query(query, (err, result)=>{
            if(err) throw err
            io.to(userReceiverId).to(userSenderId).emit("private", byWhose) //emit events to both socket sender and receiver
        })
    })
})

module.exports = io