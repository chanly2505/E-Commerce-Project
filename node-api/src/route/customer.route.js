const contrl= require("../controller/customer.controller")
const {userGuard} = require("../controller/auth.controller");
const customer = (app,route_name) => {
    app.get(route_name ,userGuard("customer.Read") ,contrl.getAll)
    app.get(`${route_name}:/id`,contrl.getOne)
    app.post(route_name,userGuard("customer.Create"),contrl.create)
    app.put(route_name ,contrl.update)
    app.post(`${route_name}/auth/login`,contrl.login)
    app.delete(`${route_name}:/id` ,contrl.remove)

    //Route Customer Address...
    app.get(`${route_name}/customer_address/:id` ,contrl.getOneAdd)
    app.get(`${route_name}/customer_address` ,contrl.getListAdd)
    app.post(`${route_name}/customer_address` ,contrl.newAddress)
    app.put(`${route_name}/customer_address` ,contrl.updateAddress)
    app.delete(`${route_name}/customer_address/id` ,contrl.removeAddress)
}
module.exports = customer 
