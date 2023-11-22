const db = require("../util/db")
const {isEmptyOrNUll} = require("../service/service");
const productgetList =async (req , res)=>{
    var sql = "SELECT p.*, c.name as category_name FROM product p "+
    "INNER JOIN category c ON (p.category_id = c.category_id) "
    var sqlCategory= "SELECT * FROM category "
    // var sqlBrand ="SELECT * FROM brand"
    var data =await db.query(sql)
    var category = await  db.query(sqlCategory)
    // var brand = await db.query(sqlBrand)
    res.json({
        list:data,
        listCategory:category,
        // brand:brand
    })
}
const productgetOne =async (req , res) => {
    var produtcId= req.params.id
    var sql = "SELECT * FROM product WHERE product_id=?"
    var data = await db.query(sql,[produtcId])
    res.json({
        listOneID:data
    })
}
const productcreate =async (req , res) => {
    var {
        category_id,
        barcode	,
        name,
        quantity,
        price,
        description,
        is_active,
    }=req.body
    var filename = null
    if (req.file) {
        filename= req.file.filename
    }
    var message={}
    if(isEmptyOrNUll(category_id)){message.category_id="Require Category Id"}
    if(isEmptyOrNUll(barcode)){message.barcode="Require barcode"}
    if(isEmptyOrNUll(name)){message.name="Require name"}
    if(isEmptyOrNUll(quantity)){message.quantity="Require Category Id"}
    if(isEmptyOrNUll(price)){message.price="Require Category Id"}
    if ((Object.keys(message).length >0)){
        res.json({
            error:true,
            message:message
        })
    }
    var sql = "INSERT INTO product (category_id, barcode,name,quantity,price,image,description,is_active) VALUES (?,?,?,?,?,?,?,?)"
    var param= [category_id,barcode,name,quantity,price,filename,description,is_active]
    var data = await  db.query(sql,param)
    res.json({
        message:"Product create success",
        data:data
    })
}
const productupdate =async (req , res) =>{
    var {
        product_id,
        category_id,
        barcode,
        name,
        quantity,
        price,
        image,
        description
    } = req.body;

    var message = {}
    if (isEmptyOrNUll(product_id)) { message.product_id = "product_id required!" }
    if (isEmptyOrNUll(category_id)) { message.category_id = "category_id required!" }
    if (isEmptyOrNUll(barcode)) { message.barcode = "barcode required!" }
    if (isEmptyOrNUll(name)) { message.name = "name required!" }
    if (isEmptyOrNUll(quantity)) { message.quantity = "quantity required!" }
    if (isEmptyOrNUll(price)) { message.price = "price required!" }
    if (Object.keys(message).length > 0) {
        res.json({
            error: true,
            message: message
        })
        return false;
    }
    var sql = "UPDATE product SET category_id=?, barcode=?, name=?, quantity=?, price=?, image=?, description=? WHERE product_id = ?"
    var param = [category_id, barcode, name, quantity, price, image, description, product_id]
    var data = db.query(sql, param)
    res.json({
        message: "Updated product",
        data: data
    })
}


const productdeleted = async (req , res) => {
    var {id} = req.body
    var sql ="DELETE FROM product WHERE product_id = ?"
    var data = await db.query(sql,[id])
    res.json({
        message: "Remove Success",
        data:data
    })
    
}
const changeProductStatus =async (req , res) => {
    const {is_active}=req.body
    var sql = "UPDATE product SET is_active=?  WHERE product_id= ?"
    const data =  await db.query(sql,[is_active])
    res.json({
        message: "Update product to " + (is_active == 0 ? " inactived" : " actived"),
        list:data
    })
    
}

module.exports = {
    productgetList,
    productgetOne,
    productcreate,
    productupdate,
    productdeleted,
    changeProductStatus
}