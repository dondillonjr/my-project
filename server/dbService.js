const mysql  = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
        //host: "ec2-18-216-119-62.us-east-2.compute.amazonaws.com",
        //user: "root",
        //password: "myPassword",
        //database: "web_app",
        //port: 3306
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.DB_PORT
});

//takes a call back
connection.connect( (err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('DB ' + connection.state);
})

// This class contains all functions to that will allow you to
// getData, uploadData, deleteData
class DbService {
    static getDbServiceInstance() {
        //create only one instance of DBService
        return instance ? instance : new DbService();
    }

    // gets data
    async getAllData() {
        try {   //Promise will handel query
                //if query sucessfull - resolve otherwise reject it
                const response = await new Promise(( resolve, reject) => {
                    const query = "SELECT * FROM names;";

                    connection.query(query, (err, results ) => {
                        if (err) reject(new Error(err.message));
                        resolve(results);
                    })
                });
                //show response on Terminal console
                console.log("In dbService.getAllData()")
                console.log(response);
                console.log("finished getAll")

                return response;
        } catch (error) {
            console.log(error);
        }
    }

    async insertNewName(name) {
        try {       
            const dateAdded = new Date();
            const insertId = await new Promise(( resolve, reject) => {
                const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

                connection.query(query, [name, dateAdded], (err, result ) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });

            console.log("In dbService.insertNewName()" + insertId + " " + dateAdded);

            //show response on Terminal console
            return {
                id : insertId,
                name : name,
                dateAdded : dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);

            console.log("In deleteRowById() - " + id);

            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?";
    
                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            console.log(response);
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }       
    }

    async updateNameById(id, name) {
        try {
            console.log("In updateNameById() - " + id + " - " + name);
            id = parseInt( id, 10);
            const response =  await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ? WHERE id = ?";

                connection.query(query, [name , id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(name) {
        try {   
            console.log("In searchByName() - " + name);

            const response = await new Promise(( resolve, reject) => {
                const query = "SELECT * FROM names WHERE name = ?;";

                connection.query(query, [ name ], (err, results ) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            //show response on Terminal console
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

//export this DbService Class
module.exports = DbService;