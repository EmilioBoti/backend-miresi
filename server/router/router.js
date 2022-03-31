const app = require("express")
const mysql = require("../db/dbConnect");
const encrypt = require("../encrypting")
const { objt } = require("../db/queries")

const router = app.Router()


//get a particular resi
router.get('/v1/resi/:id', (req, res)=>{
    const { id } = req.params

    objt.getSingleResi(id)
    .then( data => res.json(data))
    .catch( err => err.message)
    
})


//get rooms from a particular resi
router.get('/v1/resirooms/:idresi', (req, res)=>{
    const { idresi } = req.params
    
    objt.getResiRooms(idresi)
    .then( result => res.json(result))
    .catch(err => err.message)
   
})


router.get('/v1/residences/:city', (req, res)=>{

    try {
        const { city } = req.params
        const query = `SELECT residence.id, residence.name AS resiName, residence.location,residence.phone_number,
        residence.description,residence.email, residence.link, residence.library, residence.laundry, residence.gym,
        residence.parking_bicycle, residence.parking_car,residence.parking_motorcycle, residence.id_city,
        picturesresidence.image, stackfavourite.id_residence as idResiFavorite, stackfavourite.id_user as idUser,
        MIN(room.price) as priceFrom 
        FROM residence INNER JOIN city ON residence.id_city = city.id
        LEFT JOIN stackfavourite ON stackfavourite.id_residence = residence.id
        LEFT JOIN picturesresidence ON picturesresidence.id_residence = residence.id
        LEFT JOIN room ON room.id_resi = residence.id
        WHERE city.name = '${city}'
        GROUP BY resiName`

        mysql.query(query, (err, result)=>{
            if(err) throw err
            return res.json(result)
        })
    } catch (err) {
        return res.json(null)
    }

})

router.get('/city/c/:search', (req, res)=>{
    const { search } = req.params
    
    const searching = (search)=> new Promise((resolve, reject)=>{
        try {
            const query = `SELECT * FROM city WHERE name LIKE '${search}%'`
    
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })
        } catch (err) {
            reject(null)
        }
    })
    searching(search).then(data => res.json(data))
    .catch(err => err.message)

})

router.get('/v1/city/:id', (req, res)=>{

    const { id } = req.params
    const query = `SELECT * FROM city WHERE id = ${id}`

    try {
        mysql.query(query, (err, result)=>{
            if(err) throw err
            return res.json(result)
        })
    } catch (err) {
        return res.json(null)
    }

})
//ENDPOINTS
router.get('/v1/cities', (req, res)=>{

    const query =  `SELECT * FROM city`
    try{
        mysql.query(query, (err, result)=>{
            if(err) throw err
            return res.json(result)
        })
    }catch(err){
        console.err(err)
    }
    
})

router.get('/v1/user/:id/:soId', (req, res)=>{
    const {id, soId } = req.params
    const query =  `UPDATE users SET socketid = '${soId}' WHERE id = ${id}`

    try{
        mysql.query(query, (err, result)=>{
            if(err) throw err
            return res.json(result)
        })
    }catch(err){
        console.error(err)
    }    
})

// //get users chats
// router.get('/v1/users/:from/:to', (req, res)=>{
//     const { from, to } = req.params

//     // objt.getChatMessage(from, to)
//     // .then( data => res.json(data))
//     // .catch(err => err.message)
// })

//get a single user
router.get('/v1/user/:id', (req, res)=>{
    const id = req.params.id

    objt.getSingleUser(id)
    .then(data => res.json(data))
    .catch(err => err.message)
})

router.post('/v1/login', (req, res)=> {

    const user = req.body
    const query = `SELECT * FROM users WHERE email = '${user.email}'`

    try{
        mysql.query(query, (err, result)=>{
            if(err) throw err
            
            if(result.length != 0){
                const hash = { "iv": result[0].iv, "content": result[0].code_pass }
                const decryting = encrypt.decrypt(hash)

                if(decryting !== user.code_pass){
                    console.log(result)
                    return res.json({"allow":true ,"id": result[0].id,"name": result[0].name,"email": result[0].email, "socketId": result[0].socketid})
                } 
            }
            return res.json(null)  
        })
    }catch(err){
        console.error(err)
    }
})

//not in use
//get all cities
router.get("/v1/cities", (req, res)=>{    
    const query = `SELECT * FROM city`
    mysql.query(query, (err, result)=>{
        if(err) throw err
        return res.json(result)
    })
})

// router.get("/v1/chat/:idSender", (req, res)=>{
//     const { idSender } = req.params // it could be req.params.idSender or req.params.idReceiver 
    
//     const query = `SELECT DISTINCT chats.id_u_receiver as id, users.name, users.email
//     FROM chat as chats INNER JOIN users as reg ON chats.id_u_sender = reg.id
//     INNER JOIN users ON chats.id_u_receiver = users.id
//     WHERE chats.id_u_sender = ${idSender}`
    
//     mysql.query(query, (err, result)=>{
//         if(err) throw err
//         return res.json(result)
//     })
// })


//get all chats of an user
router.get('/v1/chats/:idUser', (req, res)=>{
    const { idUser } = req.params // it could be req.params.idSender or req.params.idReceiver 
    
    objt.getUserChat(idUser)
    .then(data =>res.json(data) )
    .catch(err => err.message)
})

//get messages from a user
router.get("/v1/message/:from/:to", (req, res)=> {
    
    const { from, to } = req.params
    objt.getChatMessage(from, to)
    .then(data => res.json(data))
    .catch(err => err.message)
})

router.post("/v1/signup", (req, res)=>{

    const userToRegister = req.body
    const encryptPW = encrypt.encrypting(userToRegister.password) 
    userToRegister.password = encryptPW.content
    
    const query = `INSERT INTO users (name, email, code_pass, socketid ,iv)
    VALUES ('${userToRegister.name}','${userToRegister.email}', '${userToRegister.password}','dafgdsg','${encryptPW.iv}')`
    
    mysql.query(query, (err, result)=>{
        if(err) throw err
        console.log(result)
    })
    return res.json(userToRegister)
})

module.exports = router