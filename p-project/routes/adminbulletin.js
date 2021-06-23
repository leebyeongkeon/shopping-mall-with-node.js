const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   url = require('url');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   router = express.Router();
const   moment = require('moment');
const   fileUpload = require('express-fileupload');


const   db = mysql.createConnection({
        host: 'localhost', // DB서버 IP주소
        port: 3306, // DB서버 Port주소
        user: '2019pprj', // DB접속 아이디
        password: 'pprj2019', // DB암호
        database: 'db2019' //사용할 DB명
});


//####################################################################################################
//##########################################공지사항##################################################
//###################################################################################################

//  -----------------------------------  공지사항리스트 기능 -----------------------------------------
const AdminPrintBull = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  var    page = req.params.page;
       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbulletin.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT infoNum, manager,DATE_FORMAT(infoDATE, '%Y-%m-%d') as infoDATE, infoMent, hit,  infoName from t3_info order by infoNum;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 5,
                                                        infodata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
         res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }

};

//  -----------------------------------  공지사항 상세정보 기능 -----------------------------------------

const AdminPrintBullDetail = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/infodetail.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT infoNum, manager,DATE_FORMAT(infoDATE, '%Y-%m-%d') as infoDATE, infoMent, hit,  infoName from t3_info order by infoNum;"; // 상품조회SQL

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
                                                       'buttonType':'submit', //submit or buttonType
                                                       'button1': '수정', //수정 or 이전
                                                       'button2': '삭제', //삭제 or 다음
                                                       'admin':'',//주석처리 or 공백
                                                       'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                       id : req.query.id,
                                                       infoDetail : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }

};

//  -----------------------------------  공지사항 등록 폼 -----------------------------------------

const AdminPrintInfoForm = (req, res) => {
  let    htmlstream = '';

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/infoForm.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                           'reglabel':req.session.who }));  // 세션에 저장된 사용자명표시
            }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
        }
       };
//--------------------------------- 공지사항 등록기능 --------------------------
  const AdminAddInfo = (req , res) => {
       let body = req.body;
       let htmlstream='';
       let today = moment().format("YYYY-MM-DD");

           console.log(body);

           if (req.session.auth && req.session.admin) {
              db.query('INSERT INTO t3_info (infoNum, infoName, manager, infoDATE, infoMent) VALUES (?,?, ?, ?, ?)', [body.num, body.title, body.manager, today, body.intro], (error, results, fields) => {
                 if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                      'warn_title':'공지등록 오류',
                                      'warn_message':'공지등록 오류가 발생.',
                                      'return_url':'/' }));
                 } else {
                  console.log("공지등록성공! DB저장 완료!");
                  res.redirect('/adminbulletin/list/1');
                 }
              });

           } else {
             popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
             }
       };

//------------------------------공지사항 선택 삭제기능------------------------
const AdminDeleteInfo = (req, res) => {
  let body = req.body;
  let    sql_str;
  var    page = req.params.page;
  console.log(body);

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "delete from t3_info where infoNum=?"; // 상품조회SQL
           db.query(sql_str, [body.info], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/adminbulletin/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};
//------------------------------공지 수정 폼 출력---------------------------
const AdminPrintInfoUpdate = (req, res) => {
  let    htmlstream = '';
  let htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/infoUpdateForm.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT infoNum, manager,DATE_FORMAT(infoDATE, '%Y-%m-%d') as infoDATE, infoMent, hit,  infoName from t3_info order by infoNum;"; // 상품조회SQL

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
                                                       infoDetail : results }));  // 조회된 상품정보
                 } // else
           }); // db.query() // 세션에 저장된 사용자명표시
            }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
        }
       };
