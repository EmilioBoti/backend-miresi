const mysql = require("../../db/dbConnect")
const encrypt = require("../../encrypting")

const validUser = (result, user) => {
    if(result.length != 0){
        const hash = { "iv": result[0].iv, "content": result[0].code_pass }
        const decryting = encrypt.decrypt(hash)

        if(decryting !== user.code_pass){
            return {"allow":true ,"id": result[0].id,
            "name": result[0].name,"email": result[0].email,
            "socketId": result[0].socketid,
            "image": result[0].image
        }
        }else return null 
    }
}
const validPassword = (user) =>{
    return (user.password == user.confirmPw)
}

const loginQuery = {

    login: (user) => new Promise((resolve, reject)=>{
        try{
            const query = `SELECT * FROM users
            LEFT JOIN userpictures ON userpictures.user_id = users.id
            WHERE email = '${user.email}'`

            mysql.query(query, (err, result)=> {
                if(err) throw err
                resolve(validUser(result, user))
            })
        }catch(err){
            reject(null)
        }
    }),
    signUp: (user) => new Promise((resolve, reject)=> {

        try {

            if(validPassword(user)){
                const encryptPW = encrypt.encrypting(user.password) 
                user.password = encryptPW.content        
            
                const query = `INSERT INTO users (name, email, code_pass, socketid, iv)
                VALUES ('${user.name}','${user.email}', '${user.password}','d','${encryptPW.iv}')`
            
                mysql.query(query, (err, result)=>{
                    if(err) reject(null)
                    resolve(user)
                })
            
            }else reject(null)
            
        } catch (error) {
            reject(null)            
        }
    }),

}

module.exports = loginQuery
