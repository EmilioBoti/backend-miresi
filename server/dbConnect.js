
const mysql = require("mysql")

const connectionDb = mysql.createPool({
    connectionLimit: 40,
    host: "localhost",
    user: "root",
    password: "",
    database: "miresidb",
})

module.exports = connectionDb