const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
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

// const myDataSource = new DataSource({
//   type: 'mysql', 
//   host: 'localhost', 
//   port: '3306',
//   username: 'root',
//   password: '',
//   database: 'westagram'
//  })

myDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  });

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  try {
    return res.status(200).json({ "message": "Welcome to Ayoung's sever!" })
  } catch (err) {
    console.log(err)
  }

})





//1. <API user 불러오기>

app.get('/users', async (req, res) => {
  try {
    const userData = await myDataSource.query(`SELECT id, name, email FROM users`)
    console.log("USER DATA :", userData)

    //FRONT 전달
    return res.status(200).json({
      "users": userData
    })
  } catch (error){
    console. log(error)
  }
})

// //2. <user 생성>

app.post('/users', async (req, res) => {

try {
  // 1) user 정보를 frontend로부터 받는다.
const me = req.body
// 2) user 정보 console.log로 확인 한 번!
console .log("ME", me)
// 3) DATABASE 정보 저장
// const name1 = me.name
// const password1 = me.password
// const email1 = me.email

const {name, password, email} = me
//error 핸들링


// >> 1. email,name,password가 없을 때
if (email === undefined || name === undefined || password === undefined) {
  const error = new Error("KEY_ERROR")
  error.statusCode = 400
  throw error
}

// >> 2. password가 짧을 때
if(password.length < 8 ){
const error = new Error("Invaild Password")
error.statusCode = 400
throw error
}

// >> 2-1. password에 특수문자가 없을 때 
// if(){}

// 

// >> 3. email이 중복일때

const existingUser = await myDataSource.query(`
SELECT id, email FROM users WHERE email='${email}';
`)
// const object = existingUser.length
console.log('existing user: ', existingUser)

//>>> *email이 같은 유저가 나온다 ----- 에러

if( existingUser.length !== 0){
  const error = new Error("Duplicated Email")
  error.statusCode = 400
  throw error
  }

  //>>> *email이 같은 유저가 없다 ----- 정상



const userData = await myDataSource.query(`
INSERT INTO users(
  name,
  password,
  email
)
VALUES (
 
  "${name}",
  "${password}", 
  "${email}"
)
`)

// 4) 데이터 저장 여부

console.log('iserted user id', userData.insertId)

// 5) 프론트 반응

return res.status(201).json({
  "message" : "useCreated"
})



} catch(error){
  console. log(error)
}


})


//로그인

// app.post("/login", async(req,res) => {
// try{



 
 
 
 
 
 
 
 
 
//   return res.status(200).json({
//     "message" : "LOGIN_SUCCESS",
//     "accessToken" : token

//   })
// } catch(error){
// console .log(error)
// }

// })





















const server = http.createServer(app) // express app 으로 서버를 만듭니다.

const start = async () => { // 서버를 시작하는 함수입니다.
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (err) { 
    console.error(err)
  }
}



start()







