const authController = require("../app/http/controllers/authController");
const auth = require("../app/http/middlewares/auth");
const guest = require("../app/http/middlewares/guest");

function initRoutes(app) {
    app.get("/login",guest, authController().login);
app.post("/login", authController().postLogin);

app.get("/register",guest, authController().register);
app.post("/register",  authController().postRegister);
app.post("/logout",  authController().logout);
}

module.exports = initRoutes;