const app = require("express")
const forumQuery = require("./forumQuery")


const router = app.Router()


router.post('/v1/publishForum', (req, res) => {
    const forumModel = req.body
    console.log(forumModel)
    forumQuery.publishForum(forumModel)
    .then( data => res.json(data))
    .catch(err => err.message)

})

router.post('/v1/commentForum', (req, res) => {
    const replyModel = req.body
    console.log(replyModel)
    forumQuery.replyForum(replyModel)
    .then( data => res.json(data))
    .catch(err => err.message)

})

router.post('/v1/replyComment', (req, res) => {
    const replyModel = req.body
    console.log(replyModel)
    forumQuery.replyCommentForum(replyModel)
    .then( data => res.json(data))
    .catch(err => err.message)

})

router.get('/v1/commentsReply/:fatherId/:forumId', (req, res) => {

    const { fatherId, forumId } = req.params

    forumQuery.getReplyComment( fatherId, forumId)
    .then(data => res.json(data))
    .catch(err => err.message)
})

router.get('/v1/forums', (req, res)=>{
    forumQuery.getForums()
    .then(data => res.json(data))
    .catch(err => err.message)
})

router.get('/v1/forum/:limit', (req, res)=>{
    const limit = req.params.limit
    forumQuery.getForum(limit)
    .then(data => res.json(data))
    .catch(err => err.message)
})

router.get('/v1/forums/:name', (req, res)=>{
    const name = req.params.name
    forumQuery.getFilterForums(name)
    .then(data => res.json(data))
    .catch(err => err.message)
})


module.exports = router