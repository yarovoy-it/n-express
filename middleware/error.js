const User = require("../models/user");
module.exports = async function (req, res, next) {
    res.status(404)
        .render('404', {
            title: 'Page not found'
        })
}
