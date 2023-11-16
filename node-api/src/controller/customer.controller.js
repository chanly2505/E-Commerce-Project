const db = require("../util/db")
const {TOKEN_KEY} = require("../service/service")
const { isEmptyOrNUll} = require("../service/service")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {getPermissionCustomer} = require("./auth.controller");

const getAll  = async (req, res) => {
    var splEmployee="SELECT customer_id , firstname,lastname, gender, is_active, create_at FROM customer"
    db.query(splEmployee, (err,row) => {
        if(err){
            res.json({
                message:err,
                err:true
            })
        }else{
            res.json({
                list:row
            })
        }
    })
}
const getOne = (req,res) => {
    var id = req.params.id //param form client
    var splEmployeeByID="SELECT customer_id , firstname,lastname, gender, is_active, create_at FROM customer WHERE customer_id =?;"
    db.query(splEmployeeByID,[id],(err, row)=> {
        if(err){
            res.json({
                message:err,
                err:true
            })
        }else{
            res.json({
                listId:row
            })
        }
    })
}
const create = async (req,res)=>{
    db.beginTransaction()
    let {
        username,
    	password,
        firstname,
        lastname,
        gender,
        province_id,
        address_des,role_id} =req.body
        //Validate parameters
        var message ={}
    if(isEmptyOrNUll(username)){message.username="Username Require"}
    if(isEmptyOrNUll(password)){message.password = "password required!"}
    if(isEmptyOrNUll(firstname)){message.firstname = "firstname required!"}
    if(isEmptyOrNUll(lastname)){message.lastname = "lastname required!"}
    if(isEmptyOrNUll(gender)){message.gender = "gender required!"}
    if(isEmptyOrNUll(province_id)){message.province_id = "province_id required!"}
    if(isEmptyOrNUll(address_des)){message.address_des = "address description required!"}
    if(isEmptyOrNUll(role_id)){message.role_id= "Require Role Id"}
    if(Object.keys(message).length > 0) {
        res.json({
            error:true,
            message:message
        })
        return false;
    }
    //end validate parameter
    var sqlFind = "SELECT customer_id FROM customer WHERE username=?" //
    await  db.query(sqlFind ,[username] , (err1, resulf1)=> {
        if(resulf1.length > 0 ){ // hhave recora exit  cutomer o duplicate
            res.json({
                error:true,
                message:"Account already exit"
            })
            return false;
        }else{
            //password b crypt form client
            password= bcrypt.hashSync(password,10)
            var sqlCustomer = "INSERT INTO customer (firstname,lastname, gender,username,password,role_id) VALUES (?,?,?,?,?,?)"
            var sqlParamCustomer= [firstname,lastname,gender,username,password,role_id]
            db.query(sqlCustomer ,sqlParamCustomer , (error2, resulf2) => {
                if(!error2){
                    //Insert customer address\
                    var sqlCustomerAddress = "INSERT INTO customer_address (customer_id,province_id,firstname,lastname,tel,address_des) VALUES (?,?,?,?,?,?)"
                    var paramCustomerAddress =[resulf2.insertId, province_id, firstname, lastname, username, address_des]
                    db.query(sqlCustomerAddress , paramCustomerAddress ,(error3, resulf3) => {
                        if (!error3){
                            res.json({
                                message :"Account Created",
                                data:resulf3
                            })
                            db.commit()
                        }else  {
                            db.rollback()
                            res.json({
                                error:true,
                                message :error3
                            })

                        }
                    })
                }
            })
        }
    })
}


const login = async (req,res) =>{
    var {username, password} = req.body
    var message={}
    if (isEmptyOrNUll(username)){message.username="Username Require"}
    if (isEmptyOrNUll(password)){message.password="Password Require"}
    if (Object.keys(message).length > 0) {
        res.json({
            message:message,
            error:true
        })
        return
    }
    var user = await  db.query("SELECT * FROM customer WHERE  username=?" , [username])
    if (user.length >0){
        var passDB= user[0].password
        var isCorrect= bcrypt.compareSync(password,passDB)
        if (isCorrect){
            var user = user[0]
            delete user.password
            var permission =await getPermissionCustomer(user.customer_id)
            var obj = {
                user:user,
                role:[],
                permission:permission,
                token:""
            }

            var access_token = jwt.sign({data:{...obj}},TOKEN_KEY,{expiresIn:"1h"})
            var refresh_token = jwt.sign({data:{...obj}},TOKEN_KEY)

            res.json({
                ...obj,
                access_token:access_token,
                refresh_token:refresh_token,
            })
        }else {
            res.json({
                message:"Password incorrect!",
                error:true
            })
        }
    }else{
        res.json({
            message:"Account doesn't exist!. Please goto register!",
            error:true
        })
    }
}

