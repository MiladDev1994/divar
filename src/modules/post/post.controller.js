const autoBind = require("auto-bind");
const { PostMessage } = require("./post.message");
const httpCodes = require("http-codes");
const postService = require("./post.service");

class PostController {
    #service
    constructor() {
        autoBind(this)
        this.#service = postService
    }


    async create(req, res, next) {
        try {
        } catch (err) {
            next(err)
        }
    }

    async find(req, res, next) {
        try {
        } catch (err) {
            next(err)
        }
    }

    async remove(req, res, next) {
        try {
            const {id} = req.params
        } catch (err) {
            next(err)
        }
    }
}


module.exports = new PostController();
