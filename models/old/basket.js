const path = require("path");
const fs = require("fs");


const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'basket.json'
)

class Basket {
    static async add(course) {
        const basket = await Basket.fetch()

        const idx = basket.courses.findIndex(c => c.id === course.id)
        const candidate = basket.courses[idx]

        if (candidate) {
            candidate.count++
            basket.courses[idx] = candidate
        } else {
            course.count = 1
            basket.courses.push(course)
        }
        basket.price+= Number(course.price)

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(basket), err => {
                if(err){
                    reject(err)
                }else{
                    resolve()
                }
            })
        })
    }

    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(content))
                }

            })
        })
    }

    static async remove(id) {
        const basket = await Basket.fetch()

        const idx = basket.courses.findIndex(c => c.id === id)
        const course = basket.courses[idx]

        if(course.count === 1){
            basket.courses = basket.courses.filter(c => c.id !== id)
        }else{
            basket.courses[idx].count--
        }

        basket.price -= course.price

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(basket), err => {
                if(err){
                    reject(err)
                }else{
                    resolve(basket)
                }
            })
        })
    }
}

module.exports = Basket