//------------------------------공지사항 수정 기능------------------------
const AdminUpdateInfo = (req, res) => {
  let body = req.body;
  let    sql_str;
  let today = moment().format("YYYY-MM-DD");
  const  query = url.parse(req.url, true).query;
  var id = req.query.id;
  console.log(body);

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "update t3_info set infoName=?, manager=?, infoDATE=?, infoMent=? where infoNum=?"; // 상품조회SQL
           db.query(sql_str, [body.title,body.manager,today,body.intro,id], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                console.log("수정성공! DB저장 완료!");
                res.redirect('/adminbulletin/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};
//  -----------------------------------  공지사항 상세정보에서 삭제 -----------------------------------------

const AdminDeleteInfoDetail = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;
  var id = req.query.id;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "delete from t3_info where infoNum = ?"; // 상품조회SQL
           db.query(sql_str,id, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {
                     console.log("삭제성공! DB에서 정보 삭제");
                     res.redirect('/adminbulletin/list/1');
// 조회된 상품정보
                 }
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }

};

//####################################################################################################
//##########################################이벤트####################################################
//###################################################################################################

//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ이벤트리스트 출력ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const AdminPrintEventList = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  var page = req.params.page;
       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminEvent.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT eventNum, eventImg, manager, DATE_FORMAT(eventDATE, '%m-%d') as eventDATE, DATE_FORMAT(startDATE, '%m-%d') as startDATE,DATE_FORMAT(endDATE, '%m-%d') as endDATE,eventMent, hit, eTitle from t3_event order by eventNum;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }

              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 5,
                                                      event : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
         res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }

};

//  -----------------------------------  이벤트 상세정보 기능 -----------------------------------------

const AdminPrintEventDetail = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/eventDetail.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT eventNum, eventImg, manager, DATE_FORMAT(eventDATE, '%m-%d') as eventDATE, DATE_FORMAT(startDATE, '%m-%d') as startDATE,DATE_FORMAT(endDATE, '%m-%d') as endDATE,eventMent, hit, eTitle, eventDetail from t3_event order by eventNum;"; // 상품조회SQL

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
                                                       'buttonType':'submit', //submit or buttonType
                                                       'button1': '수정', //수정 or 이전
                                                       'button2': '삭제', //삭제 or 다음
                                                       'admin':'',//주석처리 or 공백
                                                       'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                       id : req.query.id,
                                                       Detail : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }

};

//  -----------------------------------  이벤트 등록 폼 -----------------------------------------

const AdminPrintEventForm = (req, res) => {
  let    htmlstream = '';

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/eventForm.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                           'reglabel':req.session.who }));  // 세션에 저장된 사용자명표시
            }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
        }
       };
//--------------------------------- 이벤트 등록기능 --------------------------
  const AdminAddEvent = (req , res) => {
       let body = req.body;
       let htmlstream='';
       let eventimage = '/images/event/';
       let picfile = req.files.reimg;
       let picfile2 = req.files.img;
       let today = moment().format("YYYY-MM-DD");
       const path = '/home/3team/svr/v0.8/sample/p-project/public/images/event/'+ picfile.name;
       const path2 = '/home/3team/svr/v0.8/sample/p-project/public/images/event/'+ picfile2.name;
           console.log(body);
           console.log(picfile);
           console.log(picfile2);

           if (req.session.auth && req.session.admin) {
              db.query('INSERT INTO t3_event (eventNum, eTitle, manager,eventDATE, startDATE, endDATE, eventMent,eventImg, eventDetail) VALUES (?,?, ?, ?, ?,?,?,?,?)',
             [body.num, body.title, body.manager, today, body.startdate, body.enddate, body.intro, picfile.name, picfile2.name], (error, results, fields) => {
                 if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                      'warn_title':'이벤트 등록 오류',
                                      'warn_message':'이벤트 등록 오류가 발생.',
                                      'return_url':'/' }));
                 } else {
                   picfile.mv(path);
                   picfile2.mv(path2);
                  console.log("공지등록성공! DB저장 완료!");
                  res.redirect('/adminbulletin/event/list/1');
                 }
              });

           } else {
             popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
             }
       };

