const cartCtrl = require("../../src/controller/cart.controller")

const cart = (app,route_name) =>{
    app.get(`${route_name}/cart1` , cartCtrl.getCartByCustomer)
    app.post(`${route_name}`, cartCtrl.addCart)
    app.put(`${route_name}` , cartCtrl.updateCart)
    app.delete(`${route_name}/:id`, cartCtrl.removeCart)
}
module.exports = cart
