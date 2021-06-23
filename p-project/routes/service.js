const  express = require('express');
const  ejs = require('ejs');
const  fs = require('fs');
const  router = express.Router();
const  mysql = require('mysql');
const  url = require('url');
const  async = require('async');
const   moment = require('moment');
const   fileUpload = require('express-fileupload');


const  db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019',   //사용할 DB명
    multipleStatements: true
});
//---------------------------------FAQ -------------------------

const  PrintFAQList = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2= '';
  let    sql_str, search_cat;
  let    body = req.body;
  const  query = url.parse(req.url, true).query;

  if (req.session.auth) {
      htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
      if (req.session.auth && req.session.shop) {  // 만약, 판매자가 로그인했다면
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 판매자사용자메뉴
      }
      else {  // 로그인했다면
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
      }


      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/faq.ejs','utf8'); // 커뮤니티 메인
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
      sql_str = "SELECT faqNum, faqTitle, faqMent, hit, category from t3_faq order by hit;"; // 상품조회SQL
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
           if (error) {res.status(562).end("AdminPrintProd: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 공지가 없다면, 오류메시지 출력
               htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
               res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                  'warn_title':'FAQ 조회 오류',
                                  'warn_message':'고객센터 준비중',
                                  'return_url':'/' }));
               }
          else {  // 조회된 공지가 있다면, 공지리스트를 출력
                 res.end(ejs.render(htmlstream,
                   { 'title' : '쇼핑몰site',
                     'logurl': '/users/logout',
                     'loglabel': '로그아웃',
                     'regurl': '/users/profile',
                     'reglabel': req.session.who,
                     'category': search_cat,
                      faq : results }));  // 조회된 상품정보
             } // else
       }); // db.query()
     }
     else {
       htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
       popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
       res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
     }

};

// ‘/’ get 메소드의 핸들러를 정의
router.get('/faq', PrintFAQList);
//---------------------------------FAQ 상세정보-------------------------

const PrintFAQDetail = (req, res) => {
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
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/faqDetail.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT faqNum, faqTitle, faqMent, hit, category from t3_faq order by faqNum;"; // 상품조회SQL
           sql_str2 = "update t3_faq set hit = hit + 1 where faqNum= '"+ req.query.id+"';"
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str+sql_str2, (error, results, fields) => {  // 상품조회 SQL실행
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
                                                       faqDetail : results[0] }));  // 조회된 상품정보
                                                       // console.log(results[1]);
                 } // else;
           }); // db.query()

};

// ‘/’ get 메소드의 핸들러를 정의
router.get('/faq/detail', PrintFAQDetail);


//---------------------------------입점문의 -------------------------

const  PrintOpenshop = (req, res) => {
let    htmlstream = '';
    if (req.session.auth) {
            htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
            if (req.session.auth && req.session.shop) {  // 만약, 판매자가 로그인했다면
              htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 판매자사용자메뉴
            }
            else if (req.session.auth) {  // 로그인했다면
              htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
            }

            else {  //로그아웃한 상태라면
              htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');
            } // 일반사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/openshop.ejs','utf8'); // Content
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
          // true :로그인된 상태,  false : 로그인안된 상태
             res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰',
                                               'logurl': '/users/logout',
                                               'loglabel': '로그아웃',
                                               'regurl': '/users/profile',
                                               'reglabel':req.session.who }));  // 세션에 저장된 사용자명표시
              }
              else {

                popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
                res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
              }
            };


