
const TOKEN_KEY = "LKJIJOPIEWRJ@#IU)(@U#)*@)#*$)LKJDSFSL:KJ12309802934908"
const REFRESH_KEY = "342080!@DCFS23;ksdfkq23po9[f323@$@#$@#$@$#@#$@#$sjdflajlkjsaf"


const isEmptyOrNUll = (value) => {
    if(value == "" || value == null || value == "null" || value == undefined ){
        return true
    }
    return false
}
const invoiceNumber = (number) => {
    var str = "" + (number+1);
    var pad = "0000"
    var invoice = pad.substring(0, pad.length - str.length) + str;
    return "INV"+invoice; // INV0001, INV0002, INV19999
}
module.exports ={
    isEmptyOrNUll,
    invoiceNumber,
    TOKEN_KEY,
    REFRESH_KEY,
}