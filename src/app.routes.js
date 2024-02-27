const {Router} = require("express")
const mainRouter = Router();

const AuthRouter = require("./modules/auth/auth.routes")
mainRouter.use("/auth", mainRouter)

module.exports = mainRouter;