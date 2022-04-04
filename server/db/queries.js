const mysql =  require("./dbConnect")
const encrypt = require("../encrypting")


const validUser = (result, user) => {
    if(result.length != 0){
        const hash = { "iv": result[0].iv, "content": result[0].code_pass }
        const decryting = encrypt.decrypt(hash)

        if(decryting !== user.code_pass){
            return {"allow":true ,"id": result[0].id,"name": result[0].name,"email": result[0].email, "socketId": result[0].socketid}
        }else return null 
    }
}

const objt = {

    login: (user) => new Promise((resolve, reject)=>{
        try{
            const query = `SELECT * FROM users WHERE email = '${user.email}'`
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(validUser(result, user))
            })
        }catch(err){
            reject(null)
        }
    }),
    signUp: (user) => new Promise((resolve, reject)=>{

        try {
            const encryptPW = encrypt.encrypting(user.password) 
            user.password = encryptPW.content
            
            const query = `INSERT INTO users (name, email, code_pass, socketid ,iv)
            VALUES ('${user.name}','${user.email}', '${user.password}','dafgdsg','${encryptPW.iv}')`
            
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(user)
            })
        } catch (error) {
            reject(null)            
        }
    }),

    updateSockectIt: (userId, socketId)=>{
        try {
            const query = `UPDATE users SET socketId = '${socketId}' WHERE id = ${userId}`
            mysql.query(query, (err, result)=>{
                if(err) throw err
                // console.log(result)
            })    
        } catch (error) {
            console.error(error)
        }
    },
    getResiFromCity: (city)=> new Promise(( resolve,reject)=>{
        try {
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
                resolve(result)
            })
        } catch (err) {
            reject(null)
        }
    }),
    getSingleResi: (id) => new Promise((resolve, reject)=>{
        try { 
            const query = `SELECT residence.id, residence.name AS resiName, residence.location,residence.phone_number,
            residence.description,residence.email, residence.link, residence.library, residence.laundry, residence.gym,
            residence.parking_bicycle, residence.parking_car,residence.parking_motorcycle, residence.id_city,
            picturesresidence.image
            FROM residence
            LEFT JOIN picturesresidence ON residence.id = picturesresidence.id_residence
            WHERE residence.id = ${id}
            GROUP BY residence.name`
    
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })
    
        } catch (error) {
            reject(null)
        }
    }),
    getResiRooms: (id) => new Promise((resolve, reject)=>{
        try {
        
            const query = `SELECT * FROM room INNER JOIN room_type ON room.id_type = room_type.id
            INNER JOIN picture_rooms ON picture_rooms.id_room_type = room_type.id
            INNER JOIN residence ON residence.id = room.id_resi
            WHERE residence.id = ${id} 
            GROUP BY room.id        
            `
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })
        } catch (err) {
            reject(null)
        }
    }),
    
    getChatMessage: (from, to) => new Promise((resolve, reject)=>{
        try {
            const query = `SELECT chat.id_u_sender as userSenderId, chat.id_u_receiver as userReceiverId,
                users.name as fromUser,chat.message as sms, chat.checked  
                FROM chat INNER JOIN users ON chat.id_u_sender = users.id
                WHERE (id_u_sender = ${from} AND id_u_receiver = ${to})
                or (id_u_sender = ${to} AND id_u_receiver = ${from})`
            
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })    
        } catch (error) {
            reject(null)
        }
    }),

    getSingleUser: (id)=>new Promise((resolve, reject)=>{
        try {
            const query = `SELECT id, name, email, socketId FROM users WHERE id = '${id}'`
    
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })
    
        } catch (error) {
            reject(null)
        }
    }),
    getUserChat: (id)=> new Promise((resolve, reject)=>{
        try {    
            const query = `SELECT users.id, users.name, users.email, users.socketid as socketId FROM users as logEdUser INNER JOIN userchat ON logEdUser.id = userchat.userId
            INNER JOIN users ON users.id = userchat.otherUser
            WHERE logEdUser.id = ${id}`
            
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })
        } catch (error) {
            reject(null)
        }
    })
}

module.exports = { objt }

