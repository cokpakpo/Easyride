const { Service }  = require('../models')

module.exports = {
    addService: (data) => {
        return new Promise((resolve, reject) => {
            try {
                let service = new Service()
                service.driver = data.driver.userId
                service.rider = data.rider.userId
                service.status = "active"
                service.geometry = data.rider.geometry
                service.driversLastPosition = data.driver.geometry
                service.location = data.rider.location
                service.destination = data.rider.destination
                service.estimate = data.rider.estimate
                service.paymentMethod = data.rider.paymentMethod
                service.createdAt = Date.now()
                service.save((err, result) => {
                    if(err) reject(err)
                    resolve(result) 
                })
            }
           catch(err){
               reject(err)
           }
        })
    },

    getService: (userId) => {

    },

    updateService: (userId, service, data) => {

    }
}