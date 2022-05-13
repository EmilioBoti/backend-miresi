const mysql = require("../../db/dbConnect")

const postQuery = {

    createPost: (post) => new Promise((resolve, reject) => {
        
        try {
            const query = `INSERT INTO post (id_user, id_residences, date_end, date_start, id_room)
            VALUES (${post.userId},${post.resiId},'${post.dateEnd}', '${post.dateStart}', ${post.roomId})`
            
            mysql.query(query, (err, result) => {
                if(err) throw err
                resolve(true) 
            })
        } catch (error) {
            reject(false)            
        }
    }),
    
    getAllPost: () => new Promise((resolve, reject) => {
        
        const query = `SELECT post.id as postId,room.id as roomId,room.name as roomName,room.price,
        picture_rooms.image as roomImg, residence.id as resiId,residence.name as resiName,
        DATE_FORMAT(post.date_start,'%d/%m/%Y') as dateStart, DATE_FORMAT(post.date_end,'%d/%m/%Y') as dateEnd,
        users.id as userId, users.name as userName, userpictures.image as userImg
        FROM post
        INNER JOIN users ON users.id = post.id_user
        INNER JOIN room ON room.id = post.id_room
        INNER JOIN room_type ON room_type.id = room.id
        INNER JOIN residence ON residence.id = post.id_residences
        LEFT JOIN userpictures ON userpictures.user_id = users.id
        LEFT JOIN picture_rooms ON picture_rooms.id_room_type = room.id_type
        GROUP BY postId
        ORDER BY post.id DESC
        `

        try {
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })    
        } catch (error) {
            reject(null)
        } 

    })

}
module.exports = postQuery