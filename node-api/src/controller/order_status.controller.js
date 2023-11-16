const  db = require("../util/db")
const { isEmptyOrNUll } = require("../service/service")
const row = require("mysql/lib/protocol/packets/OkPacket");

const getAll  = async (req,res) => {
    var sql = "SELECT * FROM  order_status"
    var data = await db.query(sql)
    res.json({
        DataStatus : data
    })
}
const create  =async (req,res) => {
    var {
        name,message,sort_order
    } =req.body
    var messageStatus ={}
    if (isEmptyOrNUll(name)){messageStatus.name="Name Require"}
    if (isEmptyOrNUll(message)){messageStatus.message= "Message  Require"}
    if (isEmptyOrNUll(sort_order)){messageStatus.sort_order= "Sort Order Require"}
    if (Object.keys(messageStatus).length> 0){
        res.json({
            error:"Data Require",
            message:messageStatus
        })
    }
    var sql = "INSERT INTO order_status (name, message ,sort_order) VALUES  (?,?,?)"
    var param = [name,message,sort_order]
    var data= await db.query (sql,param)
    res.json({
        message:message,
        Data :data
    })
}
const remove  =async (req,res) => {
    var order_status_id=req.params.id
    var sql = "DELETE FROM order_status WHERE order_status_id = ?"
    var data = await db.query(sql,[order_status_id])
    res.json({
        message: (data.affectedRows !=0 )? "Payment Method has Delete Success" : "Id Not Found",
        data:data
    })

}
module.exports= {
    getAll,
    create,
    remove,
}
