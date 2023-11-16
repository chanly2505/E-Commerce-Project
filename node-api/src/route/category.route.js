const contrl= require("../controller/category.controller")
const {userGuard} = require("../controller/auth.controller");
const category = (app,bas_route) => {
    app.get(bas_route,userGuard("category.Read"),contrl.getAll)
    app.get(`${bas_route}/:id` ,contrl.getOne)
    app.post(bas_route,contrl.create)
    app.put(bas_route,contrl.update)
    app.delete(`${bas_route}/:id`,userGuard("category.Delete") ,contrl.remove)
}
module.exports = category 