const update = (req,res) => { //update Profile
    const{
        customer_id,
        firstname,
        lastname,
        gender,role_id} =req.body
    var message ={}
    if (isEmptyOrNUll(customer_id)){message.customer_id ="Customer is Require"}
    if (isEmptyOrNUll(firstname)){message.firstname ="Customer firstname Require"}
    if (isEmptyOrNUll(lastname)){message.lastname ="Customer  lastname Require"}
    if (isEmptyOrNUll(gender)){message.gender ="Customer gender Require"}
    if (isEmptyOrNUll(role_id)){message.role_id ="Customer gender Require"}
    if(Object.keys(message).length > 0 ){
        res.json({
            error:true,
            message:message
        })
        return;
    }

    var sql ="UPDATE customer SET firstname=? , lastname=? , gender=? WHERE customer_id=?";
    var param_spl= [firstname,lastname,gender,customer_id]
    db.query (sql, param_spl ,(error, row)=>{
        if(error){
            res.json({
                error:true,
                message:error
            })
        }else{
            res.json({
                message: row.affectedRows ? "Category update Success" : "Id Not in system",
                data:row
            })
        }
    })
}
const  getOneAdd= (req , res) => {
    var customer_id =req.params.id;
    var splAdd = "SELECT * FROM customer_address WHERE customer_address_id = ?"
    db.query(splAdd , [customer_id],(errorAdd , row) => {
        if (!errorAdd) {
            res.json ({
                list1 : row
            })
        }
    })

}
const  getListAdd= (req , res) => {
    var {
        customer_id
    }=req.body;
    var splAdd = "SELECT * FROM customer_address WHERE customer_id=?"
    db.query(splAdd , [customer_id],(errorAdd , row) => {
            if (!errorAdd) {
                res.json ( {
                    list : row
                })
            }
    })

}
const  newAddress= (req, res) => {
    var {
        customer_id,
        firstname,
        lastname,
        province_id,
        tel,
        address_des
    }=req.body;
    var message ={}
    if (isEmptyOrNUll(customer_id)){message.customer_id= "Customer id Require"}
    if (isEmptyOrNUll(firstname)){message.firstname= "Customer firstname Require"}
    if (isEmptyOrNUll(lastname)){message.lastname= "Customer lastname Require"}
    if (isEmptyOrNUll(province_id)){message.province_id= "Customer province_id Require"}
    if (isEmptyOrNUll(tel)){message.tel= "Customer tel Require"}
    if (isEmptyOrNUll(address_des)){message.address_des= "Customer address_des Require"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
    }

    var splAdd = "INSERT INTO customer_address (customer_id, firstname,lastname, province_id, tel,address_des) VALUES (?,?,?,?,?,?)"
    var param =[customer_id,firstname,lastname,province_id,tel,address_des]
    db.query(splAdd , param,(errorAdd , row) => {
        if (errorAdd) {
            res.json ( {
                errored:true,
                message:errorAdd
            })
        }else {
           res.json({
               message: row.affectedRows ? "Created  Success" : "Id Not in system",
               data:row
           })
        }
    })
}
const  updateAddress= (req, res) => {
    var {
        customer_address_id,
        customer_id,
        firstname,
        lastname,
        province_id,
        tel,
        address_des
    }=req.body;
    var message ={}
    if (isEmptyOrNUll(customer_address_id)){message.customer_add_id="Customer Address id Require"}
    if (isEmptyOrNUll(customer_id)){message.customer_id= "Customer id Require"}
    if (isEmptyOrNUll(firstname)){message.firstname= "Customer firstname Require"}
    if (isEmptyOrNUll(lastname)){message.lastname= "Customer lastname Require"}
    if (isEmptyOrNUll(province_id)){message.province_id= "Customer province_id Require"}
    if (isEmptyOrNUll(tel)){message.tel= "Customer tel Require"}
    if (isEmptyOrNUll(address_des)){message.address_des= "Customer address_des Require"}
    if(Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
    }
    var sql ="UPDATE customer_address SET customer_id=?, firstname=? , lastname=? ,province_id=?, tel=? ,address_des=? WHERE customer_address_id=?";
    var param_spl= [customer_id,firstname,lastname,province_id,tel,address_des,customer_address_id]
    db.query (sql, param_spl ,(error, row)=>{
        if(error){
            res.json({
                error:true,
                message:error
            })
        }else{
            res.json({
                message: row.affectedRows ? "Category update Success" : "Id Not in system",
                data:row
            })
        }
    })
}
const  removeAddress= (req, res) => {
    var id  = req.params.id
    var sqlAdd = "DELETE FROM customer_address WHERE customer_add_id = ?"
    db.query(sqlAdd,[id],(error,row)=> {
        if(error){
            res.json({
                error:true,
                message:error
            })
        }else{
            res.json({
                message: (row.affectedRows !=0 )? "Customer add has Delete Success Fully" : "Id Not Found",
                data:row
            })
        }
    })
}
const remove = (req,res) =>{
    var id = req.params.id //param form client
    // var splEmployeeByID="DELETE FROM customer WHERE customer_id =?;"
    var splEmployeeByID="UPDATE customer SET is_active = 0 WHERE customer_id=? "
    db.query(splEmployeeByID, [id] , (error, row)=> {
        if(error){
            res.json({
                error:true,
                message:error
            })
        }else{
            res.json({
                message: (row.affectedRows !=0 )? "Category has Delete Success Fully" : "Id Not Found",
                data:row
            })
        }
    })

}
module.exports={
    getAll,
    getOne,
    create,
    update,
    remove,
    newAddress,
    updateAddress,
    removeAddress,
    getListAdd,
    getOneAdd,
    login
}