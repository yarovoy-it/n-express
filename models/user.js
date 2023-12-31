const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: String,
    avatarUrl: String,
    password: {
        type: String,
        required: true
    },
    basket: {
        items: [
            {
                count: {
                    type: Number,
                    required: true,
                    default: 1
                },
                courseId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required: true
                }

            }
        ]
    }
})

userSchema.methods.addToBasket = function (course) {
    const items = [...this.basket.items]
    const idx = items.findIndex(c => {
        return c.courseId.toString() === course._id.toString()
    })

    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }

    this.basket = {items}

    return this.save()
}

userSchema.methods.removeFromBasket = function (id) {
    let items = [...this.basket.items]
    const idx = items.findIndex(c => c.courseId.toString() === id)
    if (items[idx].count === 1) {
        items = items.filter(c => c.courseId.toString() !== id)
    } else {
        items[idx].count--
    }
    this.basket = {items}
    return this.save()
}

userSchema.methods.clearBasket = function () {
    this.basket = {items: []}
    return this.save()
}

module.exports = model('User', userSchema)
