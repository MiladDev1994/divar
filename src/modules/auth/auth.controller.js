const autoBind = require("auto-bind")
const authService = require("./auth.service")
const { AuthMessage } = require("./auth.message")

class AuthController {
    #service
    constructor() {
        autoBind(this)
        this.#service = authService
    }
    async sendOTP(req, res, next) {
        try {
            const {mobile} = req.body;
            await this.#service.sendOTP(mobile)
            return res.json({
                message: AuthMessage.sendOTPSuccessfully
            })
        } catch (err) {
            next(err)
        }
    }

    async checkOTP(req, res, next) {
        try {
            const {mobile, code} = req.body;
            const token = await this.#service.checkOTP(mobile, code)
            return res.json({
                message: AuthMessage.loginSuccessfully,
                token
            })

        } catch (err) {
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            // من توکن رو تو فرانت نگه میدارم
            res.json("من توکن رو تو فرانت نگه میدارم")
        } catch (err) {
            next(err)
        }
    }
}


module.exports = new AuthController();