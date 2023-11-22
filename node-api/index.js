const express = require("express")
const app = express()
app.use(express.json());
const cors = require("cors")

app.use(cors({
    origin:"*"  // fix has been block cors form client site repuest
}))

const employee = require("./src/route/employee.route")
const customer = require("./src/route/customer.route")
const  wishlist = require("./src/route/wishList.route")
const  paymentMethod = require("./src/route/payment_method.route")
const  orderStatus = require("./src/route/order_status.route")
const  product = require("./src/route/product.route")
const  cart = require("./src/route/cart.route")
const  order = require("./src/route/order.route")
const  category =require("./src/route/category.route")
const brand = require("./src/route/brand.route")
category(app,"/api/category")
employee(app,"/api/employee")
customer(app,"/customer")
wishlist(app)
paymentMethod(app)
orderStatus(app)
product(app,"/api/product")
cart(app,"/api/cart")
order(app,"/api/order")
brand(app, "/api/brand")
// require and defind port
app.listen(8081 , () => {
    console.log("HTTP Has been request in port 8081")
})