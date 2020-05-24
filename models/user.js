const bcrypt = require('bcrypt-nodejs')

module.exports = (Schema) => {
    const userSchema = new Schema({
        email: String,
        password: String,
        firstname : String,
        lastname: String,
        phone: {type: String, default: null},
        balance: {type: String, default: null},
        isAdmin : {type:Boolean, default: false},
        status : {type : String, default: false},
        recoveryToken: {type:String, default: null},
        profileImage: {type:String, default:null},
        acctType: {type: String, default: 'rider'},
        cardDetails:{
            cardNo: String,
            firstname: String,
            lastname: String,
            cvv: String,
            exp: String
        },
        facebook : {
            id: String,
            token: String,
            name: String,
        },
        twitter : {
            id: String,
            token: String,
            email: String,
        }
    }, {timestamps:true})

    userSchema.methods.generateHash = (password) => {
        return  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    }
    userSchema.methods.validPassword = (newPassword, oldPassword) => {
        return bcrypt.compareSync(newPassword, oldPassword)
    }
    return userSchema;
}    