
module.exports = (Schema) => {
    const serviceSchema = new Schema({
        driver: {type: Schema.Types.ObjectId, ref:'User'},
        rider: {type: Schema.Types.ObjectId, ref:'User'},
        status: String,
        location: String,
        destination: String,
        geometry: Object,
        driversLastPosition: Object,
        startTrip: {type: String, default:false},
        estimate: String,
        rating: {type: String, default: null},
        paymentMethod: String,
        createdAt: {type: Date}
    },{timestamp: true})

    return serviceSchema
}