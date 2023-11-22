const brandCtrl = require("../../src/controller/brand.controller")

const brand = (app,route_name) =>{
    app.get(`${route_name}/cart1` , brandCtrl.getAll)
    app.post(`${route_name}`, brandCtrl.create)
    app.put(`${route_name}` , brandCtrl.update)
    app.delete(`${route_name}/:id`, brandCtrl.remove)
}
module.exports = brand
    