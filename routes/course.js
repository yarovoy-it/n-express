const {Router} = require('express')
const Course = require('../models/course')
const {Types} = require("mongoose");
const router = Router()
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('userId', 'email name')
            .select('price title img');

        res.render('courses', {
            title: 'best course',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses
        })
    } catch (e) {
        console.log(e)
    }

})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id)
    if (course.userId.toString() !== req.user._id.toString()){
        return res.redirect('/courses')
    }
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.post('/edit', auth, async (req, res) => {

    const courseId = req.body.id
    const course = await Course.findById(courseId)

    if (course.userId.toString() !== req.user._id.toString()){
        return res.redirect('/courses')
    }
    Object.assign(course, req.body)
    course.save()
    // await Course.findByIdAndUpdate(courseId, req.body)
    res.redirect('/courses')
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        })
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }

})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

module.exports = router
