const mysql = require('mysql')

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatapp'
})
con.connect(function(err) {
    if(err) return console.log(err)
})

module.exports = con