const HandleOpenshop = (req, res) => {
let body = req.body;
let htmlstream='';
let picfile = req.files.photo;
const path = '/home/3team/svr/v0.8/sample/p-project/public/images/uploads/shop/'+ picfile.name;



    console.log(body);

    if (req.session.auth) {

      sql_str = "select memberNum from t3_member where id= '"+  req.session.loginId +"';";
console.log("SQL: " + sql_str);
db.query(sql_str, (error, results, fields) => {
  if (error) { res.status(562).end("Login Fail as No id in DB!"); }
  else {
     if (results.length <= 0) {  // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)

                              popalert = fs.readFileSync(__dirname + '/../views/alerts/loginerr.ejs','utf8');
                              res.status(562).end(ejs.render(popalert,{'return_url':'/'}));  //로그인 하고 이용해라


      } else {  // select 조회결과가 있는 경우
        results.forEach((item, index) => {
           membernum=item.memberNum;
           console.log("DB에서 검색 성공한 회원번호:%s", membernum);
         }); /* foreach */
   //옵션 값들 먼저 옵션 테이블에 저장한 후 저장한 개수만큼 마지막 index에서부터 optNum값들 select 후 optNum값들을 구분자를 넣어서 prodcut테이블에 저장한다
   db.query('INSERT INTO t3_shop (shopName, master, masterTel, masterEmail, shopAddr,  shopMent, shopImg, masterNum) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
[body.name, body.manager, body.tel, body.email, body.address, body.intro, picfile.name,membernum], (error, results, fields) => {
if (error) {
htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                  'warn_title':'업체등록 오류',
                  'warn_message':'이미 판매자로 등록되어 있습니다.',
                  'return_url':'/' }));
} else {
picfile.mv(path);
console.log("업체등록에 성공! DB저장 완료!");
res.redirect('/');
}
});



       } // else
     }  // else
});


    }else {

        popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
        res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
      }
};
// ‘/’ get 메소드의 핸들러를 정의
router.get('/openshop', PrintOpenshop);
router.post('/openshop',HandleOpenshop);   // 회원가입내용을 DB에 등록처리

//######################################################################
//##########################1:1문의####################################
//####################################################################
//---------------------1:1문의리스트 페이지 출력----------------
const  PrintPBPList = (req, res) => {
let    htmlstream = '';
let    htmlstream2='';
let    sql_str, sql_str2;
const  query = url.parse(req.url, true).query;
console.log(query.category);
var page = req.params.page;

if (req.session.auth) {

    htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
    if(req.session.shop){
      // 일반사용자메뉴
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
   }else{
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
   }
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/enquiry/enquiry.ejs','utf8'); // 공지사항
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
    sql_str = "SELECT enquiryNum, DATE_FORMAT(date, '%Y-%m-%d') as date, enquiryTitle, writerMent, enquiryType from t3_enquiry where writer ='"+ req.session.who+"' order by enquiryNum;";
    sql_str2 = "SELECT faqNum, faqTitle, faqMent, hit, category from t3_faq order by hit;";

    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
    db.query(sql_str + sql_str2, (error, results) => {  // 상품조회 SQL실행
        if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }

       else {  // 조회된 공지가 있다면, 공지리스트를 출력
               res.end(ejs.render(htmlstream,
                { 'title' : '쇼핑몰site',
                  'logurl': '/users/logout',
                  'loglabel': '로그아웃',
                  'regurl': '/users/profile',
                  'reglabel': req.session.who,
                    length : results[0].length-1,
                    page : page,
                    previous : Number(page)-1,
                    next : Number(page)+1,
                    page_num : 5,
                    list : results[0],
                    faq : results[1] }));  // 조회된 상품정보
          } // else
    }); // db.query()
  }
    else {

      popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
      res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
    }


};

// ‘/’ get 메소드의 핸들러를 정의
router.get('/mallenquiry/list/:page', PrintPBPList);


