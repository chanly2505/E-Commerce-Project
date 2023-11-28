const contrl= require("../controller/product_image.controller")
const {userGuard} = require("../controller/auth.controller");
const {upload} = require("../service/fileUpload");
const product_image = (app,base_route) => {
    app.get(`${base_route}` ,contrl.getAll)
    app.post(`${base_route}`,upload.single("image"),contrl.create)
    app.delete(`${base_route}/:id `,contrl.remove)
}
module.exports = product_image;