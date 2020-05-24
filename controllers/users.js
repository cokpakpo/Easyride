require('dotenv').config()
const { User, Payments } = require('../models')
const jwt = require('jsonwebtoken');
const key = require('../config/jwt');
const axios = require('axios')
const fs = require('fs')

const verifyUrl = process.env.VERIFYURL
const privateKey = process.env.FLWPK

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        User.findById(id, (err, result) => {
            if(err) reject(err)
            resolve(result)
        })
    })  
}

const verifyPayment = (data) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: verifyUrl,
            data
        })
        .then(result => {
            resolve(result)
        })
    })
}

const updateImage = (id, filename) => {
    return new Promise((resolve, reject) => {
        User.findByIdAndUpdate(id, { profileImage: filename })
        .then(() => {
            getUserById(id)
            .then(user => {
                resolve(user)
            })
            .catch(err => {
                reject(err)
            })
        })
    })
}

module.exports = {
    getLogin: (req, res) => {
        res.send("Login page")
    },

    getSignup: (req, res) => {
        res.send("Signup page loaded successfully")
    },

    postLocalSignup: (req, res) => {
        res.json(req.user)
    },

    postLocalLogin: (req, res) => {
        if(!req.user){
            res.status(401).send({status:'401'})
        }
        const {email, _id, isAdmin, status, acctType, firstname, lastname, cardDetails, profileImage, phone} = req.user;
        const user = {_id, email, isAdmin, status, firstname, lastname, acctType, cardDetails, profileImage, phone}
        const token = jwt.sign({email, _id}, key.secret);
        res.send({token, user})
    },

    fbLogin: (req, res) => {
        const url = req.body.profile.picture.data.url
        const { profile, fbToken } = req.body
        User.findOne({"facebook.id": profile.id}, function (err, result){
            if(err) throw err
            if(!err && result !== null){
                console.log('found one result')
                const {email, _id, isAdmin, status, acctType, firstname, lastname, cardDetails, profileImage, phone} = result;
                const user = {_id, email, isAdmin, status, firstname, lastname, acctType, cardDetails, profileImage, phone}
                const token = jwt.sign({email, _id}, key.secret);
                res.send({token, user})
            }else {
                console.log('continue with second ops')
                let newUser = new User();
                newUser.facebook.id = profile.id
                newUser.facebook.token = fbToken
                newUser.facebook.name = profile.name
                newUser.email = profile.email
                newUser.profileImage = url
                newUser.firstname = profile.first_name
                newUser.lastname = profile.last_name;
                newUser.save((err)=>{
                    if(err) throw err;
                    User.findOne({"facebook.id": profile.id})
                    .then(result => {
                        const {email, _id, isAdmin, status, acctType, firstname, lastname, cardDetails, profileImage, phone} = result;
                        const user = {_id, email, isAdmin, status, firstname, lastname, acctType, cardDetails, profileImage, phone}
                        const token = jwt.sign({email, _id}, key.secret)
                        res.send({token, user})
                    }) 
                })
            }
        })
    },

    postFacebook: (req, res) => {
        if(!req.user){
            res.status(401).send({status:'401'})
        }
        const {email, _id, isAdmin, status, acctType, cardDetails, phone} = req.user;
        const fullname = req.user.facebook.name
        const fbId = req.user.facebook.id
        const user = {_id, email, isAdmin, status, fullname, acctType, cardDetails, phone}
        const token = jwt.sign({fbId, _id}, key.secret);
        res.send({token, user})
    },

    postTwitter: (req, res) => {
        res.send("Twitter Login Successfull...")
    },

    card:(req, res) => {
        console.log(req.body)
        const { cardDetails, userId }  = req.body
        User.findById(userId, (err, user) => {
           if(err) throw err
           user.cardDetails = cardDetails
           user.save((err, newUser) => {
               if(err) throw err
               console.log(newUser)
               res.send(newUser.cardDetails)  
           })
        })
    },

    update:(req, res) => {
        const {id, field } = req.body
        User.findById(id)
        .then(user => {
            for(let key in field){
                switch(key){
                    case 'password':
                        user[key] = user.generateHash(field[key])
                        break
                    default:
                        user[key] = field[key]
                }
            }
            user.save()
            .then(result => {
                res.send(result)
            })
        })
    },

    profileImage: (req, res) => {
        const { id } = req.body
        const { filename } = req.file
        let oldImage = null
        if(id){
           
            User.findById(id)
            .then(res => {
                oldImage = res.profileImage
                console.log('old file ', oldImage)
            })
            .catch(err => {
                throw err
            })
            if(oldImage !== null){
                fs.unlink(`profileImage/${oldImage}`, function(err){
                    if(err) throw err
                    updateImage(id, filename)
                    .then(result => {
                        res.send(result)
                    })
                })
            }
            updateImage(id, filename)
            .then(result => {
                res.send(result)
            }) 
        }
    },

    receivepayment: (req, res) => {
        let response = req.query.response;
        response = JSON.parse(response)
        if(response.status == 'successful'){
            const {txtRef, flwRef, amount, status, appfee } = response
            const {fullname, email} = response.customer
            const payload = {txRef, privateKey}

            verifyPayment(payload)
            .then(r => {
                if(r.status == 'success' && r.data.amount == amount){
                    const payments = new Payments({txtRef, flwRef, amount, status, appfee, fullname, email})
                    payments.save()
                    .then(result => {
                        User.findOneAndUpdate({email}, {balance: amount})
                        .then(r => {
                            res.send('Payment was successful!');
                        })
                    })
                    .catch(err => {
                        throw err
                    })
                }
            })
        }   
    }
}