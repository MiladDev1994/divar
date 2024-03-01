const autoBind = require("auto-bind")
const createHttpError = require("http-errors");
const UserModel = require("../user/user.model");
const { AuthMessage } = require("./auth.message");
const {randomInt} = require("crypto");
const jwt = require("jsonwebtoken")

class AuthService {
    #model;
    constructor() {
        autoBind(this)
        this.#model = UserModel
    }
    async sendOTP(mobile) {
        const user = await this.checkExistByMobile(mobile);
        const now = new Date().getTime();
        const otp = {
            code: randomInt(10000, 99999),
            expiresIn: now + (1000 * 60 * 3)
        }
        if (!user) {
            const newUser = await this.#model.create({mobile, otp })
            return newUser;
        }
        // if (user.otp && user.otp.expiresIn > now) {
        //     throw new createHttpError.BadRequest(AuthMessage.otpCodeNotExpired)
        // }
        user.otp = otp;
        await user.save();
        return user;
    }

    async checkOTP(mobile, code) {
        const user = await this.checkExistByMobile(mobile);
        const now = new Date().getTime();
        if (user?.otp?.expiresIn < now) throw new createHttpError.Unauthorized(AuthMessage.otpCodeExpired);
        if (user?.otp?.code !== code) throw new createHttpError.Unauthorized(AuthMessage.otpCodeIsIncorrect);
        if (!user.verifiedMobile) {
            user.verifiedMobile = true
            user.save()
        }
        const accessToken = this.signToken({mobile, id: user._id})
        return accessToken
    }

    async checkExistByMobile(mobile) {
        const user = await this.#model.findOne({mobile});
        // if (!user) throw new createHttpError.NotFound(AuthMessage.notFound)
        if (!user) return false
        return user;
    }

    signToken(payload) {
        return jwt.sign(payload, process.env.SECRET_ID, {expiresIn: "1w"})
    }
}

module.exports = new AuthService();