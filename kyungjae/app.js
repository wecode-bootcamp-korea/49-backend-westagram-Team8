// Assignment 2 - 유저 회원가입하기

const http = require('http')
const express = require('express')
const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
 type: 'mysql', 
 host: 'localhost', 
 port: '3306',
 username: 'root',
 password: 'pw',
 database: 'westagram'
})

const app = express()

app.use(express.json()) // for parsing application/json

app.get("/", async(req, res) => {
  try {
    return res.status(200).json({
      "message" : "Welcome to KJ's Server!!"
    })
  } catch(err) {
    console.log(err)
  }
})


//1. API 로 users 화면에 보여주기
app.get('/users', async(req, res) => {
	try {
    // query DB with SQL
    // Database Source 변수를 가져오고.
    // SELECT id, name, password FROM users;
    const userData = await myDataSource.query(`SELECT id, name, email, password FROM users`)

    // console 출력

    console.log("USER DATA :", userData)

    // FRONT 전달

    return res.status(200).json({
      "users": userData
    })
	} catch (error) {
		console.log(error)
	}
})


//2. users 생성

app.post('/users', async(req, res) => {
  try {
    const {body} = req;

    console.log("body:", body);

    const {name} = body;
    const {password} = body;
    const {email} = body;


    const userData = await myDataSource.query(`
    INSERT INTO uesrs(name, password, email)
    VALUES(${name}, ${password}, ${email})
    `)

    console.log('inserted user id', userData)  //  insertId는 뭐지?

    return res.status(201).json( {
      "message": "user created!"
    })

  } catch(err) {
    console.log(err);
  }
})



// 과제 3 DELETE 
// 가장 마지막 user를 삭제하는 엔드포인트
app.delete("/users", async(req, res) => {
  try {

  } catch (err) {
    console.log(err)
  }
})

// 과제 4 UPDATE
// 1번 user의 이름을 'Code Kim'으로 바꾸어 보세요.

app.put("/users/1", async(req, res) => {
  try {
    const newName = req.body.data.name
  } catch (err) {
    console.log(err)
  }
})

const server = http.createServer(app) // express app 으로 서버를 만듭니다.

const start = async () => { // 서버를 시작하는 함수입니다.
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (err) { 
    console.error(err)
  }
}

myDataSource.initialize()
 .then(() => {
    console.log("Data Source has been initialized!")
 })

start()