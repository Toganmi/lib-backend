const express = require('express')
const port = 3002
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const passport = require("passport")
const cors = require('cors')
const app = express()
const https = require('https');
const fs = require('fs');

const privateCrt = fs.readFileSync('./certificate/bundle.crt', 'utf8')
const privateKey = fs.readFileSync('./certificate/com.key', 'utf8')
const HTTPS_OPTOIN = {
  key: privateKey,
  cert: privateCrt
};
const SSL_PORT = 3003;

app.use(cors())
// 引入users.js
const users = require("./routes/api/users")
const profiles = require("./routes/api/profiles")

// DB config
const db = require("./config/keys").mongoURI

// 使用bodyparser中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



// connect to mongodb
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log("db connected"))
        .catch(err => console.log(err))

// passport初始化
app.use(passport.initialize())

// 引用并传递passport
require("./config/passport")(passport)


// app.get('/', (req, res) => res.send('Hello World!'))

// 使用router
app.use("/api/users", users)
app.use("/api/profiles", profiles)

app.listen(port, () => console.log(`Example app listening on ${port} port!`))
const httpsServer = https.createServer(HTTPS_OPTOIN, app);
httpsServer.listen(SSL_PORT, () => {
        console.log(`HTTPS Server is running on: https://localhost:${SSL_PORT}`);
      });