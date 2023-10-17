const {body, validationResult} = require("express-validator");
const User = require("../models/user");

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Enter correct email')
        .custom(async (value, {req}) => {
            try {
                const candidate = await User.findOne({email: value})
                if (candidate) {
                    return Promise.reject('User already exist with this email')
                }
            } catch (e) {
                console.log(e)
            }
        })
        .normalizeEmail(),
    body('password', 'wrong password')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Password has to be same')
            }
            return true
        })
        .trim(),
    body('name')
        .isLength({min: 3, max: 56})
        .withMessage('wrong name')
        .trim(),
]

exports.loginValidators = [
    body('email')
        .isEmail()
        .withMessage('Enter correct email')
        .custom(async (value, {req}) => {
            try {
                const candidate = await User.findOne({email: value})
                if (candidate) {
                    return Promise.reject('User not found')
                }
            } catch (e) {
                console.log(e)
            }
        })
        .normalizeEmail(),
    body('password', 'wrong password')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
]

exports.courseValidators = [
    body('title')
        .isLength({min: 3})
        .withMessage('Min title 3 chapters')
        .trim(),
    body('price')
        .isNumeric()
        .withMessage('Only numbers'),
    body('img', 'url img')
        .isURL()
        .trim(),
]
