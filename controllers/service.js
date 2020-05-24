const { Service, User } = require('../models')
const distanceCalculator = require('../helpers/distanceCalculator')


const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })  
}

module.exports = {
    activeService: async (req, res) => {
        const { userType, userId } = req.body
        var query, details, payload
        switch(userType){
            case "driver" :
                query = {driver: userId, status:"active"}
                break;
            default :
                query = {rider: userId, status:"active"}    
        }
        Service.findOne(query)
        .then(result => {
            let id =  userType == 'rider' ? result.driver : result.rider
            getUserById(id)
            .then(user => {
                let data = {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phone: user.phone,
                    profileImage: user.profileImage
                }
                let r = {...result._doc}
                r.details = data
                res.send(r)
            })
        })
        .catch(err => {
            console.log(err)
            throw err
        })
    },

    cancelService: async (req, res) => {
        const { userType, userId } = req.body
        var query
        switch(userType){
            case "driver" :
                query = {driver: userId, status:"active"}
                break;
            default :
                query = {rider: userId, status:"active"}    
        }
        Service.findOneAndUpdate(query, {status: "cancelled"})
        .then(result => {
            console.log(result)
            res.send(result)
        })
        .catch(err => {
            console.log(err)
            throw err
        })
    },

    rateDriver: async (req, res) => {
        const { id, rating } = req.body
        Service.findOneAndUpdate(id, {rating: rating})
        .then(result => {
            res.send(result)
        })
        .catch(err => {
            throw err
        })
    },

    fareEstimate: async (req, res) => {
        const { pickupGeometry, destinationGeometry } = req.body
        const distance = distanceCalculator(pickupGeometry.lat, pickupGeometry.lng, destinationGeometry.lat, destinationGeometry.lng)
        const price = 500
        const fareEstimate = (distance/1000) * price
        res.json(fareEstimate)
    },

    history: async (req, res) => {
        const { id, type } = req.body
        console.log(id, type)
        Service.find({ rider:id})
        .populate(type)
        .then(data => {
            console.log(data.length)
            res.send(data)
        })
        .catch(err => {
            throw err
        })
    }
  
}