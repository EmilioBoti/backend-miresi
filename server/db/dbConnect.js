
const mysql = require("mysql")

const connectionDb = mysql.createPool({
    connectionLimit: 40,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

module.exports = connectionDb