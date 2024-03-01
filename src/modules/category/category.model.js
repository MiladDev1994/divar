const {Schema, model, Types} = require("mongoose");

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        index: true, // برای افزایش سرعت در کوئری زدن
    },
    icon: {
        type: String,
        required: true,
    },
    parent: {
        type: Types.ObjectId,
        ref: "Category",
        required: false,
    },
    parents: {
        type: [Types.ObjectId],
        required: true,
        default :[]
    }
}, {versionKey: false, id: false, toJSON:{virtuals: true}});

CategorySchema.virtual("children", {
    ref: "Category",
    localField: "_id",
    foreignField: "parent"
})

function autoPopulate(next) {
    this.populate([{path: "children", select: {name: 1, slug: 1}}])
    next()
}


CategorySchema.pre("find", autoPopulate).pre("findOne", autoPopulate)

const CategoryModel = model("Category", CategorySchema);

module.exports = CategoryModel;