const autoBind = require("auto-bind");
const createHttpError = require("http-errors");
const { PostMessage } = require("./post.message");
const OptionModel = require("../option/option.model");
const PostModel = require("./post.model");


class PostService {
    #model
    #optionModel
    constructor() {
        autoBind(this)
        this.#model = PostModel
        this.#optionModel = OptionModel
    }
}

module.exports = new PostService();