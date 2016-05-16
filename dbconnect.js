// MYSQL connections

var mysql = require("mysql"),
connectionPool  = mysql.createPool({
    connectionLimit : 100,  //Limit  
    host     : 'us-cdbr-azure-west-c.cloudapp.net',
    user     : 'b169c1bd79ccf5',
    password : '4f719d05',
    database : 'swdrtfgyhjyvr'
}),
sconnection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'mmtport'
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