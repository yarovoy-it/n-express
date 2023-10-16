const {Router} = require('express')
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Sung in',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect("login")

    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate?.password)
            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save((err) => {
                    if (err) throw err
                    res.redirect("/")
                })
            } else {
                res.redirect('/auth/login#login')
            }
        } else {
            res.redirect('/auth/login#login')
        }
    } catch (e) {

    }


})

router.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        const {email, password, confirm, name} = req.body
        const candidate = await User.findOne({email})

        if (candidate) {
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 4)
            const user = new User({
                email, name, password: hashPassword, basket: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        console.log(e)
    }
})

module.exports = router
