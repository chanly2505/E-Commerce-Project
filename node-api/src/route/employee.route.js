
const employeeCtrl = require("../controller/employee.controller")
const {userGuard} = require("../controller/auth.controller");


const employee =(app,base_route)=> {
    app.get(base_route, userGuard,employeeCtrl.getAll)
    app.get("/api/employee/:id" , userGuard,employeeCtrl.getOne)
    app.post("/api/employee" ,employeeCtrl.create)
    app.put("/api/employee", employeeCtrl.update)
    app.delete("/api/employee/:id",employeeCtrl.remove)
    app.post(`${base_route}/set_password`, employeeCtrl.setPassword)
    app.post(`${base_route}/refresh_token`, employeeCtrl.refreshToken)
    app.post(`${base_route}/employee_login`, employeeCtrl.login)
}
module.exports=employee;   