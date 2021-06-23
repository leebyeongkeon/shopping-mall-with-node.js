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
    database: 'db2019'         //사용할 DB명
});

const  db2 = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019' ,        //사용할 DB명
    multipleStatements: true
});
//----------------------------------커뮤니티 메인 조회-------------------------
const  PrintCommMain = (req, res) => {
let    htmlstream = '';
let    htmlstream2= '';
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


    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/comm.ejs','utf8'); // 커뮤니티 메인
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
    sql_str = "SELECT infoNum, manager,DATE_FORMAT(infoDATE, '%Y-%m-%d') as infoDATE, infoMent, hit,  infoName from t3_info order by infoNum;"; // 상품조회SQL
    sql_str2 = "SELECT reviewNum, writer, reviewMent, reviewImg,  DATE_FORMAT(reviewDATE, '%Y-%m-%d') as reviewDATE, productNum from t3_review order by reviewNum;"; // 상품조회SQL
     res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

     db2.query(sql_str+sql_str2, (error, results, fields) => {  // 상품조회 SQL실행
         if (error) {
           console.log(error);
           res.status(562).end("AdminPrintProd: DB query is failed"); }
         else if (results.length <= 0) {  // 조회된 공지가 없다면, 오류메시지 출력
             htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
             res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                'warn_title':'공지조회 오류',
                                'warn_message':'공지사항이 없습니다.',
                                'return_url':'/' }));
             }
        else {  // 조회된 공지가 있다면, 공지리스트를 출력
          if(req.session.auth){
            res.end(ejs.render(htmlstream,
            { 'title' : '쇼핑몰site',
              'logurl': '/users/logout',
              'loglabel': '로그아웃',
              'regurl': '/users/profile',
              'reglabel': req.session.who,
               info : results[0],
               review: results[1] }));  }
          else {
                 res.end(ejs.render(htmlstream,
                   { 'title' : '쇼핑몰site',
                     'logurl': '/users/auth',
                     'loglabel': '로그인',
                     'regurl': '/users/reg',
                     'reglabel': '회원가입',
                      info : results[0],
                      review: results[1]}));
             }
           } // else
     }); // db.query()

};

// ‘/’ get 메소드의 핸들러를 정의
router.get('/', PrintCommMain);


//----------------------------------공지사항조회-------------------------
const  PrintInfoList = (req, res) => {
let    htmlstream = '';
let    htmlstream2='';
let    sql_str;
const  query = url.parse(req.url, true).query;
var page = req.params.page;

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
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/info.ejs','utf8'); // 공지사항
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
    sql_str = "SELECT infoNum, manager,DATE_FORMAT(infoDATE, '%Y-%m-%d') as infoDATE, infoMent, hit,  infoName from t3_info order by infoNum;"; // 상품조회SQL

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

    db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
        if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
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
                 length : results.length-1,
                 page : page,
                 previous : Number(page)-1,
                 next : Number(page)+1,
                 page_num : 5,
                 infodata : results })); }
         else {
                res.end(ejs.render(htmlstream,
                  { 'title' : '쇼핑몰site',
                    'logurl': '/users/auth',
                    'loglabel': '로그인',
                    'regurl': '/users/reg',
                    'reglabel': '회원가입',
                      length : results.length-1,
                      page : page,
                      previous : Number(page)-1,
                      next : Number(page)+1,
                      page_num : 5,
                      infodata : results }));
            }

          } // else
    }); // db.query()

};


// ‘/’ get 메소드의 핸들러를 정의
router.get('/info/:page', PrintInfoList);

//---------------------------------리뷰게시판 조회----------------------

const  PrintReview = (req, res) => {   // 메인화면을 출력합니다
  let    htmlstream = '';
  let    htmlstream2='';
  let    sql_str;
  const  query = url.parse(req.url, true).query;
  var page = req.params.page;

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
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/review.ejs','utf8'); // 공지사항
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
      sql_str = "SELECT reviewNum, writer, reviewMent, reviewImg,  DATE_FORMAT(reviewDATE, '%Y-%m-%d') as reviewDATE, productNum from t3_review order by reviewNum;"; // 상품조회SQL

      res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

      db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
          if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
          else {
           if(req.session.auth){
             res.end(ejs.render(htmlstream,
               { 'title' : '쇼핑몰site',
                 'logurl': '/users/logout',
                 'loglabel': '로그아웃',
                 'regurl': '/users/profile',
                 'reglabel': req.session.who,
                   length : results.length-1,
                   page : page,
                   previous : Number(page)-1,
                   next : Number(page)+1,
                   page_num : 10,
                   review : results }));
                 console.log(results);
               }
           else {
                  res.end(ejs.render(htmlstream,
                    { 'title' : '쇼핑몰site',
                      'logurl': '/users/auth',
                      'loglabel': '로그인',
                      'regurl': '/users/reg',
                      'reglabel': '회원가입',
                        length : results.length-1,
                        page : page,
                        previous : Number(page)-1,
                        next : Number(page)+1,
                        page_num : 5,
                        review : results }));
              }

            } // else
      }); // db.query()

};

// ‘/’ get 메소드의 핸들러를 정의
router.get('/review/list/:page', PrintReview);

//---------------------------------리뷰 상세정보-------------------------

const PrintReviewDetail = (req, res) => {
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
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/reviewDetail.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT reviewNum, reviewMent, reviewImg, productName,productNum, DATE_FORMAT(reviewDATE, '%Y-%m-%d') as reviewDATE, assessment from t3_review order by reviewNum;"; // 상품조회SQL
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'FAQ조회 오류',
                                      'warn_message':'조회된 FAQ가 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       id : req.query.id,
                                                       Detail : results }));  // 조회된 상품정보
                                                       // console.log(results[1]);
                 } // else;
           }); // db.query()

};

// ‘/’ get 메소드의 핸들러를 정의
router.get('/review/detail', PrintReviewDetail);


// 외부로 뺍니다.
module.exports = router
