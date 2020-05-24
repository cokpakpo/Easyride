
module.exports = (Schema) => {
    const paymentSchema =  new Schema({
        txRef: String,
        flwRef: String,
        amount: String,
        status: String,
        fullname: String,
        email: String,
        appfee: String
    }, {timestamps: true})
    return paymentSchema
}