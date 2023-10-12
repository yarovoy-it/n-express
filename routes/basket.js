const {Router} = require('express')
const Course = require("../models/Course");
const router = Router()
const auth = require('../middleware/auth')

router.post('/add', auth,async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToBasket(course)
    res.redirect('/basket')
})

function mapBasketItems(basket) {
    return basket.items.map((c) => ({
        ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count
    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.get('/', auth,async (req, res) => {
    const user = await req.user
        .populate('basket.items.courseId')

    const courses = mapBasketItems(user.basket)
    res.render('basket', {
        title: "Basket",
        isBasket: true,
        courses: courses,
        price: computePrice(courses)
    })
})


router.delete('/remove/:id', auth,async (req, res) => {
    await req.user.removeFromBasket(req.params.id)
    const user = await req.user.populate('basket.items.courseId')
    const courses = mapBasketItems(user.basket)

    const basket = {
        courses,
        price: computePrice(courses)
    }

    res.status(200).json(basket)
})

module.exports = router
