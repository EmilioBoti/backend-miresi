const express = require("express");
const socket = require("socket.io")
const router = require("./router/router")
const mysql = require("./dbConnect");
const fs = require("fs")

const app = express()

const port = 3000
const hostname = "192.168.33.105"

const allFileContents = fs.readFileSync('C:/Users/emili/Desktop/MiResiResearch.csv', 'utf-8');

allFileContents.split(/\r?\n/).forEach(line =>  {
    const lineFile = line.split(",")
    console.log(lineFile);
});
const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

//settings 
app.set('port', process.env.PORT || 3000)
const hostname2 = app.get('port')

//middlewares
app.use(express.json())
app.use('/api', router)

const server = app.listen(hostname2,()=>{
    console.log(`listenning on port: ${port}`)
})

const io = socket(server)
const dataUser = [] 

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
