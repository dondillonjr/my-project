const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const dbService = require('./dbService');

app.use(cors()); //not block incoming api call - send data to backend
app.use(express.json()); //send data in json format
app.use(express.urlencoded({ extended : false }));

//Defind - ROUTES 
// create 
//- POST = create new data
app.post('/insert', (request, response) => {
    const { name } = request.body;

    console.log("apps-post=" + name);
    const db = dbService.getDbServiceInstance();
    const result =  db.insertNewName(name);

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

// read
// when dom is loaded make fetch call to backend
app.get('/getAll', (request, response) => {
    //For Testing console BELOW:
    console.log('Web page reached backend node server'); //when making api call - reached backend
   
    //check for class DbService instance
    //gets us the dbService object 
    const db = dbService.getDbServiceInstance();

    const result =  db.getAllData();

    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
});

// update
app.patch('/update', (request, response) => {
    console.log("IN app.patch");
    const { id, name } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id, name);

    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});
  
// delete
app.delete('/delete/:id', (request, response) => {  
    const { id } = request.params;

    console.log("ID=" + id); 
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById( id );

    result
    .then(data => response.json({success : data}))
    .catch( err => console.log(err));
})

// search
app.get('/search/:name', (request, response) => { 
    const { name } = request.params;

    console.log("Name=" + name); 
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName( name );

    result
    .then(data => response.json({data : data}))
    .catch( err => console.log(err));
})

//start local server - know it is running
app.listen(process.env.PORT, () => console.log('APP is running'));