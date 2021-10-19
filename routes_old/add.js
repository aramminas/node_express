const {Router} = require('express');
const Course = require('../models/curses');
const router = Router();

router.get('/', (req, res) => {
    res.render('add',{
        title: "Add new Course",
        isAdd: true
    });
});

router.post('/', async (req, res) => {
    const course = new Course(req.body.title, req.body.price, req.body.img);
    await course.save();
    console.log('course',course)
    // res.redirect('/courses');
});

module.exports = router;