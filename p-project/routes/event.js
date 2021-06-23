// 메인화면 출력파일
const  express = require('express');
const  ejs = require('ejs');
const   fs = require('fs');
const  router = express.Router();
const   mysql = require('mysql');
const   url = require('url');


const  db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019',         //사용할 DB명
    multipleStatements: true
});

//---------------------------------이벤트조회 -------------------------

const  PrintEventList = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2= '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;

      htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
      if (req.session.auth && req.session.shop) {  // 만약, 판매자가 로그인했다면
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 판매자사용자메뉴
      }
      else if (req.session.auth) {  // 로그인했다면
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
      }

      else {  //로그아웃한 상태라면
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');
      }
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/event.ejs','utf8'); // 커뮤니티 메인
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
      sql_str = "SELECT eventNum, eventImg, manager, DATE_FORMAT(eventDATE, '%Y-%m-%d') as eventDATE, DATE_FORMAT(startDATE, '%Y-%m-%d') as startDATE,DATE_FORMAT(endDATE, '%Y-%m-%d') as endDATE,eventMent, hit, eTitle from t3_event order by eventNum;"; // 상품조회SQL

       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
           if (error) {res.status(562).end("AdminPrintProd: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 공지가 없다면, 오류메시지 출력
               htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
               res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                  'warn_title':'공지조회 오류',
                                  'warn_message':'공지사항이 없습니다.',
                                  'return_url':'/' }));
               }
          else {
            if(req.session.auth){
              res.end(ejs.render(htmlstream,
                { 'title' : '쇼핑몰site',
                  'logurl': '/users/logout',
                  'loglabel': '로그아웃',
                  'regurl': '/users/profile',
                  'reglabel': req.session.who,
                   event : results }));
            }
            else {
                   res.end(ejs.render(htmlstream,
                     { 'title' : '쇼핑몰site',
                       'logurl': '/users/auth',
                       'loglabel': '로그인',
                       'regurl': '/users/reg',
                       'reglabel':'회원가입',
                        event : results }));
               }
             } // else
       }); // db.query()

  };

// ‘/’ get 메소드의 핸들러를 정의
router.get('/list', PrintEventList);

//---------------------------------이벤트 상세정보-------------------------

const PrintEventDetail = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, sql_str2;
  const  query = url.parse(req.url, true).query;

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           if (req.session.auth && req.session.shop) {  // 만약, 판매자가 로그인했다면
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 판매자사용자메뉴
           }
           else if (req.session.auth) {  // 로그인했다면
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
           }

           else {  //로그아웃한 상태라면
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');
           }
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/eventDetail.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT eventNum, eventImg, manager, DATE_FORMAT(eventDATE, '%Y-%m-%d') as eventDATE, DATE_FORMAT(startDATE, '%Y-%m-%d') as startDATE,DATE_FORMAT(endDATE, '%Y-%m-%d') as endDATE,eventMent, hit, eTitle, eventDetail from t3_event order by eventNum;"; // 상품조회SQL
           sql_str2 = "update t3_event set hit = hit + 1 where eventNum= '"+ req.query.id+"';"

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str+sql_str2, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'이벤트조회 오류',
                                      'warn_message':'조회된 이벤트가 없습니다.',
                                      'return_url':'/' }));
                   }
              else {
                if (req.session.auth) {  res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                   'logurl': '/users/logout',
                                                   'loglabel': '로그아웃',
                                                   'regurl': '/users/profile',
                                                   'reglabel': req.session.who,
                                                   id : req.query.id,
                                                   eventDetail : results[0] })); }
                else {
                       res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                         'logurl': '/users/auth',
                                                         'loglabel': '로그인',
                                                         'regurl': '/users/reg',
                                                         'reglabel': '회원가입',
                                                         id : req.query.id,
                                                         eventDetail : results[0] }));
                   } // else
                 } // else
           }); // db.query()

};

// ‘/’ get 메소드의 핸들러를 정의
router.get('/detail', PrintEventDetail);
// 외부로 뺍니다.
module.exports = router
