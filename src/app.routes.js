const {Router} = require("express")
const mainRouter = Router();

const { AuthRouter } = require("./modules/auth/auth.routes");
const { UserRouter } = require("./modules/user/user.routes");
const { CategoryRouter } = require("./modules/category/category.routes");
const { OptionRouter } = require("./modules/option/option.routes");
mainRouter.use("/auth", AuthRouter)
mainRouter.use("/user", UserRouter)
mainRouter.use("/category", CategoryRouter)
mainRouter.use("/option", OptionRouter)

module.exports = mainRouter;