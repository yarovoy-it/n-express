const {Router} = require('express')
const Order = require('../models/Order')
const router = Router()
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
    try{
        const orders = await Order.find({
            'user.userId': req.user._id
        })
            .populate('user.userId')
        res.render('orders', {
            title: 'Orders',
            isOrder: true,
            orders: orders.map(order => {

                return {
                    ...order._doc,
                    price: order.courses.reduce((total, course)=>{
                        return total += course.count * course.course.price
                    }, 0)
                }
            })
        })
    } catch (e) {
        console.log(e)
    }

})

router.post('/', auth,async (req, res) => {

    try {

        const user = await req.user
            .populate('basket.items.courseId')

        const courses = user.basket.items.map(c => ({
            count: c.count,
            course: {...c.courseId._doc}
        }))

        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses
        })

        await order.save()
        await req.user.clearBasket()

        res.redirect('/orders')
    } catch (e) {
        console.log(e)

    }
})

module.exports = router
