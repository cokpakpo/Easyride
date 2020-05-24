
const distanceCalculator = require('../helpers/distanceCalculator')

var pool = {}

const showPool = () => {
    return pool
}

const addDriver = (data) => {
    if(pool[data.userId]){
        console.log('User already exists...')
        return
    } 
    else {
        console.log('driver added to pool...')
        pool[data.userId] = data
    } 
}

const removeDriver = (id) => {
    if(pool[id]) delete pool[id] 
}

const removeDriverBySocketId = (socket) => {
    for(let driver in pool){
       if(pool[driver].socketId === socket) {
           delete pool[driver]
       }
    }
}

const updateGeolocation = (id, location) => {
    pool[id].geolocation = location
}

const updateDriverStatus = (id, status) => {
    pool[id].status = status
}

const serviceMatching = (riderGeolocation) => {
    try{
        if(isEmptyPool){
            var closestDriver = null
            var shortestDistanceInKilometre = 1000
            for(let driver in pool){
                if(pool[driver].status === 'available'){
                    let distance = distanceCalculator(riderGeolocation.lat, riderGeolocation.lng, pool[driver].geolocation.lat, pool[driver].geolocation.lng)
                    if(distance < shortestDistanceInKilometre){
                        closestDriver = pool[driver]
                        shortestDistanceInKilometre = distance
                    }
                } 
            }
            return closestDriver
        }
    }
    catch(err){
        throw err
    }
}

const isEmptyPool = () => {
    let keys = Object.keys(pool)
    if(keys.length > 0){
        return true;
    }
    return false;
}

module.exports = {
    showPool,
    addDriver,
    removeDriver,
    removeDriverBySocketId,
    serviceMatching,
    updateGeolocation,
    updateDriverStatus
}

    
