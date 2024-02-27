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
            return {
                message: AuthMessage.sendOTPSuccessfully
            }
        } catch (err) {
            next(err)
        }
    }

    async checkOTP(req, res, next) {
        try {

        } catch (err) {
            next(err)
        }
    }
}


module.exports = new AuthController();