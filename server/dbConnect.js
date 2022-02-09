
const mysql = require("mysql")

const connectionDb = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "miresidb"
})

module.exports = connectionDb