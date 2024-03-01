const autoBind = require("auto-bind")
const createHttpError = require("http-errors");
const UserModel = require("../user/user.model");

class UserService {
    #model;
    constructor() {
        autoBind(this)
        this.#model = UserModel
    }
}

module.exports = new UserService();