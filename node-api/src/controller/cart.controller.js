 const db = require("../util/db")
const {isEmptyOrNUll} = require("../service/service");

const getCartByCustomer = async (req,res) =>{
    const  {customer_id} = req.body;
    // var sql = "SELECT c.cart_id,c.quantity,p.* FROM cart c"
    // sql+= "INNER JOIN product p ON (c.product_id = p.product_id)"
    // sql+= "WHERE c.customer_id= ? "
    var sql = "SELECT c.cart_id, c.quantity, p.* FROM cart c"
    sql += " INNER JOIN product p ON (c.product_id = p.product_id)"
    sql += " WHERE c.customer_id = ?"
    var data = await db.query(sql,[customer_id])
    res.json({
        ListCart:data
    })
}
const addCart = async (req,res) =>{
    const  {
        // cart_id,
        customer_id,
        product_id,
        quantity,
    }= req.body
    var message= {}
    // if (isEmptyOrNUll(cart_id)){message.cart_id ="Customer id Require"}
    if (isEmptyOrNUll(customer_id)){message.customer_id ="Customer id Require"}
    if (isEmptyOrNUll(product_id)){message.product_id= "Product id Require"}
    if (isEmptyOrNUll(quantity)){message.quantity="Quantity Require"}
    if (Object.keys(message).length > 0){
        res.json ({
            error : true,
            message : message
        })
    }
    // var sql= "UPDATE cart SET quantity=(quantity+?) WHERE cart_id=?"
    var sql = "INSERT INTO cart (customer_id,product_id,quantity) VALUES (?,?,?)"
    var param= [customer_id,product_id,quantity]
    var data = await db.query(sql,param)
    res.json({
        message: (data.affectedRows !=0 )? "Cart has Add Success" : "Id Not Found",
        data:data
    })

}
const updateCart = async (req,res) =>{
    const {
        cart_id,
        quantity
    }=req.body
    var message ={}
    if ((isEmptyOrNUll(cart_id))){message.cart_id="Cart Require"}
    if (isEmptyOrNUll(quantity)){message.quantity="Quantity Require"}
    if (Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
    }
    var sql = "UPDATE cart SET quantity=(quantity+?) WHERE cart_id=?"
    var param = [quantity,cart_id]
    var data = await db.query(sql,param)
    res.json({
        message: (data.affectedRows !=0 )? "Cart has Update Success" : "Id Not Found",
        data:data
    })
}
const removeCart = async (req,res) =>{
    var cart_id =req.params.id
    var sql = "DELETE FROM cart WHERE cart_id=?"
    var data = await db.query(sql,cart_id)
    res.json({
        message: (data.affectedRows !=0 )? "Cart has Delete Success" : "Id Not Found",
        data:data
    })
}
module.exports ={
    getCartByCustomer,
    addCart,
    updateCart,
    removeCart
}