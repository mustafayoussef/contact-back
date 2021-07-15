const userRoutes = require("express").Router();
const user = require("../controllers/user.controller");
const auth = require("../middleware/auth");

userRoutes.post("/register", user.register);
userRoutes.post("/login", user.login);
userRoutes.post("/logout", auth, user.logout);


module.exports = userRoutes;
