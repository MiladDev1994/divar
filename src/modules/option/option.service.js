const autoBind = require("auto-bind");
const OptionModel = require("./option.model");
const CategoryModel = require("./../category/category.model");
const createHttpError = require("http-errors");
const { OptionMessage } = require("./option.message");
const { default: slugify } = require("slugify");
const { isTrue, isFalse } = require("../../common/utils/function");
const { isValidObjectId } = require("mongoose");

class OptionService {
    #optionModel
    #categoryModel
    constructor() {
        autoBind(this)
        this.#optionModel = OptionModel
        this.#categoryModel = CategoryModel
    }

    async find() {
        const options = await this.#optionModel.find({}, {__v: 0}, {dort: {_id: -1}}).populate({path: "category", select: {name: 1, slug: 1}})
        return options;
    }

    async create(optionDTO) {
        const category = await this.checkExistById(optionDTO.category);
        optionDTO.category = category._id;
        optionDTO.key = slugify(optionDTO.key, {trim: true, replacement: "_", lower: true});
        await this.alreadyExistByCategoryAndKey(optionDTO.key, optionDTO._id);

        if (optionDTO.enum && typeof optionDTO.enum === "string") {
            optionDTO.enum = optionDTO.enum.split(",");
        } else if (!Array.isArray(optionDTO.enum)) optionDTO.enum = [];

        if (isTrue(optionDTO?.required)) optionDTO.required = true 
        if (isFalse(optionDTO?.required)) optionDTO.required = false 
        const option = await this.#optionModel.create(optionDTO) 
        return option;
    }

    async update(id, optionDTO) {
        const existOption = await this.checkExistById(id);
        if (optionDTO.category && isValidObjectId(optionDTO.category)) {
            const category = await this.checkExistById(optionDTO.category);
            optionDTO.category = category._id;
        } else {
            delete optionDTO.category
        }
        if (optionDTO.slug) {
            optionDTO.key = slugify(optionDTO.key, {trim: true, replacement: "_", lower: true});
            let categoryId = existOption.category
            if (optionDTO.category) categoryId = optionDTO.category
            await this.alreadyExistByCategoryAndKey(optionDTO.key, categoryId);
        }

        if (optionDTO?.enum && typeof optionDTO.enum === "string") {
            optionDTO.enum = optionDTO.enum.split(",");
        } else if (!Array.isArray(optionDTO.enum)) delete optionDTO.enum;

        if (isTrue(optionDTO?.required)) optionDTO.required = true 
        else if (isFalse(optionDTO?.required)) optionDTO.required = false 
        else delete optionDTO?.required

        await this.#optionModel.updateOne({_id: id}, {$set: optionDTO})
        const option = await this.#optionModel.create(optionDTO) 
        return option;
    }

    async findById(id) {
        // await this.checkExistById(id)
        const option = await this.#optionModel.findById(id).populate({path: "category", select: {name: 1, slug: 1}})
        return option
    }

    async removeById(id) {
        // await this.checkExistById(id)
        return await this.#optionModel.deleteOne({_id: id})
    }

    async findByCategoryId(category) {
        return await this.#optionModel.find({category}).populate({path: "category", select: {name: 1, slug: 1}})
    }

    async findByCategorySlug(slug) {
        const options = await this.#optionModel.aggregate([
            {
                $lookup: {
                    from: "categories", // باید دقیقا اسم دیتا بیس باشه
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $addFields: {
                    categorySlug: "$category.slug" ,
                    categoryName: "$category.name" ,
                    categoryIcon: "$category.icon" 
                }
            },
            {
                $project: {
                    // "category.parent": 0,
                    // "category.parents": 0,
                    // "category._id": 0,
                    // "category.slug": 0,
                    // "category.name": 0,
                    // "category.icon": 0,
                    __v: 0,
                    category: 0 // میتونیم کلا کتگوری رو حذف کنیم
                }
            },
            {
                $match: {
                    categorySlug: slug
                }
            }
        ])
        return options
    }

    async checkExistById(id) {
        const category = await this.#categoryModel.findById(id);
        if (!category) throw new createHttpError.NotFound(OptionMessage.NotFound);
        return category; 
    }

    async alreadyExistByCategoryAndKey(key, category) {
        const isExist = await this.#optionModel.findOne({category, key});
        if (isExist) throw new createHttpError.Conflict(OptionMessage.AlreadyExist);
        return null; 
    }
}

module.exports = new OptionService();