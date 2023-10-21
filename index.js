const express = require('express')
const path = require('path')
const csurf = require('csurf')
const flash = require('connect-flash')
const exphbs = require('express-handlebars')
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const courseRoutes = require('./routes/course')
const basketRoutes = require('./routes/basket')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')

const varMiddleWare = require('./middleware/variables')
const userMiddleWare = require('./middleware/user')
const errorMiddleWare = require('./middleware/error')
const fileMiddleWare = require('./middleware/file')
const {MONGODB_URI, SECRET} = require("./keys");

const app = express()

const store = new MongoStore({
    uri: MONGODB_URI,
    collection: 'session'
})

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: require('./utils/hbs-healpers')
})

//register
app.engine('hbs', hbs.engine)
// use
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
// app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleWare.single('avatar'))
app.use(csurf())
app.use(flash())
app.use(helmet());
app.use(compression());
app.use(varMiddleWare)
app.use(userMiddleWare)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', courseRoutes)
app.use('/basket', basketRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorMiddleWare)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
        // const candidat = await User.findOne()
        // if (!candidat) {
        //     const user = new User({
        //         email: 'yy@gmail.com',
        //         name: 'yura',
        //         cart: {items: []}
        //     })
        //     await user.save()
        // }
        app.listen(PORT, () => {
            console.log(`Server was started on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()


