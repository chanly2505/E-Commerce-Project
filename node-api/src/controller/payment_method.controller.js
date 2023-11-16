 const  db = require("../util/db")
const { isEmptyOrNUll } = require("../service/service")

const getAll  = async (req,res) => {
    var sql = "SELECT *FROM  payement_methode"
    var data = await  db.query(sql)
    res.json({
        Data_Payment:data
    })
}
const create  =async (req,res) => {
    var {
        name,code, is_active
    } = req.body;
    var filename= null
    if (req.file){
        filename= req.file.filename
    }
    var sql = "INSERT INTO payement_methode (name, code, is_active,image) VALUES (?,?,?,?)"
    var param= [name,code,is_active,filename]
    var data= await db.query(sql,param)
    res.json({
        message:"Create Success",
        data:data,
    })
}
const remove  =async (req,res) => {
    var paymentID = req.params.id
    var sql = "DELETE FROM payement_methode WHERE payement_methode_id=? "
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
