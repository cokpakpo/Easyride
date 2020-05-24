const mongoose = require('mongoose')
const { Schema } =  mongoose

var User = mongoose.model('User', require('./user')(Schema))
var Service = mongoose.model('Service', require('./service')(Schema))
var Payments = mongoose.model('Payments', require('./payments')(Schema))

module.exports = {
    User,
    Service,
    Payments
}