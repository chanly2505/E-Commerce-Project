

const mysql= require("mysql")
const util= require("util")
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"ecm_project_react"
})
//promise wrapper to enable async await with MYSQL

db.query= util.promisify(db.query).bind(db)
module.exports=db;