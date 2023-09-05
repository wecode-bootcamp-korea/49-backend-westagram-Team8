const http = require('http');

const express = require('express');
const logger = require('morgan');

const dotenv = require('dotenv');
const { DataSource } = require('typeorm');

dotenv.config()

const myDataSource = new DataSource({
    type : 'mysql',
    host : '127.0.0.1',
    port : '3306',
    username : 'root',
    password : '',
    database : 'westagram'
})
const app = express();
app.use(express.json());



// const DataSource = myDataSource.query(`SELECT * FROM USERS`)



console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);




const server = http.createServer(app);
const start = async() => {
    try {
        server.listen(8000, () => console.log('Server start'))
    } catch(err) {
        console.log(err)
    }
}

// let portNumber = 3000;

// app.listen(3306, () => {
//     console.log(`Running on port 3306`)
// })




myDataSource.initialize()
 .then(() => {
     console.log("Data Source has been initialized!")
    })


    start();
