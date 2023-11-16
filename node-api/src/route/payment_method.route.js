const contrl= require("../controller/payment_method.controller")
const {userGuard} = require("../controller/auth.controller");
const {upload} = require("../service/fileUpload");
const paymentMethod = (app) => {
    app.get("/payment_meyhod" ,contrl.getAll)
    app.post("/payment_meyhod" ,upload.single("image"),contrl.create)
    app.delete("/payment_meyhod/:id" ,contrl.remove)
}
module.exports = paymentMethod;