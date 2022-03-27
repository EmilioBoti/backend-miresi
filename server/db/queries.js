
class Queries {
    constructor(mysql){
        this.mysql = mysql
    }

    updateSockectIt(userId, socketId){
        try {
            const query = `UPDATE users SET socketId = '${socketId}' WHERE id = ${userId}`
            mysql.query(query, (err, result)=>{
                if(err) throw err
                console.log(result)
            })    
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Queries

