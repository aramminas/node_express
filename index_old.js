require('dotenv').config();
const express = require('express');
const path = require('path'); // need for html files
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');

const homeRoutes = require('./routes/home');
const aboutRoutes = require('./routes/about');
const cardRoutes = require('./routes/card');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');

const app = express();

/* handlebars config part */
const hbs = exphbs.create({
    defaultLayout: 'main', // adding layout
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

/* for read static files from public directory */
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

/* for getting parameters from post request */
app.use(express.urlencoded({extended: true}));


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

const PORT = process.env.PORT || 3000;
/*  connect database part */
async function start() {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch (e){
        console.log('Error:', e);
    }
}

start();