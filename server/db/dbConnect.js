
const mysql = require("mysql")

const connectionDb = mysql.createPool({
    database: "bbw48z3xt3xrebigtbyt",
    user: "uuwh1itwd2kg7yyd",
    host: "bbw48z3xt3xrebigtbyt-mysql.services.clever-cloud.com",
    password: "JcvC9LDG5L9paPWX35cD",
    port: 3306
    // connectionLimit: 40,
    // host: process.env.HOST,
    // user: process.env.USER,
    // password: process.env.PASSWORD,
    // database: process.env.DATABASE,
})

module.exports = connectionDb