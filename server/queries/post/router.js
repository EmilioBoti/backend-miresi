const app = require("express")
const postQuery = require("./post")


const router = app.Router()


router.get('/v1/posts', (req, res)=>{
    postQuery.getAllPost()
        .then(data => res.json(data))
        .catch( err => err.message)
})

router.post('/v1/createPost', (req, res) => {
    const post = req.body
    postQuery.createPost(post)
    .then( data => res.json(data))
    .catch(err=> err.message)
})

module.exports = router