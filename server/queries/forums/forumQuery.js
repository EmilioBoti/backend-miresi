const mysql =  require("../../db/dbConnect")


const forumQuery = {
    
    getCategories: () => new Promise((resolve, reject)=>{
        const query = `SELECT * FROM category`

        try {
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })
            
        } catch (error) {
            reject(null)            
        }
    }),

    replyForum: (replyModel) => new Promise((resolve, reject) =>{
        
        try {
            const query = `INSERT INTO forum_reply (forumId, userId, comments, fatherId, date_created)
            VALUES (${replyModel.forumId}, ${replyModel.userId}, "${replyModel.comments}", ${replyModel.fatherId} ,CURRENT_TIMESTAMP)`
            
            mysql.query(query, (err, result)=> {
                resolve(result)
            })

        } catch (error) {
            reject(null)
        }

    }),

    getReplyComment: (fatherId, forumId) => new Promise((resolve, reject)=>{
        try {
            const query = `SELECT forum_reply.id, forum_reply.forumId, forum_reply.comments, forum_reply.date_created,
            forum_reply.fatherId, users.id, users.name, userpictures.image
            FROM forum_reply
            INNER JOIN users ON users.id = forum_reply.userId 
            LEFT JOIN userpictures ON userpictures.user_id = users.id
            WHERE forum_reply.fatherId = ${fatherId} AND forum_reply.forumId = ${forumId}
            `

            mysql.query(query, (err, result)=> {
                resolve(result)
            })

        } catch (error) {
            reject(null)
        }
    }),

    replyCommentForum: (replyModel) => new Promise((resolve, reject) =>{
        
        try {
            const query = `INSERT INTO forum_reply (forumId, userId, comments, fatherId, date_created)
            VALUES (${replyModel.forumId}, ${replyModel.userId}, "${replyModel.comments}", ${replyModel.fatherId} ,CURRENT_TIMESTAMP)`
            
            mysql.query(query, (err, result)=> {
                resolve(result)
            })

        } catch (error) {
            reject(null)
        }

    }),

    publishForum: (model) => new Promise((resolve, reject) => {
        try {
        
            const query =  `INSERT INTO forum (name, create_uid , about, resi_id, city_id, category_id, date_created, image)
            VALUES ("${model.name}", ${model.creatorUser} ,"${model.about}", ${model.resiId}, ${model.cityId}, ${model.categoryId}, CURRENT_TIME, ${model.image})`
            
            mysql.query(query, (err, result)=>{
                if(err) throw err.message
                resolve(true)
            })
            
        } catch (error) {
            reject(false)
        }
    }),

    getForums: () => new Promise((resolve, reject)=>{
        const query = `SELECT forum.id as forumId, forum.name as forumName,
        forum.create_uid as createrUser, forum.second_label as secondLabel,
        forum.about,
        forum.resi_id as resiId, forum.city_id as cityId,
        category.name as categoryName, DATE_FORMAT(forum.date_created,'%d/%m/%Y') as dateCreated,
        forum.image, forum.tag,
        residence.name as resiName, city.name as cityName
        FROM forum
        LEFT JOIN category
        ON category.id = forum.category_id
        LEFT JOIN residence ON
        residence.id = forum.resi_id
        LEFT JOIN city ON
        city.id = forum.city_id
        ORDER BY forum.date_created DESC
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
    getForum: (limit) => new Promise((resolve, reject)=>{
        const query = `SELECT forum.id as forumId, forum.name as forumName,
        forum.create_uid as createrUser, forum.second_label as secondLabel,
        forum.about,
        forum.resi_id as resiId, forum.city_id as cityId,
        category.name as categoryName, DATE_FORMAT(forum.date_created,'%d/%m/%Y') as dateCreated,
        forum.image, forum.tag,
        residence.name as resiName, city.name as cityName
        FROM forum
        LEFT JOIN category
        ON category.id = forum.category_id
        LEFT JOIN residence ON
        residence.id = forum.resi_id
        LEFT JOIN city ON
        city.id = forum.city_id
        ORDER BY forum.date_created DESC
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

    getFilterForums: (name) => new Promise((resolve, reject)=>{
        const query = `SELECT forum.id as forumId, forum.name as forumName,
        forum.create_uid as createrUser, forum.second_label as secondLabel,
        forum.about,
        forum.resi_id as resiId, forum.city_id as cityId,
        category.name as categoryName, DATE_FORMAT(forum.date_created,'%d/%m/%Y') as dateCreated,
        forum.image, forum.tag,
        residence.name as resiName, city.name as cityName
        FROM forum
        LEFT JOIN category
        ON category.id = forum.category_id
        LEFT JOIN residence ON
        residence.id = forum.resi_id
        LEFT JOIN city ON
        city.id = forum.city_id
        WHERE category.name = '${name}'
        ORDER BY forum.date_created DESC
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

module.exports = forumQuery
