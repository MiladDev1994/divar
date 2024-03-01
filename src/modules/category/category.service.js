const autoBind = require("auto-bind");
const CategoryModel = require("./category.model");
const createHttpError = require("http-errors");
const { CategoryMessage } = require("./category.message");
const { isValidObjectId } = require("mongoose");
const { default: slugify } = require("slugify");
const OptionModel = require("../option/option.model");

class CategoryController {
    #model
    #optionModel
    constructor() {
        autoBind(this)
        this.#model = CategoryModel
        this.#optionModel = OptionModel
    }

    async find() {
        return await this.#model.find({parent: {$exists: false}}).populate([{path: "children", select: {name: 1, slug: 1}}])
    }

    async remove(id) {
        const category = await this.checkExistById(id)
        await this.#optionModel.deleteMany({category: id}).then(async () => {
            await this.#model.deleteMany({_id: id})
        })
        return true
    }

    async create(categoryDTO) {
        if (categoryDTO?.parent && isValidObjectId(categoryDTO.parent)) {
            const categoryExist = await this.checkExistById(categoryDTO.parent)
            console.log(categoryExist)
            const Parens = [...categoryExist.parents]
            Parens.push(categoryExist._id)
            categoryDTO.parents = Parens;
        }

        if (categoryDTO?.slug) {
            categoryDTO.slug = slugify(categoryDTO.slug)
            await this.alreadyExistBySlug(categoryDTO.slug)
        } else {
            categoryDTO.slug = slugify(categoryDTO.slug)
        }
        const category = await this.#model.create(categoryDTO);
        return category;
    }

    async checkExistById(id) {
        const category = await this.#model.findById(id);
        if (!category) throw new createHttpError.NotFound(CategoryMessage.NotFound) 
        return category
    }

    async checkExistBySlug(slug) {
        const category = await this.#model.findOne({slug});
        if (!category) throw new createHttpError.NotFound(CategoryMessage.NotFound) 
    }

    async alreadyExistBySlug(slug) {
        const category = await this.#model.findOne({slug});
        if (category) throw new createHttpError.Conflict(CategoryMessage.AlreadyExist) 
        return null
    }
}

module.exports = new CategoryController();