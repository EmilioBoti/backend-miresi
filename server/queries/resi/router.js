const app = require("express")
const resiQuery = require("./resi")


const router = app.Router()


router.get('/v1/resi/:id', (req, res)=>{
    const { id } = req.params
    
    resiQuery.getSingleResi(id)
    .then( data => res.json(data))
    .catch( err => err.message)
    
})

router.get('/v1/comments/:id/:limit', (req, res) => {
    const { id, limit} = req.params

    resiQuery.getResiComments(id,limit)
    .then(data => res.json(data))
    .catch(err => err.message)

})

//get rooms from a particular resi
router.get('/v1/resirooms/:idresi', (req, res)=>{
    const { idresi } = req.params
    
    resiQuery.getResiRooms(idresi)
    .then( result => res.json(result))
    .catch(err => err.message)
   
})

router.get('/v1/residences/:city', (req, res)=>{
    const { city } = req.params
    resiQuery.getResiFromCity(city)
    .then( data => res.json(data))
    .catch(err=> err.message)
})

router.post('/v1/postComment', (req, res)=>{
    const commentModel = req.body
    resiQuery.postResiComment(commentModel)
    .then(data => res.json(data))
    .catch(err => err.message)

})

router.post('/v1/addfavourite', (req, res)=>{
    const favourite = req.body
    resiQuery.addFavourite(favourite)
    .then(data => res.json(data))
    .catch(err => err.message)

})

router.post('/v1/removefavourite', (req, res)=>{
    const favourite = req.body
    resiQuery.removeFavourite(favourite)
    .then(data => res.json(data))
    .catch(err => err.message)

})

module.exports = router



