const mysql =  require("./dbConnect")

class Queries {
   
    static updateSockectIt(userId, socketId){
        try {
            const query = `UPDATE users SET socketId = '${socketId}' WHERE id = ${userId}`
            mysql.query(query, (err, result)=>{
                if(err) throw err
                // console.log(result)
            })    
        } catch (error) {
            console.error(error)
        }
    }

}

const objt = {

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
                // return res.json(result)
            })
        } catch (err) {
            reject(null)
            // return res.json(null)
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

module.exports = {  Queries, objt }

