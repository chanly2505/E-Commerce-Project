const db = require("../util/db")
const { isEmptyOrNUll, TOKEN_KEY, REFRESH_KEY } = require("../service/service")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { getPermissionUser } = require("./auth.controller")

const getAll  = (req, res) => {
    var splEmployee="SELECT * FROM employee"
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
    var splEmployeeByID="SELECT * FROM employee WHERE employee_id =?;"
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
const create =(req,res)=>{
    const{
        firstname,
        lastname,
        tel,
        email,
        base_salary,
        address,
        province,
        country
    ,role_id} =req.body
        var message ={}
        //Check Field verify
        if (isEmptyOrNUll(firstname)){
            message.firstname="firstname Required!"
        }
        if(isEmptyOrNUll(lastname)){
            message.lastname="Lastname Required!"
        }
        if (isEmptyOrNUll(tel)){
            message.tel="Telephone Required!"
        }
    if (isEmptyOrNUll(role_id)){
        message.role_id="Telephone Required!"
    }
    if (Object.keys(message).length > 0){
            res.json({
                error:true,
                message:message
            })
            return //
        }
    var sql = "INSERT INTO employee (`firstname`, `lastname`, `tel`, `email`, `base_salary`, `address`, `province`, `country`,`role_id`) VALUES(?,?,?,?,?,?,?,?,?) "
    var paramdata =  [firstname,lastname,tel,email,base_salary,address,province,country,role_id]
    db.query (sql, paramdata, (error, row)=>{
            if(error){
            res.json({
                error:true,
                message:error
            })
        }else{
            res.json({
                message:"Employee create success",
                data:row
            })
        }
        })
}

const  setPassword = async (req,res) =>{
    const {
        username,password
    }=req.body;
    var message ={}
    //Check Field verify
    if (isEmptyOrNUll(username)){
        message.username="firstname Required!"
    }
    if(isEmptyOrNUll(password)){
        message.password="Lastname Required!"
    }
    if (Object.keys(message).length > 0){
        res.json({
            error:true,
            message:message
        })
        return //
    }
    var employee = await  db.query("SELECT * FROM employee WHERE tel =?", [username])
    if (employee.length >0){
        var passwordGenerate=  bcrypt.hashSync(password,10)
        var update= await db.query("UPDATE employee SET password= ? WHERE  tel=?" ,[passwordGenerate,username])
        res.json({
            message:"password Update"
        })
    }else{
        res.json({
            message:"Account doesn't exist!. Please goto register!",
            error:true
        })
    }
}

const login = async (req,res) =>{
    var {username,password} = req.body;
    var message = {};
    if(isEmptyOrNUll(username)) {message.username = "Please fill in username!"}
    if(isEmptyOrNUll(password)) {message.password = "Please fill in password!"}
    if(Object.keys(message).length>0){
        res.json({
            error:true,
            message:message
        })
        return
    }
    var user = await db.query("SELECT * FROM employee WHERE tel=?",[username]);
    if(user.length > 0){
        var passDb = user[0].password // get password from DB (#$@*&(FKLSHKLERHIUH@OIUH@#))
        var isCorrect = bcrypt.compareSync(password,passDb)
        if(isCorrect){
             var user = user[0]
            delete user.password; // delete colums password from object user'
            var permission = await getPermissionUser(user.employee_id)
            var obj = {
                user:user,
                permission:permission,
            }
            var access_token = jwt.sign({data:{...obj}},TOKEN_KEY,{expiresIn:"30h"})
            var refresh_token = jwt.sign({data:{...obj}},REFRESH_KEY)
            res.json({
                ...obj,
                access_token:access_token,
                refresh_token:refresh_token,
            })
        }else{
            res.json({
                message:"Password incorrect!",
                error:true
            })
        }
    }else{
        res.json({
            message:"Account does't exist!. Please goto register!",
            error:true
        })
    }
}

const refreshToken = async  (req,res) => {
        /// Check and verify refresh_token from client
    var {refresh_Key} = req.body
    if (isEmptyOrNUll(refresh_Key)){
        res.status(401).send({
            message:"Unauthorized"
        })
    }else {
        jwt.verify(refresh_Key, REFRESH_KEY ,async (error, resulf)=>{
            if (error){
                res.status(401).send({
                    message:"Unauthorized",
                    error:error
                })
            }else {
                // get access new token
                var username=resulf.data.user.tel
                var user = await db.query("SELECT * FROM employee WHERE tel=?",[username]);
                var user = user[0]
                delete user.password; // delete colums password from object user'
                var permission = await getPermissionUser(user.employee_id)
                var obj = {
                    user:user,
                    permission:permission,
                }
                var access_token = jwt.sign({data:{...obj}},TOKEN_KEY,{expiresIn:"30s"})
                var refresh_token = jwt.sign({data:{...obj}},REFRESH_KEY)
                res.json({
                    ...obj,
                    access_token:access_token,
                    refresh_token:refresh_token,
                })
            }
        })
    }
}

const update = (req,res) => {
    const{
        employee_id,
        firstname,
        lastname,
        tel,
        email,
        base_salary,
        address,
        province,
        country} =req.body
        var message ={}
            //Check Field verify
            if(isEmptyOrNUll(employee_id)){
                message.employee_id= "Employee id Require"
            }    
            if (isEmptyOrNUll(firstname)){
                message.firstname="firstname Required!"
            }
            if(isEmptyOrNUll(lastname)){
                message.lastname="Lastname Required!"
            }
            if (isEmptyOrNUll(tel)){
                message.tel="Telephone Required!"
            }   
            if (Object.keys(message).length > 0){
                res.json({
                    error:true,
                    message:message
                })
                    return //
                }
    var sql ="UPDATE employee SET firstname=? , lastname=? , tel=? , email=? , base_salary=? , address=? , province=? , country=? WHERE employee_id=?";
    var param_spl= [firstname,lastname,tel,email,base_salary,address,province,country,employee_id ]
    db.query (sql, param_spl ,(error, row)=>{
        if(error){
            res.json({
            error:true,
            message:error
        })
        }else{
            res.json({
                message: row.affectedRows ? "update Syccess Fully" : "Id Not Insystem",
                data:row
            })
        }
    })
}
const remove = (req,res) =>{
    var id = req.params.id //param form client
    var splEmployeeByID="DELETE FROM employee WHERE employee_id =?;"
    db.query(splEmployeeByID, [id] , (error, row)=> {
        if(error){
            res.json({
                error:true,
                message:error
            })
        }else{
            res.json({
                message: (row.affectedRows !=0 )? "Delete Syccess Fully" : "Id Not Found",
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
    login,
    setPassword,
    refreshToken
}