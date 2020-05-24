const { isLoggedIn } = require('../middleware/auth')
const controllers = require('../controllers');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './profileImage')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
})

const filter = (req, file, cb ) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 3
    }, 
    fileFilter: filter
})

module.exports = (app, passport) => {
    app.get("/driver", (req, res) => {
        res.render('driver')
    })
    app.get("/rider", (req, res) => {
        res.render('rider')
    })
    app.post("/service", controllers.service.activeService)
    app.post("/service/cancel", controllers.service.cancelService)
    app.post("/service/rating", controllers.service.rateDriver)
    app.get("/signup", controllers.users.getSignup)
    app.get("/login", controllers.users.getLogin)
    app.post("/auth/local/signup", passport.authenticate('local-signup'), controllers.users.postLocalSignup)
    app.post("/auth/local/login", passport.authenticate('local-login'), controllers.users.postLocalLogin)
    app.post("/auth/fb/login", controllers.users.fbLogin)
    app.get("/auth/facebook", passport.authenticate('facebook'), controllers.users.postFacebook)
    app.get("/auth/facebook/callback", passport.authenticate('facebook', {failureRedirect: '/'}), controllers.users.postFacebook)
    app.post("/auth/twitter", controllers.users.postTwitter)
    app.post("/estimate", controllers.service.fareEstimate)
    app.post("/addCard", controllers.users.card) 
    app.get("/receivepayment", controllers.users.receivepayment)
    app.post("/update", controllers.users.update)
    app.post("/history", controllers.service.history)
    app.post("/profileImage", upload.single('profileImage'), controllers.users.profileImage)
}
