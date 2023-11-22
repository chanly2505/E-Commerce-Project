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

}
const create =(req,res)=>{
}


const update = (req,res) => {

}
const remove = (req,res) =>{


}
module.exports={
    getAll,
    getOne,
    create,
    update,
    remove,
}