//---------------------1:1문의 상세 페이지 출력----------------
const  PrintPBPDetail = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, sql_str2;
  const  query = url.parse(req.url, true).query;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/enquiryDetail.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT enquiryNum, writer, DATE_FORMAT(date, '%Y-%m-%d') as date, enquiryTitle, writerMent,  commentWriter, commentWriterNum, enquiryType from t3_enquiry order by enquiryNum;";
           sql_str2 = "select commentNum, commentMent, DATE_FORMAT(commentDATE, '%Y-%m-%d') as commentDATE, commentWriter from t3_comment where enquiryNum = '"+req.query.id+"' order by enquiryNum;";
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str+sql_str2, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'조회 오류',
                                      'warn_message':'조회된 문의가 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       'buttonType':'submit', //submit or buttonType
                                                       'button1': '수정', //수정 or 이전
                                                       'button2': '삭제', //삭제 or 다음
                                                       'admin':'',//주석처리 or 공백
                                                       'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                       id : req.query.id,
                                                       Detail : results[0],
                                                       comment : results[1]  }));  // 조회된 상품정보
                 } // else
           }); // db.query()
         }

  else if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/enquiry/enquiryDetail.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT enquiryNum, writer, DATE_FORMAT(date, '%Y-%m-%d') as date, enquiryTitle, writerMent,  commentWriter, commentWriterNum, enquiryType from t3_enquiry where writer = '"+req.session.who+"' order by enquiryNum;";
           sql_str2 = "select commentMent, DATE_FORMAT(commentDATE, '%Y-%m-%d') as commentDATE, commentWriter from t3_comment where enquiryNum = '"+req.query.id+"' order by enquiryNum;";
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str+sql_str2, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'조회 오류',
                                      'warn_message':'조회된 문의가 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       'buttonType':'submit', //submit or buttonType
                                                       'button1': '수정', //수정 or 이전
                                                       'button2': '삭제', //삭제 or 다음
                                                       'admin':'',//주석처리 or 공백
                                                       'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                       id : req.query.id,
                                                       Detail : results[0],
                                                       comment : results[1]  }));  // 조회된 상품정보
                                                       console.log(results[1])
                 } // else
           }); // db.query()
         }

         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력

           popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }

  };

// ‘/’ get 메소드의 핸들러를 정의
router.get('/mallenquiry/detail', PrintPBPDetail);

//---------------------1:1문의 폼 출력----------------
const  PrintPBPForm = (req, res) => {
let    htmlstream = '';

     if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/enquiry/enquiryForm.ejs','utf8'); // 공지사항
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

        res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
         res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                           'logurl': '/users/logout',
                                           'loglabel': '로그아웃',
                                           'regurl': '/users/profile',
                                           'reglabel':req.session.who }));  // 세션에 저장된 사용자명표시
     }
     else {
        res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                        'logurl': '/users/auth',
                                        'loglabel': '로그인',
                                        'regurl': '/users/reg',
                                        'reglabel':'가입' }));
     }

};
router.get('/mallenquiry/new', PrintPBPForm);

//--------------------------------문의 등록 기능---------------
const NewEnquiry = (req , res) => {
     let body = req.body;
     let htmlstream='';
     let today = moment().format("YYYY-MM-DD");
         if (req.session.auth) {
            db.query('INSERT INTO t3_enquiry (enquiryTitle, writer, date, writerMent, enquiryType) VALUES (?,?, ?, ?, ?)',
            [body.title,req.session.who, today, body.intro, body.category], (error, results, fields) => {
               if (error) {
                 htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                 res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                    'warn_title':'문의등록 오류',
                                    'warn_message':'문의등록 오류가 발생.',
                                    'return_url':'/' }));
               } else {
                console.log("문의등록성공! DB저장 완료!");
                res.redirect('/service/mallenquiry/list/1');
               }
            });

         } else {
           popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
           }
     };
router.post('/mallenquiry/new',NewEnquiry);       //공지사항 등록기능

//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ문의 수정 폼출력ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const EnquiryUpdateForm = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;

  if (req.session.auth )   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/enquiry/enquiryUpdateForm.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT enquiryNum, writer, DATE_FORMAT(date, '%Y-%m-%d') as date, enquiryTitle, writerMent,  commentWriter, commentWriterNum, enquiryType from t3_enquiry order by enquiryNum;";

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'오류',
                                      'warn_message':'없습니다.',
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
                 } // else
           }); // db.query() // 세션에 저장된 사용자명표시
            }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
        }
       };
router.get('/mallenquiry/update', EnquiryUpdateForm);

