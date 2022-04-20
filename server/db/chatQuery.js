const mysql =  require("./dbConnect")


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
    })

}

module.exports = chatQuery