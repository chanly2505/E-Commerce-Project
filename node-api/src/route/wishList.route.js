const contrl= require("../controller/wishlist.controller")
const wishList = (app) => {
    app.get("/wishlist" ,contrl.getAll)
    app.post("/wishlist" ,contrl.create)
    app.delete("/wishlist/:id" ,contrl.remove)
}
module.exports = wishList;
