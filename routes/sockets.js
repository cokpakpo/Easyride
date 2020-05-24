const { 
    addDriver,
    removeDriverBySocketId,
    serviceMatching,
    updateGeolocation,
    updateDriverStatus } = require('../logic/driverspool')

const service = require('../logic/service')
const {addUser, getUserSocket, removeUserBySocketId} = require('../logic/userspool')
const tokeValidator = require('../middleware/auth')


module.exports = (socket) => {
    console.log('connection established', socket.id)
    console.log('the token result', tokeValidator.validToken(socket.handshake.query.token))
     let data = {socketId:socket.id, userId:socket.handshake.query.userId}
     addUser(data)
   
   socket.on('addDriver', (data) => {
       data.socketId = socket.id
       addDriver(data)
   }) 

   socket.on('updateGeolocation', (data) => {
        updateGeolocation(data)
   })
  
   socket.on('updateDriverStatus', (data) => {
        updateDriverStatus(data)
   })
   
   socket.on('rideRequest', (data) => { 
        addUser({socketId:socket.id, userId:data.userId})
        findRide(data)    
   })

   socket.on('cancelRide', (data) => { 
     const socketId = getUserSocket(data)
     socketId ? socket.to(socketId).emit('cancelRide') : socket.emit('userOffline')
   })

   socket.on('completedRide', (data) => {
    console.log(data)
    })

   socket.on('acceptedRequest', (data) => {
     const socketId = getUserSocket(data.rider.userId)
     if(socketId){
          service.addService(data)
          .then(() => {
               socket.to(socketId).emit('driverAccept')
          })    
     }else{
          console.log('user is offline')
     }
   })

   socket.on('rejectedRequest', (data) => {
     const socketId = getUserSocket(data.rider.userId)
     socketId ? socket.to(socketId).emit('driverReject') : offline(socket.id)
   })

   socket.on('endTrip', (data) => {
     const socketId = getUserSocket(data)
     socketId ? socket.to(socketId).emit('endTrip') : offline(socket.id)
   })
  
   socket.on('disconnect', function(){
        removeDriverBySocketId(socket.id)
        removeUserBySocketId(socket.id)
   })

     const findRide = (data) => {
          const socketId = getUserSocket(data.userId)
          if(socketId){
               const driver = serviceMatching(data.geometry.pickupGeometry)
               driver ? socket.to(driver.socketId).emit('driverRequest', data) : socket.emit('noDriver') 
               return
          }
          socket.emit('userOffline')     
     }

     const offline = (socketId) => {
          socket.to(socketId).emit('userOffline')
     }
}


