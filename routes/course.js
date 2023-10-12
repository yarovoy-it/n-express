const {Router} = require('express')
const Course = require('../models/Course')
const {Types} = require("mongoose");
const router = Router()
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
    const courses = await Course.find()
    res.render('courses', {
        title: 'best course',
        isCourses: true,
        courses
    })
})

router.get('/:id/edit', auth,async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id)

    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.post('/edit', auth,async (req, res) => {
    await Course.findByIdAndUpdate(req.body.id, req.body)
    res.redirect('/courses')
})

router.post('/remove', auth,async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id
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
