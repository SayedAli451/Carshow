require('dotenv').config()
// const dotenv = require('dotenv')
// dotenv.config()
const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const path = require('path')
const isSignedIn = require('./middleware/is-signed-in')
const passUserToView = require('./middleware/pass-user-to-view')
const upload = require("./config/multer"); // Import Multer

const port = process.env.PORT ? process.env.PORT : '3000'

// creates a connection to MONGO database
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// MIDDLEWARE
app.use(methodOverride('_method'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 7 * 24 * 60 * 60 // 1 week in seconds
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
        httpOnly: true,
        secure: false,
    }
}))
app.use(passUserToView)

// CONTROLLERS
const pagesCtrl = require('./controllers/pages')
const authCtrl = require('./controllers/auth')
const vipCtrl = require('./controllers/vip')
const carCtrl = require('./controllers/carshow')

// ROUTE HANDLERS
app.get('/', pagesCtrl.home)
app.get('/auth/sign-up', authCtrl.signUp)
app.post('/auth/sign-up', authCtrl.addUser)
app.get('/auth/sign-in', authCtrl.signInForm)
app.post('/auth/sign-in', authCtrl.signIn)
app.get('/auth/sign-out', authCtrl.signOut)
app.get('/vip-lounge', isSignedIn, vipCtrl.welcome)
app.use(isSignedIn)
// app.get('/carshow/allcar', carCtrl.allcar)
app.get('/carshow/index', carCtrl.index)
app.get('/carshow/new', carCtrl.newCars)
app.post('/carshow/:userId', upload.single("image"), carCtrl.creat)
app.get('/carshow/mycar', carCtrl.myCar)
app.get('/carshow/:carshowId', carCtrl.show)
app.delete('/carshow/:userId/:carshowId', carCtrl.deleteCar);
app.get('/carshow/:userId/:carshowId/edit', carCtrl.editCar)
app.put('/carshow/:userId/:carshowId', upload.single("imgl"), carCtrl.updateCar)

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}`)
})