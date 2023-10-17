const {Router} = require('express')
const {validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const {registerValidators, loginValidators} = require("../utils/validators");

const router = Router()

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Sung in',
        isLogin: true,
        error: req.flash('error')
    })
})

router.get('/logout', loginValidators, async (req, res) => {
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
                req.flash('error', 'Uncorrected password')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('error', 'User not exist')
            res.redirect('/auth/login#login')
        }
    } catch (e) {

    }


})

router.post('/register',
    // body('email').isEmail(),
    registerValidators,
    async (req, res) => {
        try {
            const {email, password, confirm, name} = req.body
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                req.flash('error', errors.array()[0].msg)
                return res.status(422)
                    .redirect('/auth/login#register')
            }
            const hashPassword = await bcrypt.hash(password, 4)
            const user = new User({
                email, name, password: hashPassword, basket: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')

        } catch (e) {
            console.log(e)
        }
    })

module.exports = router
