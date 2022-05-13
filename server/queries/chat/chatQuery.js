const mysql =  require("../../db/dbConnect")
const { stringify } = require("nodemon/lib/utils")
const dayjs = require('dayjs')

const chatQuery = {

    isContact: (from, to) => new Promise((resolve, reject) => {
    
        try {
            const query = `SELECT * FROM userchat WHERE 
            (userId = ${from} AND otherUser = ${to}) OR
            (userId = ${to} AND otherUser = ${from})`

            mysql.query(query,(err, result) => {
                if(err) throw err
                resolve(result)
            })
        } catch (error) {
            reject(null)
        }
    }),

    insertUserChat: (from, to) => new Promise((resolve, reject) => {
    
        try {
            const query = `INSERT INTO userchat (userId, otherUser) VALUES(${from}, ${to})`

            mysql.query(query,(err, result) => {
                if(err) throw err
                resolve(result)
            })
        } catch (error) {
            reject(null)
        }
    }),

    getChatMessage: (from, to) => new Promise((resolve, reject)=>{
        try {
            const query = `SELECT chat.id_u_sender as userSenderId, chat.id_u_receiver as userReceiverId,
                users.name as fromUser,chat.message as sms, TIMESTAMP(chat.date) as time, chat.checked 
                FROM chat INNER JOIN users ON chat.id_u_sender = users.id
                WHERE (id_u_sender = ${from} AND id_u_receiver = ${to})
                or (id_u_sender = ${to} AND id_u_receiver = ${from})
                ORDER BY chat.date
                `
            
            mysql.query(query, (err, result)=> {
                if(err) throw err
                const arr = result.map( element => {
                    element.sms = stringify(element.sms)
                    element.time = dayjs(element.time).format("HH:mm a")
                    return element
                });
                resolve(arr)
            })    
        } catch (error) {
            reject(null)
        }
    }),

}

module.exports = chatQuery