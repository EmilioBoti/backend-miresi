require("dotenv").config()

const express = require("express");
const router = require("./router/router")
const routerResi = require("./queries/resi/router")
const routerPost = require("./queries/post/router")
const routerProfile = require("./queries/profile/router")
const routerForums = require("./queries/forums/router")

const fs = require("fs")
const mysql = require("./db/dbConnect")

const app = express()
const port = 3000

//settings 
app.set('port', process.env.PORT || port)

//middlewares
app.use(express.static("public"))
app.use(express.static("assets"))
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/api', router)
app.use('/api', routerResi)
app.use('/api', routerPost)
app.use('/api', routerProfile)
app.use('/api', routerForums)


// insetRoom('C:\\Users\\emili\\Desktop\\MiResiResearchRooms.csv')

//'C:\\Users\\emili\\Desktop\\MiResiResearchTypeofRooms.csv'

function insetRoom(path) {
    const allFileContents = fs.readFileSync(path, 'utf-8');
    const lines = allFileContents.split(/\r?\n/)

    for(let i = 5; i < 7; i++){
        const lineArr = lines[i].split(",")

        const query = `INSERT INTO room (name, id_type, price, AC, Calefaccion, Fridge)
        VALUES ('${lineArr[3]}', 3, ${Number(lineArr[5].slice(1))}, ${lineArr[6]}, ${lineArr[7]}, ${lineArr[8]})`
        
        console.log(lineArr)
        console.log(query)
        // mysql.query(query, (err, result)=>{
        //     if(err) throw err
        //     console.log(result)
        // })
    }


}

//not part of the code
function insertRoomType() {
    const allFileContents = fs.readFileSync('C:\\Users\\emili\\Desktop\\MiResiResearchTypeofRooms.csv', 'utf-8');
    const lines = allFileContents.split(/\r?\n/)
    
    for(let i = 1; i < lines.length-1; i++){
        const lineArr = lines[i].split(",")
        const query = `INSERT INTO room_type (type_name, kitchen, shared_bathroom, access_wheelchair, shared_kitchen, shared_room, type)
        VALUES ('${lineArr[0]}',${lineArr[5]},${lineArr[6]},${lineArr[7]},${lineArr[8]},${lineArr[9]},'${lineArr[1]}')`
    
        mysql.query(query, (err, result)=>{
            if(err) throw err
            console.log(result)
        })
    }
}

module.exports = app