const autoBind = require("auto-bind");
const categoryService = require("./category.service");
const { CategoryMessage } = require("./category.message");
const httpCodes = require("http-codes")

class CategoryController {
    #service
    constructor() {
        autoBind(this)
        this.#service = categoryService
    }


    async create(req, res, next) {
        try {
            const {name, icon, slug, parent} = req.body
            await this.#service.create({name, icon, slug, parent})
            return res.status(httpCodes.CREATED).json({
                message: CategoryMessage.Created
            })
        } catch (err) {
            next(err)
        }
    }

    async find(req, res, next) {
        try {
            const categories = await this.#service.find()
            return res.json(categories)
        } catch (err) {
            next(err)
        }
    }

    async remove(req, res, next) {
        try {
            const {id} = req.params
            const categories = await this.#service.remove(id)
            return res.json({
                message: CategoryMessage.Deleted
            })
        } catch (err) {
            next(err)
        }
    }
}


module.exports = new CategoryController();