//------------------------------- 이벤트 선택 삭제기능------------------------
const AdminDeleteEvent = (req, res) => {
  let body = req.body;
  let    sql_str;
  var    page = req.params.page;
  console.log(body);

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "delete from t3_event where eventNum=?"; // 상품조회SQL
           db.query(sql_str, [body.info], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/adminbulletin/event/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};
//------------------------------이벤트 수정 폼 출력---------------------------
const AdminPrintEventUpdate = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/eventUpdateForm.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT eventNum, eventImg, manager, DATE_FORMAT(eventDATE, '%m-%d') as eventDATE, DATE_FORMAT(startDATE, '%m-%d') as startDATE,DATE_FORMAT(endDATE, '%m-%d') as endDATE,eventMent, hit, eTitle, eventDetail from t3_event order by eventNum;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'오류',
                                      'warn_message':'있었는데 없어요.',
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
//------------------------------이벤트 수정 기능------------------------
const AdminUpdateEvent = (req, res) => {
  let body = req.body;
  let    sql_str;
  let today = moment().format("YYYY-MM-DD");
  const  query = url.parse(req.url, true).query;
  var id = req.query.id;
  let picfile = req.files.reimg;
  let picfile2 = req.files.img;
  const path = '/home/3team/svr/kkj/v0.4/p-project/public/images/event/'+ picfile.name;
  const path2 = '/home/3team/svr/kkj/v0.4/p-project/public/images/event/'+ picfile2.name;
  console.log(body);

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "update t3_event set eTitle=?, manager=?, eventDATE=?, startDATE=?, endDATE=?, eventMent=?, eventImg=?, eventDetail=? where eventNum=?"; // 상품조회SQL
           db.query(sql_str, [body.title,body.manager,today,body.startdate, body.enddate, body.intro,picfile.name, picfile2.name, id], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                 picfile.mv(path);
                 picfile2.mv(path2);
                console.log("수정성공! DB저장 완료!");
                res.redirect('/adminbulletin/event/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};
//  -----------------------------------  이벤트 상세정보에서 삭제 -----------------------------------------

const AdminDeleteEventDetail = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;
  var id = req.query.id;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "delete from t3_event where eventNum = ?"; // 상품조회SQL
           db.query(sql_str,id, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {
                     console.log("삭제성공! DB에서 정보 삭제");
                     res.redirect('/adminbulletin/event/list/1');
// 조회된 상품정보
                 }
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }

};


//####################################################################################################
//##########################################FAQ######################################################
//###################################################################################################

//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡFAQ 출력ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const AdminPrintFaqList = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  var    category;
  var page = req.params.page;


       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminFaq.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT faqNum, faqTitle, faqMent, category, hit from t3_faq order by faqNum;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 5,
                                                       list : results
                                                        }));  // 조회된 상품정보

                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
         res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }

};

//  -----------------------------------  FAQ 상세정보 기능 -----------------------------------------

const AdminPrintFaqDetail = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/faqdetail.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT faqNum, faqTitle, faqMent, category, hit from t3_faq order by faqNum;"; // 상품조회SQL

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
                                                       'buttonType':'submit', //submit or buttonType
                                                       'button1': '수정', //수정 or 이전
                                                       'button2': '삭제', //삭제 or 다음
                                                       'admin':'',//주석처리 or 공백
                                                       'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                       id : req.query.id,
                                                       Detail : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }

};

//  -----------------------------------  FAQ 등록 폼 -----------------------------------------

const AdminPrintFaqForm = (req, res) => {
  let    htmlstream = '';

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/faqForm.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                           'reglabel':req.session.who }));  // 세션에 저장된 사용자명표시
            }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
        }
       };
//--------------------------------- FAQ 등록기능 --------------------------
  const AdminAddFaq = (req , res) => {
       let body = req.body;
       let htmlstream='';

           console.log(body);

           if (req.session.auth && req.session.admin) {
              db.query('INSERT INTO t3_faq (faqNum, faqTitle, category, faqMent) VALUES (?,?, ?, ?)',
              [body.num, body.title, body.category, body.intro], (error, results, fields) => {
                 if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                      'warn_title':'FAQ등록 오류',
                                      'warn_message':'오류가 발생.',
                                      'return_url':'/' }));
                 } else {
                  console.log("공지등록성공! DB저장 완료!");
                  res.redirect('/adminbulletin/faq/list/1');
                 }
              });

           } else {
             popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
             }
       };