//------------------------------문의 수정 기능------------------------
const UpdateEnquiry = (req, res) => {
  let body = req.body;
  let    sql_str;
  const  query = url.parse(req.url, true).query;
  var id = req.query.id;
  let today = moment().format("YYYY-MM-DD");

  console.log(body);

  if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "update t3_enquiry set date=?, enquiryTitle=?, writerMent=? where enquiryNum=?"; // 상품조회SQL
           db.query(sql_str, [body.title,today,body.intro,id], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                console.log("수정성공! DB저장 완료!");
                res.redirect('/service/mallenquiry/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력

           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};
router.put('/mallenquiry/update',UpdateEnquiry);    //공지사항 수정기능


//  -----------------------------------  문의 삭제 -----------------------------------------

const DeleteEnquiry = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;
  var id = req.query.id;


  if (req.session.auth && req.session.admin)   {
           sql_str = "delete from t3_enquiry where enquiryNum = ?"; // 상품조회SQL
           db.query(sql_str,id, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {
                     console.log("삭제성공! DB에서 정보 삭제");
                     res.redirect('/adminbulletin/enquiry/list/1');
  // 조회된 상품정보
                 }
           }); // db.query()
         }
else if (req.session.auth)   {
           sql_str = "delete from t3_enquiry where enquiryNum = ?"; // 상품조회SQL
           db.query(sql_str,id, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {
                     console.log("삭제성공! DB에서 정보 삭제");
                     res.redirect('/service/mallenquiry/list/1');
// 조회된 상품정보
                 }
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }

};

router.delete('/mallenquiry/detail', DeleteEnquiry);  //공지사항 상세정보에서 삭제기능

//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ1대1문의 댓글기능ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
 const AddComment = (req , res) => {
      let body = req.body;
      let htmlstream='';
      let today = moment().format("YYYY-MM-DD");
      const  query = url.parse(req.url, true).query;
      var id2 = req.query.id;
      let sql1,sql2,sql3;

          if (req.session.auth ) {
            sql1 ="update t3_enquiry set commentWriterNum=?, commentWriter=? where enquiryNum=?;";
            sql2 ="insert into t3_comment (commentMent,commentDATE,enquiryNum,commentWriterNum,commentWriter,commentEnquirytype) values (?,?,?,?,?,?);";
             db.query(sql1+sql2,[req.session.memberNum ,req.session.who, id2,
               body.content, today, id2, req.session.memberNum,req.session.who,1], (error, results, fields) => {
                if (error) {
                  htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                  res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_title':'답변등록 오류',
                                     'warn_message':'답변등록 오류가 발생.',
                                     'return_url':'/' }));
                } else {
                 console.log("답변등록성공! DB저장 완료!");
                 res.redirect('/service/mallenquiry/detail?id='+id2);
                }
             });

          } else {
            popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
            res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
            }
      };
 router.post('/mallenquiry/detail',AddComment);       //공지사항 등록기능


 //-------------------------------댓글 삭제기능------------------------
 const AdminDeleteComment = (req, res) => {
   let body = req.body;
   let sql_str,sql_str2;
   const  query = url.parse(req.url, true).query;
   var id3 = req.query.id;
   params = [body.num];
   console.log(body);
// ,'미답변',0,id3
   if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
            sql_str = "delete from t3_comment where commentNum=?"; // 상품조회SQL
            // sql_str2 = "update t3_enquiry set commentWriter=?, commentWriterNum=? where enquiryNum=? "
            db.query(sql_str, params, (error, results, fields) => {  // 상품조회 SQL실행
                if (error) {
                  console.log(error);
                  res.status(562).end("AdminPrintProd: DB query is failed");
                } else {
                 console.log("삭제 성공! DB삭제 완료!");
                 res.redirect('/service/mallenquiry/detail?id='+id3);
               } // else
            }); // db.query()
          }
          else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
            popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
            res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
          }
 };
 router.put('/mallenquiry/detail',AdminDeleteComment);          //공지사항 리스트에서 삭제기능

// ‘/’ get 메소드의 핸들러를 정의
// 외부로 뺍니다.
module.exports = router
