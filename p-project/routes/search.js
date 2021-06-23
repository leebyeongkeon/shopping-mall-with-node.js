const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   url = require('url');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');

const  router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019'         //사용할 DB명
});

const ProductSearch = (req, res) => {
        let    htmlstream = '';
        let    htmlstream2 = '';
        let    sql_str="";
        let    body = req.body;
        let    searchword = body.search;
        let    page=body.page;
        console.log(searchword);
        console.log(body);
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 사용자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/productsearch.ejs','utf8'); // 카테고리별 제품리스트
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         sql_str += "SELECT * from t3_product where productName like  '%"+searchword+"%';"; // 상품조회SQL


         console.log(sql_str);
         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
             if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
             else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                 htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                 if(req.session.auth){


                     res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                                  'warn_title':'상품조회 오류',
                                                                  'warn_message':'조회된 상품이 없습니다.',
                                                                  'logurl': '/users/logout',
                                                                  'loglabel': '로그아웃',
                                                                  'regurl': '/users/profile',
                                                                  'reglabel': req.session.who,
                                                                  'return_url':'/' }));
                 }
                 else {
                     res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                                  'warn_title':'상품조회 오류',
                                                                  'warn_message':'조회된 상품이 없습니다.',
                                                                  'logurl': '/users/users/auth',
                                                                  'loglabel': '로그인',
                                                                  'regurl': '/users/profile',
                                                                  'reglabel': req.session.who,
                                                                  'return_url':'/' }));
                 }
               }////////////조회정보 없을 경우

            else {  // 조회된 상품이 있다면, 상품리스트를 출력
                   if(req.session.auth){
                   res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                     'logurl': '/users/logout',
                                                     'loglabel': '로그아웃',
                                                     'regurl': '/users/profile',
                                                     'reglabel': req.session.who,
                                                      searchword: searchword,
                                                      length : results.length-1,
                                                      page : page,
                                                      previous : Number(page)-1,
                                                      next : Number(page)+1,
                                                      page_num : 16,
                                                      prodata : results}));
                  }
                  else{
                    res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                      'logurl': '/users/users/auth',
                                                      'loglabel': '로그인',
                                                      'regurl': '/users/profile',
                                                      'reglabel': req.session.who,
                                                       searchword: searchword,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 16,
                                                       prodata : results}));
                  }
                }
         });
};
router.post('/', ProductSearch);
module.exports = router;