//------------------------------- FAQ 선택 삭제기능------------------------
const AdminDeleteFaq = (req, res) => {
  let body = req.body;
  let    sql_str;
  var    page = req.params.page;
  console.log(body);

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "delete from t3_faq where faqNum=?"; // 상품조회SQL
           db.query(sql_str, [body.info], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/adminbulletin/faq/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};
//------------------------------FAQ 수정 폼 출력---------------------------
const AdminPrintFaqUpdate = (req, res) => {
  let    htmlstream = '';
  let htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/faqUpdateForm.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT faqNum, faqTitle, faqMent, category, hit from t3_faq order by faqNum;"; // 상품조회SQL

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
//------------------------------FAQ 수정 기능------------------------
const AdminUpdateFaq = (req, res) => {
  let body = req.body;
  let    sql_str;
  const  query = url.parse(req.url, true).query;
  var id = req.query.id;
  // console.log(body);

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "update t3_faq set faqNum=?, faqTitle=?, category=?, faqMent=? where faqNum=?"; // 상품조회SQL
           db.query(sql_str, [body.num,body.title,body.category,body.intro,id], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                console.log("수정성공! DB저장 완료!");
                res.redirect('/adminbulletin/faq/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};
//  -----------------------------------FAQ 상세정보에서 삭제 -----------------------------------------

const AdminDeleteFaqDetail = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;
  var id = req.query.id;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "delete from t3_faq where faqNum = ?"; // 상품조회SQL
           db.query(sql_str,id, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {
                     console.log("삭제성공! DB에서 정보 삭제");
                     res.redirect('/adminbulletin/faq/list/1');
// 조회된 상품정보
                 }
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }

};
//###############################################################################
//##############################1:1문의##########################################
//##############################################################################3

//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ1:1문의 리스트 출력ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
const AdminPrintEnquiryList = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  var    category;
  var page = req.params.page;


       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminEnquiry.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT enquiryNum, writer, DATE_FORMAT(date, '%Y-%m-%d') as date, enquiryTitle, writerMent, commentWriterNum, enquiryType, commentWriter from t3_enquiry where enquiryType=1 order by enquiryNum;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 10,
                                                       list : results
                                                        }));  // 조회된 상품정보

                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
         res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }

};

//------------------------------- 1:1문의 선택 삭제기능------------------------
const AdminDeleteEnquiry = (req, res) => {
  let body = req.body;
  let    sql_str;
  var    page = req.params.page;
  console.log(body);

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "delete from t3_enquiry where enquiryNum=?"; // 상품조회SQL
           db.query(sql_str, [body.info], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/adminbulletin/enquiry/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};


//##################################################################
//############################입점문의 게시판########################
//##################################################################


// REST API의 URI와 핸들러를 매핑합니다.
router.get('/list/:page', AdminPrintBull);      // 공지사항 화면에 출력
router.get('/event/list/:page', AdminPrintEventList);      // 이벤트리스트 상세정보 출력
router.get('/faq/list/:page', AdminPrintFaqList);      // 이벤트리스트 출력
router.get('/enquiry/list/:page', AdminPrintEnquiryList);      // 1:1문의 리스트 출력

router.get('/info/detail', AdminPrintBullDetail);    //공지사항 상세정보 출력
router.get('/event/detail', AdminPrintEventDetail);   //이벤트 상세정보 출력
router.get('/faq/detail', AdminPrintFaqDetail);   //이벤트 상세정보 출력

router.get('/info/update', AdminPrintInfoUpdate);   //공지사항 수정 폼 출력
router.get('/event/update', AdminPrintEventUpdate);   //공지사항 수정 폼 출력
router.get('/faq/update', AdminPrintFaqUpdate);   //공지사항 수정 폼 출력

router.delete('/info/detail', AdminDeleteInfoDetail);  //공지사항 상세정보에서 삭제기능
router.delete('/event/detail', AdminDeleteEventDetail);  //공지사항 상세정보에서 삭제기능
router.delete('/faq/detail', AdminDeleteFaqDetail);  //공지사항 상세정보에서 삭제기능

router.get('/info/form',AdminPrintInfoForm);  //공지사항 등록 폼 출력
router.get('/event/form',AdminPrintEventForm);  //이벤트 등록 폼 출력
router.get('/faq/form',AdminPrintFaqForm);  //faq 등록 폼 출력

router.post('/list/:page',AdminDeleteInfo);          //공지사항 리스트에서 삭제기능
router.post('/event/list/:page',AdminDeleteEvent);          //이벤트 리스트에서 삭제기능
router.post('/faq/list/:page',AdminDeleteFaq);          //faq 리스트에서 삭제기능
router.post('/enquiry/list/:page',AdminDeleteEnquiry);          //문의 리스트에서 삭제기능

router.put('/info/update',AdminUpdateInfo);    //공지사항 수정기능
router.put('/event/update',AdminUpdateEvent);    //공지사항 수정기능
router.put('/faq/update',AdminUpdateFaq);    //공지사항 수정기능

router.post('/info/form',AdminAddInfo);       //공지사항 등록기능
router.post('/event/form',AdminAddEvent);       //공지사항 등록기능
router.post('/faq/form',AdminAddFaq);       //공지사항 등록기능


//router.put('/modify',upload.single('photo'), HandleModifyProduct);    // 상품수정내용을 DB에 저장처리
// router.get('/', function(req, res) { res.send('respond with a resource 111'); });

module.exports = router;
