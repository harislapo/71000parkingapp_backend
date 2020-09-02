var mysql = require('mysql');

var connection = mysql.createConnection({
    user: 'root',
    password: 'root',
    port: 3306,
    host: 'localhost',
    database: 'parking_sarajevo_app'

});

connection.connect(function(err){
    if(err) throw err;
    console.log('Successfully connected!');
});

module.exports = connection;