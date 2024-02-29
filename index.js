const express = require("express");
const app = express();
const ejs = require('ejs');
const axios = require('axios');
const cors = require('cors');

// 웹브라우저에서 보낸 데이터를 받아서 처리하는 body-parser를 불러온다.
var bodyParser = require('body-parser')

// 브라우저에서 오는 응답이 json 일수도 있고, 아닐 수도 있으므로 urlencoded() 도 추가한다.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
require('dotenv').config();
app.use(cors({}))


const postConfigRouter = require('./routes/post.config.router');
const postKformRouter = require('./routes/post.kform.router');
const postKgoodRouter = require("./routes/post.kgood.router");
const postKformgoodRouter = require("./routes/post.kformgood.router");

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({extended: false}));
app.use(express.json());


const postKgoodController = require('./controller/post.kgood.controller');
const postsConfigController = require('./controller/post.config.controller');
const postsKformController = require('./controller/post.kform.controller');
const postKformgoodController = require("./controller/post.kformgood.controller");

app.use("/api/v1/config", postConfigRouter);
app.use("/api/v1/kform", postKformRouter);
app.use("/api/v1/kgood", postKgoodRouter);
app.use("/api/v1/kformgood", postKformgoodRouter);


app.route("/form")
  .get(function (req, res) {
    axios.get("http://localhost:3000/api/v1/kform")
      .then(function (result) {
        // 'result.data' 내부의 'data' 키에 접근하여 배열 데이터를 가져옵니다.
        let itemsArray = result.data.data; // 수정된 부분

        // 배열 데이터를 'posts' 템플릿으로 렌더링합니다.
        res.render("./form/form", {
          forms: itemsArray
        });
        
        // 콘솔에 itemsArray 내용을 출력하여 확인합니다.
        // console.log(itemsArray);
      })
      .catch(function (error) {
        // 오류 처리
        res.render("error", { error });
      });
  });

  app.route("/config")
  .get(function (req, res) {
    axios.get("http://localhost:3000/api/v1/config")
      .then(function (result) {
        let itemsArray2 = result.data.data; // 수정된 부분
        res.render("./config/config", {
          configs: itemsArray2
        });
      })
      .catch(function (error) {
        res.render("error", { error });
      });
  });

  app.route("/new")
  .get(function (req, res) {
    axios.get("http://localhost:3000/api/v1/config")
      .then(function (result) {
        let itemsArray4 = result.data.data; // 수정된 부분
        res.render("./form/new", {
          configs: itemsArray4
        });
      })
      .catch(function (error) {
        res.render("error", { error });
      });
  });

  app.route("/good")
  .get(function (req, res) {
    axios.get("http://localhost:3000/api/v1/kgood")
      .then(function (result) {
        // 'result.data' 내부의 'data' 키에 접근하여 배열 데이터를 가져옵니다.
        let itemsArray3 = result.data.data; // 수정된 부분

        // 배열 데이터를 'posts' 템플릿으로 렌더링합니다.
        res.render("./good/good", {
          kgoods: itemsArray3
        });

      })
      .catch(function (error) {
        // 오류 처리
        res.render("error", { error });
      });
  });

// '/view' 경로로 GET 요청이 들어왔을 때의 처리 로직
app.get("/view", async (req, res) => {
    try {
        const fCode = req.query.f_code;
        if (!fCode) {
            return res.render("error", { error: "f_code 파라미터가 필요합니다." });
        }

        // axios를 사용하여 API에서 데이터를 비동기적으로 조회합니다.
        const response = await axios.get(`http://localhost:3000/api/v1/kform/${fCode}`);
        
        // API로부터 받은 데이터를 EJS에 전달합니다.
        // response.data.data[0]에서 data[0]을 사용하는 것은,
        // API 응답이 {data: [{...}]} 형태로 가정했기 때문입니다.
        // 실제 응답 구조에 따라 적절히 조정해야 합니다.
        res.render("invoice/view", { data: response.data.data[0] });
        
    } catch (error) {
        console.error(error);
        res.render("error", { error: "데이터 조회 중 오류 발생" });
    }
});





  app.get('/addcompany', (req, res) => {
    res.render('./config/addcompany')
  });

  app.get('/test', (req, res) => {
    res.render('test')
  });



app.post('/good', postKgoodController.create);
app.post('/addcompany', postsConfigController.create);
app.post('/new', postsKformController.create);
app.post('/goodSelector' ,postKgoodController.registerProduct);
app.delete('/gooddelete/:uid', postKformgoodController.delete);
app.delete('/kgooddelete/:uid' ,postKgoodController.delete);
app.put('/goodupdate/:uid', postKformgoodController.update);
app.put("/kgooduid/:uid", postKgoodController.update);
app.put("/kformupdate/:f_code" ,postsKformController.update);



app.get('/pw', (req, res) => {
    res.render('pw')
  })

  app.get('/', (req, res) => {
  
    res.render('login')
})




const port = process.env.PORT || 3000; // "PORT"를 대문자로 수정

app.listen(port, () => {
    console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`); // 문자열 보간법으로 수정
});
