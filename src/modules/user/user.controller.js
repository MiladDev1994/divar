const autoBind = require("auto-bind")
const userService = require("./user.service")
const { AuthMessage } = require("./user.message")

class UserController {
    #service
    constructor() {
        autoBind(this)
        this.#service = userService
    }
    async whoami(req, res, next) {
        try {
            const user = req.user;
            return res.json(user)
        } catch (err) {
            next(err)
        }
    }
}


module.exports = new UserController();