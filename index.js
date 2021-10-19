require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path'); // need for html files
const csrf = require('csurf');
const flash = require('connect-flash');  // protects server requests
const compression = require('compression'); // compression of static files
const helmet = require('helmet');

const express = require('express');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const homeRoutes = require('./routes/home');
const aboutRoutes = require('./routes/about');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const addRoutes = require('./routes/add');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');

const app = express();

/* handlebars config part */
app.engine('hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    useUnifiedTopology: true,
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
}));

app.set('view engine', 'hbs');
app.set('views', 'views');

/* for read static files from public directory */
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(express.static('public'));

/* for getting parameters from post request */
app.use(express.urlencoded({extended: true}));

const store = new MongoStore({
    collection: 'sessions',
    uri: process.env.DATABASE_URL,
});

/* express session configs */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
}));

app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

/* Rout example
app.get('/', (req, res, next) => {
    // res.sendFile(path.join(__dirname, 'views', 'home.html')); // for html files
    res.render('home',{
        title: "Home",
        isHome: true
    }); // for hbs files
});
*/

/* Routes part */
app.use('/', homeRoutes);
app.use('/about', aboutRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

/*  connect database part */
async function start() {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch (e){
        console.log('Error:', e);
    }
}

start();