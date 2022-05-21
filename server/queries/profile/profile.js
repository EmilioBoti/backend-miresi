const mysql = require("../../db/dbConnect")

const profileQuery = {
    
    updateUserData: (user) => new Promise((resolve, reject )=>{

        const query = `UPDATE users SET ? WHERE id = ?`
        try {
            



        } catch (error) {
            
        }

    })

}
module.exports = profileQuery
