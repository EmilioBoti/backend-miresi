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
