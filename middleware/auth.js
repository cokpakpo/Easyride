const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwt');

module.exports = {
     isLoggedIn: (req, res, next) => {
         let authorized = false;
         const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, jwtSecret.secret, (err, payload) => {
            if(!err){
            authorized = true;
            }
        })
        if(authorized){
            next();
        }
        else{
            res.status(401).send({message:'Invalid token'})
        }
        
    },

    validToken: (token) => {
        let valid = false
        jwt.verify(token, jwtSecret.secret, (err, payload) => {
            if(!err){
            valid = true;
            }
        })
        if(valid){
            return true
        }
        return false
    }
}