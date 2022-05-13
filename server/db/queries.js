const mysql =  require("./dbConnect")


const objt = {

    getPostComment: (commentModel)=> new Promise((resolve, reject) => {
        
        const query = ``

        try {
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
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
            })    
        } catch (error) {
            console.error(error)
        }
    },

    getSingleUser: (id) => new Promise((resolve, reject)=>{
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
            const query = `SELECT users.id, users.name, users.email, userpictures.image,
            users.socketid as socketId
            FROM users as logEdUser
            INNER JOIN userchat ON logEdUser.id = userchat.userId
            INNER JOIN users ON users.id = userchat.otherUser
            LEFT JOIN userpictures ON userpictures.user_id = users.id
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