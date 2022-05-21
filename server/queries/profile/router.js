const app = require("express")
const mysql = require("../../db/dbConnect")

// const postQuery = require("./profile")

const router = app.Router()

router.put("/v1/updateUser/:id", async (req, res) => {
    try {
        const id = req.params.id
        const user = req.body
        
        mysql.query("UPDATE users SET ? WHERE id = ?", [user, id], (err, result)=>{
            if(err) res.sendStatus(500).json(false)
            res.json(true)
        })
       
    } catch (error) {
        res.json(false)
    }

} )

module.exports = router
