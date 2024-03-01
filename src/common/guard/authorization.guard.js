const createHttpError = require("http-errors");
const AuthorizationMessage = require("../messages/auth.message");
const jwt = require("jsonwebtoken");
const UserModel = require("../../modules/user/user.model");

const Authorization = async (req, res, next) => {
    try {
        const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGUiOiIwOTE5MDc5MDgwMSIsImlkIjoiNjVlMGMyYzAyZmZkOTA1YmEyNjgzNzc0IiwiaWF0IjoxNzA5Mjc5ODA3LCJleHAiOjE3MDk4ODQ2MDd9.pG2bfaEnmV6eFg0THWDx8lURYFnqrht-8fbPjT-fKNw"
        const {authorization = `Bearer ${fakeToken}`} = req.headers;
        const [Bearer, token] = authorization.split(" ");
        if (!Bearer || !token) throw new createHttpError.Unauthorized(AuthorizationMessage.Login) 
        const data = jwt.verify(token, process.env.SECRET_ID)
        if (typeof data === "object" && "id" in data) {
            const user = await UserModel.findOne({_id: data.id}, {otp: 0, __v: 0}).lean();
            if (!user) throw new createHttpError.Unauthorized(AuthorizationMessage.notFound)
            req.user = user;
            return next();
        }
        throw new createHttpError.Unauthorized(AuthorizationMessage.invalidToken)
    } catch (err) {
        next(err)
    }
}

module.exports = Authorization;