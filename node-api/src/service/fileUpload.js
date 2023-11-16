const multer = require('multer');
const unlink = require('node:fs/promises')

exports.unlinkFile = async (path) =>{
    try {
        await  unlink(path)
    }catch (error){
        return null
    }
}

exports.upload=multer({
    storage : multer.diskStorage({
        destination: function (req,file,callback) {
            callback(null,"C:/wamp64/www/image_upload/img")
        },
        filename : function (req , file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    }),
    limits: {
        fileSize: 1024*1024*3
    },
    fileFilter: (req, file , cb)=> {
        if (file.mimetype !== 'imag/png' && file.mimetype  !== 'image/jpg' && file.mimetype !== 'image/jpeg'){
            cb(null,false)
        }else {
            cb(null,true)
        }

    }
})