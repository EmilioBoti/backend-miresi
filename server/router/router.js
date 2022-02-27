const app = require("express")
const mysql = require("../dbConnect");
const encrypt = require("../encrypting")
const path = require("path")
const fs = require("fs")

const router = app.Router()

//get image
router.get("/image", (req, res)=>{
    const pathImg = `${process.cwd()}/server/assets/madrid.jpg`
    getAllImage(`${process.cwd()}\\server\\assets`, pathImg)
    console.log(`path is ${process.cwd()}`)
    return res.sendFile(pathImg)
})

const getAllImage = (pathDir, pathImg)=>{
    const images = []

    const allImg = fs.readdirSync(pathDir)
    allImg.forEach((elem, index)=>{
        let fileLocation = path.join(pathDir, elem)
        images.push(fileLocation)
    })
    console.log(images)
}
//endpoints
router.post('/v1/login', (req, res)=>{

    const client = req.body
    const query = `SELECT * FROM register WHERE email = '${client.email}'`
    
    mysql.query(query, (err, result)=>{
        if(err) throw err

        if(result.length != 0){
            const hash = { "iv": result[0].iv, "content": result[0].password }
            const decryting = encrypt.decrypt(hash)
            if(decryting !== client.password)return res.json({"allow":true ,"id": result[0].id,"name": result[0].name,"email": result[0].email})
        }
        return res.json({ "allow": false, "id": null, "name": null, "email": null })  
    })
})

router.get("/v1/chat/:idSender", (req, res)=>{
    const { idSender } = req.params // it could be req.params.idSender or req.params.idReceiver 
    
    const query = `SELECT DISTINCT chats.id_user_receiver as id, register.name, register.email
    FROM chat as chats INNER JOIN register as reg ON chats.id_user_sender = reg.id
    INNER JOIN register ON chats.id_user_receiver = register.id
    WHERE chats.id_user_sender = ${idSender}`
    
    mysql.query(query, (err, result)=>{
        if(err) throw err
        return res.json(result)
    })
})

router.get("/v1/chat/:idSender/:idReceiver", (req, res)=>{
    const { idSender, idReceiver } = req.params // it could be req.params.idSender or req.params.idReceiver 

    const query = `SELECT chat.id_user_sender as senderIdDb, chat.id_user_receiver as receiverIdDb,register.name as who,chat.message as sms, chat.checked 
        FROM chat INNER JOIN register ON chat.id_user_sender = register.id
        WHERE (id_user_sender = ${idSender} AND id_user_receiver = ${idReceiver})
        or (id_user_sender = ${idReceiver} AND id_user_receiver = ${idSender})`
    
    mysql.query(query, (err, result)=>{
        if(err) throw err
        return res.json(result)
    })
})


router.post("/v1/signup", (req, res)=>{

    const userToRegister = req.body
    const encryptPW = encrypt.encrypting(userToRegister.password) 
    userToRegister.password = encryptPW.content
    
    const query = `INSERT INTO register (name, email, password, iv)
    VALUES ('${userToRegister.name}','${userToRegister.email}', '${userToRegister.password}', '${encryptPW.iv}')`
    
    mysql.query(query, (err, result)=>{
        if(err) throw err
        console.log(result)
    })
    return res.json(userToRegister)
})

router.post("/v1/chat", (req, res)=>{
    const message = req.body

    
    const query = `INSERT INTO chat (id_user_sender, id_user_receiver, message, checked)
    VALUES ('${message.id_sender}','${message.id_receiver}', '${message.message}', '${message.chekced}')`
    
    mysql.query(query, (err, result)=>{
        if(err) throw err
        return res.json(message)
    })
})

module.exports = router