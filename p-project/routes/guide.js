// 메인화면 출력파일
const  express = require('express');
const  ejs = require('ejs');
const   fs = require('fs');
const  router = express.Router();

////////////////////
const   mysql = require('mysql');
const   multer = require('multer');
const   bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019'         //사용할 DB명
});
///////////////////

const  PrintGuide = (req, res) => {   // 메인화면을 출력합니다
let    htmlstream = '';

     htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분

     if (req.session.shop) {  // 만약, 판매자가 로그인했다면
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 판매자사용자메뉴
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/guide.ejs','utf8'); // Content
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
     }
     else if (req.session.auth) {  // 로그인했다면
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 판매자사용자메뉴
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/guide.ejs','utf8'); // Content
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
     }
     else {  //로그아웃한 상태라면
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');  // 일반사용자메뉴
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/guide.ejs','utf8'); // Content
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
     }

    if(req.session.auth){
       res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                         'logurl': '/users/logout',
                                         'loglabel': '로그아웃',
                                         'regurl': '/users/profile',
                                         'reglabel': req.session.who }));
    }
    else{
       res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                         'logurl': '/users/auth',
                                         'loglabel': '로그인',
                                         'regurl': '/users/reg',
                                         'reglabel':'회원가입' }));
    }
};

// ‘/’ get 메소드의 핸들러를 정의

router.get('/', PrintGuide);

// 외부로 뺍니다.
module.exports = router
