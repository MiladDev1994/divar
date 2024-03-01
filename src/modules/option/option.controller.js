const autoBind = require("auto-bind");
const optionService = require("./option.service");
const { OptionMessage } = require("./option.message");
const httpCodes = require("http-codes")

class OptionController {
    #service
    constructor() {
        autoBind(this)
        this.#service = optionService
    }


    async create(req, res, next) {
        try {
            const {title, key, guid, enum: list, type, category, required} = req.body
            await this.#service.create({title, key, guid, enum: list, type, category, required})
            return res.status(httpCodes.CREATED).json({
                message: OptionMessage.Created
            })
        } catch (err) {
            next(err)
        }
    }

    async update(req, res, next) {
        try {
            const {title, key, guid, enum: list, type, category, required} = req.body
            const {id} = req.params
            await this.#service.update(id, {title, key, guid, enum: list, type, category, required})
            return res.json({
                message: OptionMessage.Updated
            })
        } catch (err) {
            next(err)
        }
    }

    async findByCategoryId(req, res, next) {
        try {
            const {categoryId} = req.params;
            const option = await this.#service.findByCategoryId(categoryId)
            return res.json(option)
        } catch (err) {
            next(err)
        }
    }

    async findById(req, res, next) {
        try {
            const {id} = req.params;
            const option = await this.#service.findById(id)
            return res.json(option)
        } catch (err) {
            next(err)
        }
    }


    async removeById(req, res, next) {
        try {
            const {id} = req.params;
            await this.#service.removeById(id)
            return res.json({
                message: OptionMessage.Deleted
            })
        } catch (err) {
            next(err)
        }
    }

    async findByCategorySlug(req, res, next) {
        try {
            const {slug} = req.params;
            const option = await this.#service.findByCategorySlug(slug)
            return res.json(option)
        } catch (err) {
            next(err)
        }
    }

    async find(req, res, next) {
        try {
            const orders = await this.#service.find()
            return res.json(orders)
        } catch (err) {
            next(err)
        }
    }
}


module.exports = new OptionController();
