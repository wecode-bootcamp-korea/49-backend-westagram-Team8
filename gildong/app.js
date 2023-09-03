const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

TYPEORM_CONNECTION = mysql
TYPEORM_HOST = 127.01
TYPEORM_USERNAME = root
TYPEORM_PASSWORD = myPassword
TYPEORM_DATABASE = myDB
TYPEORM_PORT = 3306
TYPEORM_LOGGING =TRUE

const dotenv = require("dotenv")

dotenv.config()

const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
 host: process.env.TYPEORM_HOST,
 port: process.env.TYPEORM_PORT,
 username: process.env.TYPEORM_USERNAME,
 password: process.env.TYPEORM_PASSWORD,
 database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
 .then(() => {
     console.log("Data Source has been initialized!")
 })

 const DataSource = myDataSource.query(`SELECT * FROM USERS`)



