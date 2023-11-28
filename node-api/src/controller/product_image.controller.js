
const  db = require("../util/db")
const { isEmptyOrNUll } = require("../service/service")

const getAll  = async (req,res) => {
    var sql = "SELECT * FROM product_image"
    var data = await db.query (sql)
    res.json({
        data:data
    })

}
const create  =async (req,res) => {
    var {
     product_id	,is_active
    } = req.body;
    var filename= null
    if (req.file){
        filename= req.file.filename
    }
    var sql = "INSERT INTO product_image (product_id,is_active,image) VALUES (?,?,?)"
    var param= [product_id,is_active,filename]
    var data= await db.query(sql,param)
    res.json({
        message:"Create Success",
        data:data,
    })
}
const remove  =async (req,res) => {
    var paymentID = req.params.id
    var sql = "DELETE FROM product_image WHERE product_image_id=? "
    var dataDeleted = await db.query(sql,[paymentID])
    res.json({
        message: (dataDeleted.affectedRows !=0 )? "Order Status has Delete Success Fully" : "Id Not Found",
        data_Payment:dataDeleted
    })
}

module.exports= {
    getAll,
    create,
    remove,
}
