const contrl= require("../controller/order_status.controller")
const paymentMethod = (app) => {
    app.get("/order_status" ,contrl.getAll)
    app.post("/order_status" ,contrl.create)
    app.delete("/order_status/:id" ,contrl.remove)
}
module.exports = paymentMethod;
