const productCtrl = require("../../src/controller/product.controller")

const product = (app,route_name) =>{
    app.get(`${route_name}` , productCtrl.productgetList)
    app.get(`${route_name}/:id` , productCtrl.productgetOne)
    app.post(`${route_name}`, productCtrl.productcreate)
    app.put(`${route_name}` , productCtrl.productupdate)
    app.delete(`${route_name}`, productCtrl.productdeleted)
    app.post(`${route_name}/change_status`,productCtrl.changeProductStatus)


}
module.exports = product
