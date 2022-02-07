const express = require("express");
const socket = require("socket.io")
const app = express()

const port = 3000
const hostname = "192.168.33.99"

//settings 
app.set('port', process.env.PORT || 3000)

const hostname2 = app.get('port')

const server = app.listen(port, hostname,()=>{
    console.log(`listenning on port: ${port}`)
})

//app.use(express.static("public"));
const io = socket(server)
const dataUser = [] 


io.on("connection", (socket)=>{
    console.log(`User has connected: ${socket.id}`)
    socket.on("user", (data)=>{
        const obj = JSON.parse(data)
        let exists = dataUser.some((e) => e.id == socket.id)
        if(!exists) dataUser.push(obj)      
        console.log(`${exists}`)
        io.emit("userConnected", dataUser)
    })
    
    socket.on("boxMessage", (socketId)=>{
        //socket.join(socketId)
        //console.log(socket.rooms)
        socket.on("message", (data, userId)=>{
            let us =  dataUser.find((e)=>{
                if(e.id === userId){
                    return e.id
                }
            })   
            socket.to(socketId).emit("private", data)
            console.log(us)
        })
    })

})  

