// MYSQL connections

var mysql = require("mysql"),
connectionPool  = mysql.createPool({
    connectionLimit : 100,  //Limit  
    host     : '<hostname>',
    user     : '<user>',
    password : '<password>',
    database : '<db>'
}),
sconnection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'test'
});
    
connectionPool.on('connection', function (connection) {
    console.log("Connection established....Connected as ID "+ connection.threadId);
});   

connectionPool.on('enqueue', function () {
    console.log("Waiting for connection...");
});

module.exports =  {
    getConnection: function (callback) {
        connectionPool.getConnection(function (err, connection) {
            if(err){
                throw new Error("Unable to establish connection with DB. Exiting...");
            }
            callback(connection);
        });
    } 
};