const orderCtrl = require("../controller/order.controller")
const {userGuard} = require("../controller/auth.controller");

const order = (app,route_name) =>{
    app.get(route_name , userGuard,orderCtrl.getOrder)
    app.get(`${route_name}/:id`, userGuard,orderCtrl.getOrderByID)
    app.get(`${route_name}/customer_order/:id`, userGuard,orderCtrl.getOrderByCustomerID)
    app.put(`${route_name}` , userGuard,orderCtrl.updateOrder)
    app.put(`${route_name}` , userGuard,orderCtrl.updateOrder)
    app.post(route_name, userGuard,orderCtrl.addOrder)
    app.delete(`${route_name}/:id`, userGuard,orderCtrl.removeOrder)
}
module.exports = order
