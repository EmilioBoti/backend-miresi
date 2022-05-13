const app = require("express")
const mysql = require("../db/dbConnect");
const { objt } = require("../db/queries")
const forumQuery = require('../queries/forums/forumQuery');
const chatQuery = require("../queries/chat/chatQuery");
const loginQuery = require("../queries/login/login")

const router = app.Router()


router.get('/v1/categories', (req, res)=>{
    forumQuery.getCategories()
    .then(data => res.json(data))
    .catch(err => err.message)
})


router.get('/v1/forums', (req, res)=>{
    forumQuery.getForums()
    .then(data => res.json(data))
    .catch(err => err.message)
})

router.get('/v1/forums/:name', (req, res)=>{
    const name = req.params.name
    forumQuery.getFilterForums(name)
    .then(data => res.json(data))
    .catch(err => err.message)
})

router.get('/city/c/:search', (req, res)=> {
    const { search } = req.params
    
    const searching = (search)=> new Promise((resolve, reject)=>{
        try {
            const query = `SELECT * FROM city WHERE name LIKE '${search}%'`
    
            mysql.query(query, (err, result)=>{
                if(err) throw err
                resolve(result)
            })
        } catch (err) {
            reject(null)
        }
    })
    searching(search).then(data => res.json(data))
    .catch(err => err.message)

})

router.get('/v1/city/:id', (req, res)=>{

    const { id } = req.params
    const query = `SELECT * FROM city WHERE id = ${id}`

    try {
        mysql.query(query, (err, result)=>{
            if(err) throw err
            return res.json(result)
        })
    } catch (err) {
        return res.json(null)
    }

})
//ENDPOINTS
router.get('/v1/cities', (req, res)=>{

    const query =  `SELECT * FROM city`
    try{
        mysql.query(query, (err, result)=>{
            if(err) throw err
            return res.json(result)
        })
    }catch(err){
        console.err(err)
    }
    
})

//get a single user
router.get('/v1/user/:id', (req, res)=>{
    const id = req.params.id

    objt.getSingleUser(id)
    .then(data => res.json(data))
    .catch(err => err.message)
})

router.post('/v1/login', (req, res)=> {

    const user = req.body
    loginQuery.login(user)
    .then( data => res.json(data))
    .catch(err => err.message)
    
})

//get all chats of an user
router.get('/v1/chats/:idUser', (req, res)=>{
    const { idUser } = req.params // it could be req.params.idSender or req.params.idReceiver 
    
    objt.getUserChat(idUser)
    .then(data =>res.json(data) )
    .catch(err => err.message)
})

//get messages from a user
router.get("/v1/message/:from/:to", (req, res)=> {
    
    const { from, to } = req.params
    chatQuery.getChatMessage(from, to)
    .then(data => res.json(data))
    .catch(err => err.message)
})

router.post("/v1/signup", (req, res)=> {

    const user = req.body
    loginQuery.signUp(user)
    .then(data => res.json(data))
    .catch(err => null)
    
})

module.exports = router