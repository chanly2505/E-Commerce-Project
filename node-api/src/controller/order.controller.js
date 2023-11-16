const db = require("../util/db")
const {isEmptyOrNUll,invoiceNumber} = require("../service/service");

const generateInvoiceNo = async () => {
    const data = await db.query(" SELECT MAX( order_id ) as id FROM `order`; ");
    return invoiceNumber(data[0].id) //null 1 , 2, 3
}

const getOrder = async (req,res) =>{
    const listOrder = await db.query("SELECT * FROM `order`")
    res.json({
        ListOrder:listOrder
    })
}
const  getOrderByID = async (req,res) => {
    const listOneOrder = await db.query("SELECT * FROM `order` WHERE order_id=?",[req.params.id])
    res.json({
        ListOneOrder:listOneOrder
    })
}
const getOrderByCustomerID = async (req,res) =>{
    const {customer_id}=req.body;
    const  list= await db.query("SELECT * FROM `order` WHERE customer_id=?" , [customer_id])
    res.json({
        list:list
    })

}

const addOrder = async (req,res) =>{
    try {
        db.beginTransaction()
        const {
            customer_id,customer_address_id,payement_methode_id,comment,
        } = req.body;
        var message={}
        if (isEmptyOrNUll(customer_id)){message.customer_id="Customer Id Require"}
        if (isEmptyOrNUll(customer_address_id)){message.customer_address_id="Customer address Id Require"}
        if (isEmptyOrNUll(payement_methode_id)){message.payement_methode_id="payement_methode_idc Require"}
        if (Object.keys(message).length > 0){
            res.json({
                message:message,
                error:true
            })
            return 0
        }
        //Find customer address by customer_address_id from client
        var address = await db.query("SELECT * FROM `customer_address` WHERE customer_address_id=?",[customer_address_id])
        if (address?.length > 0) {
            const {firstname,lastname,tel,address_des}=address[0]
            // find total_order => need getCartInfo by customer
            var product = await db.query("SELECT c.*, p.price FROM cart c  INNER JOIN product p ON (c.product_id = p.product_id)  WHERE c.customer_id = ?",[customer_id]);

            if (product?.length > 0) {
                var order_total=0
                product.map((item, index) => {
                    order_total += (item.quantity * item.price)
                })
                var order_status_id = 1
                var inv_no = await generateInvoiceNo()
                var sqlOrder = "INSERT INTO `order` (customer_id, payement_methode_id, order_status_id , invoice_no, comment, order_total, firstname, lastname, telelphone, address_des) VALUES (?,?,?,?,?,?,?,?,?,?)";
                var sqlOrderParam = [customer_id, payement_methode_id, order_status_id, inv_no, comment, order_total, firstname, lastname, tel, address_des]
                const order = await db.query(sqlOrder, sqlOrderParam)
                product.map(async (item, index) => {
                    var sqlOrderDetails = "INSERT INTO order_detail (order_id,product_id,quantity,price) VALUES (?,?,?,?)"
                    var sqlOrderDetailsParam = [order.insertId, item.product_id, item.quantity, item.price];
                    const orderDetail = await db.query(sqlOrderDetails,sqlOrderDetailsParam)

                    // cut stock from table product
                    var sqlProdut = "UPDATE product SET quantity=(quantity-?) WHERE product_id = ?"
                    var updatePro = await db.query(sqlProdut,[item.quantity,item.product_id])
                })
                await db.query("DELETE FROM `cart` WHERE customer_id = ?", [customer_id])


                res.json({
                    message: "Your order has been successfully!",
                    data: order
                })
                db.commit();
            }else {
                res.json({
                    message:"Not Item In Cart",
                    error:true
                })
            }
        }else {
            res.json({
                message:"Please Select Address",
                error:true
            })
        }
    }catch (e) {
        db.rollback()
        res.json({
            message:e,
            error:true
        })
    }

}
const updateOrder = async (req,res) =>{

}
const removeOrder = async (req,res) =>{

}
module.exports ={
    getOrder,
    getOrderByID,
    addOrder,
    updateOrder,
    removeOrder,
    getOrderByCustomerID
}
// customer_id	,
// order_status_id,
// payement_methode_id	,
// invoice_no	,
// order_total	,
// comment	,
//address_id,


// firstname,
// lastname,
// telelphone,
// address_des,
//order_id
//get Crat by customer => (porduct_id,quantity, price)