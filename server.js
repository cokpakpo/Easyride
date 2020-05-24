require('dotenv').config()
const express = require('express')
const app = express();
const http = require('http').Server(app)
const cors = require('cors');
const passport = require('passport')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const io = require('socket.io')(http)
const PORT = process.env.PORT;
const db = require('./config/db')

mongoose.connect(db.url, {useNewUrlParser:true}).then(() => console.log('DB connected...'))
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(passport.initialize())

require('./config/passport')(passport)
app.use(express.static('public'))
app.use(express.static('profileImage'))
app.set('view engine', 'ejs')

require('./routes')(app, passport)

io.on('connection', require('./routes/sockets'))

http.listen(PORT || 3000, () => {
    console.log('app runing of port', PORT)
})



