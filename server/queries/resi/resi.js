const mysql = require("../../db/dbConnect")


const resiQuery = {

    postResiComment: (commentModel) => new Promise((resolve, reject) => {
        try {     
            const query = `INSERT INTO resi_comments (user_id, resi_id, comments, create_date)
            VALUES (${commentModel.userId},${commentModel.resiId},"${commentModel.comments}", CURRENT_TIMESTAMP)`
            
            mysql.query(query, (err, result)=>{
                if(err) reject(false)
                resolve(commentModel)
            })
        } catch (error) {
            reject(false)            
        }
    }), 
    addFavourite: (favourite) => new Promise((resolve, reject)=>{

        try {     
            const query = `INSERT INTO stackfavourite (id_user, id_residence)
            VALUES(${favourite.userId},${favourite.resiId})`
            
            mysql.query(query, (err, result)=>{
                if(err) reject(false)
                resolve(true)
            })
        } catch (error) {
            reject(false)            
        }
    }),

    removeFavourite: (favourite) => new Promise((resolve, reject)=>{

        try {     
            const query = `DELETE FROM stackfavourite
            WHERE id_user = ${favourite.userId} AND id_residence = ${favourite.resiId}`
            
            mysql.query(query, (err, result)=>{
                if(err) reject(null)
                resolve(true)
            })
        } catch (error) {
            reject(null)            
        }
    }),
    
    getResiComments: (id,limit)=> new Promise((resolve, reject)=>{
        
        const query = `SELECT users.id as userId, users.name as userName, resi_comments.resi_id as resiId,resi_comments.comments,
        DATE_FORMAT(resi_comments.create_date,'%d/%m/%Y') as dateCreated, userpictures.image as userImage 
        FROM resi_comments 
        INNER JOIN users ON users.id = resi_comments.user_id
        LEFT JOIN userpictures ON userpictures.user_id = users.id
        WHERE resi_comments.resi_id = ${id}
        ORDER BY resi_comments.create_date DESC
        LIMIT ${limit}
        `

        try {
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })

        } catch (error) {
            reject(null)
        }

    }),
    
    getLimitResi: (limit) => new Promise(( resolve,reject)=>{
        try {
            const query = `SELECT residence.id, residence.name AS resiName, residence.location,residence.phone_number,
            residence.description,residence.email, residence.link, residence.library, residence.laundry, residence.gym,
            residence.parking_bicycle, residence.parking_car,residence.parking_motorcycle, residence.id_city,
            picturesresidence.image, stackfavourite.id_residence as idResiFavorite, stackfavourite.id_user as idUser,
            stackfavourite.id_user as favouriteIdU, city.name as city,
            MIN(room.price) as priceFrom 
            FROM residence
            INNER JOIN city ON residence.id_city = city.id
            LEFT JOIN stackfavourite ON stackfavourite.id_residence = residence.id
            LEFT JOIN picturesresidence ON picturesresidence.id_residence = residence.id
            LEFT JOIN room ON room.id_resi = residence.id
            LEFT JOIN users ON users.id = stackfavourite.id_user
            GROUP BY resiName
            LIMIT ${limit}
            `

            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })
        } catch (err) {
            reject(null)
        }
    }),
    getResiFromCity: (city) => new Promise(( resolve,reject)=>{
        try {
            const query = `SELECT residence.id, residence.name AS resiName, residence.location,residence.phone_number,
            residence.description,residence.email, residence.link, residence.library, residence.laundry, residence.gym,
            residence.parking_bicycle, residence.parking_car,residence.parking_motorcycle, residence.id_city,
            picturesresidence.image, stackfavourite.id_residence as idResiFavorite, stackfavourite.id_user as idUser,
            stackfavourite.id_user as favouriteIdU,
            MIN(room.price) as priceFrom 
            FROM residence INNER JOIN city ON residence.id_city = city.id
            LEFT JOIN stackfavourite ON stackfavourite.id_residence = residence.id
            LEFT JOIN picturesresidence ON picturesresidence.id_residence = residence.id
            LEFT JOIN room ON room.id_resi = residence.id
            LEFT JOIN users ON users.id = stackfavourite.id_user
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
    
    getRooms: (limit) => new Promise((resolve, reject)=>{
        try {
        
            const query = `SELECT room.id, room.name,room.id_type, room.price, room.ac,
            room.heating, room.fridge,room.id_resi,room_type.type_name, room_type.kitchen,
            room_type.shared_kitchen, room_type.shared_room,room_type.shared_bathroom,
            picture_rooms.image FROM room
            INNER JOIN room_type ON room.id_type = room_type.id
            LEFT JOIN picture_rooms ON picture_rooms.id_room_type = room_type.id
            GROUP BY room.id 
            LIMIT ${limit}       
            `
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })
        } catch (err) {
            reject(null)
        }
    }),
    getResiRooms: (id) => new Promise((resolve, reject)=>{
        try {
        
            const query = `SELECT room.id, room.name,room.id_type, room.price, room.ac,
            room.heating, room.fridge,room.id_resi,room_type.type_name, room_type.kitchen,
            room_type.shared_kitchen, room_type.shared_room,room_type.shared_bathroom,
            picture_rooms.image FROM room
            INNER JOIN room_type ON room.id_type = room_type.id
            LEFT JOIN picture_rooms ON picture_rooms.id_room_type = room_type.id
            WHERE room.id_resi = ${id} 
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

}
module.exports = resiQuery