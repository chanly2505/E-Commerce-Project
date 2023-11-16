const db = require("../util/db")
const { isEmptyOrNUll } = require("../service/service")

const getAll = async (req,res) => {
    const list = await db.query("SELECT * FROM `category`");
    res.json({
        list:list,
    })

}
const getOne = (req, res) => {
    var id = req.params.id //param form client
    var splEmployeeByID = "SELECT * FROM category WHERE category_id =?;"
    db.query(splEmployeeByID, [id], (err, row) => {
        if (err) {
            res.json({
                message: err,
                err: true
            })
        } else {
            res.json({
                listId: row
            })
        }
    })
}
const create = (req, res) => {
    const {
        name,
        description,
        parent_id,
        status } = req.body
    var message = {}
    //Check Field verify
    if (isEmptyOrNUll(name)) {
        message.firstname = "category name Required!"
        res.json({
            error: true,
            message: message
        })
        return //

    }

    var sql = "INSERT INTO category (category.`name`, `description`, `parent_id`, `status`) VALUES(?,?,?,?) "
    var paramdata = [name, description, parent_id, status]
    db.query(sql, paramdata, (error, row) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
        } else {
            res.json({
                message: "category create success",
                data: row
            })
        }
    })
}
const update = (req, res) => {
    const {
        category_id,
        name,
        description,
        parent_id,
        status } = req.body
    var message = {}
    //Check Field verify
    if (isEmptyOrNUll(name)) {
        message.firstname = "category name Required!"
        res.json({
            error: true,
            message: message
        })
        return //
    }
    var sql = "UPDATE category SET name=? , description=? , parent_id=? , status=?  WHERE category_id=?";
    var param_spl = [name, description, parent_id, status, category_id]
    db.query(sql, param_spl, (error, row) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
        } else {
            res.json({
                message: row.affectedRows ? "Category update Success" : "Id Not Insystem",
                data: row
            })
        }
    })
}
const remove = (req, res) => {
    var id = req.params.id //param form client
    var splEmployeeByID = "DELETE FROM category WHERE category_id =?;"
    db.query(splEmployeeByID, [id], (error, row) => {
        if (error) {
            res.json({
                error: true,
                message: error
            })
        } else {
            res.json({
                message: (row.affectedRows != 0) ? "Catogory has Delete Syccess Fully" : "Id Not Found",
                data: row
            })
        }
    })

}
module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
}