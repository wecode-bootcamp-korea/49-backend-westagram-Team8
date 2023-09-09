const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const { DataSource } = require('typeorm');
const { userInfo } = require('os')

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
  } catch (error) {
    console.log(error)
  }
})

// //2. <user 생성>

app.post('/users', async (req, res) => {

  try {
    // 1) user 정보를 frontend로부터 받는다.
    const me = req.body
    // 2) user 정보 console.log로 확인 한 번!
    console.log("ME", me)
    // 3) DATABASE 정보 저장
    // const name1 = me.name
    // const password1 = me.password
    // const email1 = me.email

    const { name, password, email } = me
    //error 핸들링


    // >> 1. email,name,password가 없을 때
    if (email === undefined || name === undefined || password === undefined) {
      const error = new Error("KEY_ERROR")
      error.statusCode = 400
      throw error
      console.log(error)

    }

    // >> 2. password가 짧을 때
    if (password.length < 8) {
      const error = new Error("Invaild Password")
      error.statusCode = 400
      throw error
      console.log(error)
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

    if (existingUser.length !== 0) {
      const error = new Error("Duplicated Email")
      error.statusCode = 400
      throw error
      console.log(error)
    }


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
      "message": "useCreated"
    })



  } catch (error) {
    console.log(error)
    res.status(401).json({ message: '회원가입 실패' })
  }


})


// >>>>> 로그인

app.post('/login', async (req, res) => {
  try {

    // const userEmail = req.body.email
    // console.log("email: ", userEmail)
    // const userPassword = req.body.password
    // console.log("password: ", userPassword)
    // const { email, password } = req.body //  구조분해할당

    const loginUser = req.body
    console.log("loginUser", loginUser)
    console.log("typeof", typeof loginUser)
    const { email, password } = loginUser


    //STEP 1.keyerror 확인

    if (email === undefined || password === undefined) {
      const error = new Error("KEY ERROR")
      error.statusCode = 400
      throw error
      console.log(error)
    }

    //STEP 2.email 가진 사람이 있는 지 확인

    const loginUserEmail = await myDataSource.query(`
    SELECT id, email password FROM users WHERE email='${email}';
    `)
    if (loginUserEmail.length === 0) {
      const error = new Error("NOT EMAIL")
      error.statusCode = 400
      throw error
      console.log(error)
    }

    //STEP 3.password 비교

    const loginUserPassword = await myDataSource.query(`
    SELECT id, email password FROM users WHERE password='${password}';
    `)
    if (loginUserPassword == false) {
      const error = new Error("NOT PASSWORD")
      error.statusCode = 400
      throw error
      console.log(error)
    }

    //STEP 4.토큰생성

    const userId = loginUser;
    console.log("userId", userId)
    console.log("user id type of", typeof userId)

    const token = jwt.sign({userid: loginUser}, "secretKey");
    console.log('JWT Token:', token);









    return res.status(200).json({
      "message": "WELCOME!",
      "accessToken" : "token"
    })





  } catch (error) {
    console.log(error)
    res.status(401).json({ message: '로그인 실패' })
  }
})






















const server = http.createServer(app) // express app 으로 서버를 만듭니다.

const start = async () => { // 서버를 시작하는 함수입니다.
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (error) {
    console.error(error)
  }
}



start()







