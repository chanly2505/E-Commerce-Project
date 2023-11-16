const  db = require("../util/db")
const { isEmptyOrNUll } = require("../service/service")

const getAll  = async (req,res) => {
    const {customer_id} =req.body
     var spl = "SELECT * FROM wishlist WHERE customer_id= ?"
    const list=await db.query(spl, [customer_id])
    res.json({
        list:list
    })

}
const create  =async (req,res) => {
    var {customer_id,product_id}= req.body
    var message ={}
    if (isEmptyOrNUll(customer_id)){message.customer_id="Customer id Require"}
    if (isEmptyOrNUll(product_id)){message.product_id="Product ID Require"}
    if (Object.keys(message).length > 0) {
        res.json({
            error:"Data Require",
            message:message
        })
    }
    var sql = "INSERT INTO wishlist (customer_id , product_id) VALUES (?,?) "
    var param = [customer_id,product_id]
    var data = await db.query(sql,param)
    res.json ({
        message : "WhishList has Been add",
        data:data
    })
}
const remove  =async (req,res) => {
    const {wishlist_id}= req.body.id
    var sql = "DELETE FROM wishlist WHERE wishlist_id=?"
    var data = await  db.query(sql,[wishlist_id])
    res.json({
        message : "Data Has Deleted",
        data :data
    })
}

module.exports= {
    getAll,
    create,
    remove,
}
