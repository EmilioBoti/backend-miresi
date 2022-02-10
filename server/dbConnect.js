
const mysql = require("mysql")

const connectionDb = mysql.createConnection({
    host: "sql11.freemysqlhosting.net",
    port: 3306,
    user: "sql11471646",
    password: "WirNQflQBL",
    database: "sql11471646",
})

module.exports = connectionDb