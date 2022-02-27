const socket = require("socket.io")
const server = require("../index")

const io = socket(server)
const dataUser = [] 

io.on("connection", (socket)=>{
    let idSocket = socket.id
    socket.data.name = "ok"
    let d =  socket.data.name
    const querry = d
    
    console.log(`User has connected: ${idSocket}`)

})
module.exports = io