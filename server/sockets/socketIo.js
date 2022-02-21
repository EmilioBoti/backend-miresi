const { io } = require("../index")
const mysql = require("./dbConnect");


io.on("connection", (socket)=>{
    let idSocket = socket.id
    socket.data.name = "ok"
    let d =  socket.data.name
    const querry = d
    
    console.log(`User has connected: ${idSocket}`)
    console.log(querry)


    mysql.query("", (err, result)=>{

    })
    
    socket.on("user", (data)=>{
        console.log(data)
        const obj = JSON.parse(data)
        dataUser.push(obj)
        io.emit("userConnected", dataUser)
    })
    
    //events happen when a message is send
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
