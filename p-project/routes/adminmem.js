const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   url = require('url');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');
const   router = express.Router();

const   db = mysql.createConnection({
        host: 'localhost', // DB서버 IP주소
        port: 3306, // DB서버 Port주소
        user: '2019pprj', // DB접속 아이디
        password: 'pprj2019', // DB암호
        database: 'db2019' //사용할 DB명
});


//  -----------------------------------  회원리스트 기능 -----------------------------------------
// (관리자용) 등록된 회원리스트를 브라우져로 출력합니다.
const AdminPrintMember = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str1;
  var    page = req.params.page;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminmember.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str1 = "SELECT memberNum, name, id, gender, DATE_FORMAT(birth, '%Y-%m-%d') as birth, per from t3_member order by memberNum desc;"; // 회원조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str1, (error, results, fields) => {  // 회원조회 SQL실행
               if (error) { res.status(562).end("AdminPrintMember: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 회원이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'회원조회 오류',
                                      'warn_message':'조회된 회원이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 회원이 있다면, 회원리스트를 출력
                     var memberArray = new Array(results.length);
                     for(var i=0;i<results.length;i++){
                       if(results[i].per==0)
                          memberArray[i]="일반 계정";
                       else if(results[i].per==1)
                          memberArray[i]="상점 계정";
                       else if(results[i].per==9)
                          memberArray[i]="관리자 계정";
                     }
                     res.end(ejs.render(htmlstream,  { 'title' : '회원 정보 조회',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       length : results.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 10,
                                                       memberArray : memberArray,
                                                       memberdata : results }));  // 조회된 회원정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'회원등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 회원등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};

//  -----------------------------------  회원등록기능 -----------------------------------------
// 회원등록 입력양식을 브라우져로 출력합니다.
const PrintAddMemberForm = (req, res) => {
  let    htmlstream = '';

       if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/member/member_form.ejs','utf8'); // 괸리자메인화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
         res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                           'logurl': '/users/logout',
                                           'loglabel': '로그아웃',
                                           'regurl': '/users/profile',
                                           'reglabel': req.session.who }));
       }
       else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'회원등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 회원등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};

// 회원등록 양식에서 입력된 회원정보를 신규로 등록(DB에 저장)합니다.
const HandleAddMember = (req, res) => {  // 회원등록
  let    body = req.body;
  let    htmlstream = '';

       console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).

       if (req.session.auth && req.session.admin) {
           if (body.memberNum == '') {
             console.log("회원번호가 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">회원번호가 입력되지 않아 등록할 수 없습니다');
          }
          else {
              db2.query('INSERT INTO t3_member (memberNum , name , id , pw, tel, email, gender , birth , per, point, smsRec, emailRec) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [body.memberNum, body.name, body.id, body.pw, body.tel, body.email,
                    body.gender, body.birth, body.per, body.point, body.smsRec, body.emailRec], (error, results, fields) => {
               if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'회원등록 오류',
                                 'warn_message':'회원으로 등록할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                } else {
                   console.log("회원등록에 성공하였으며, DB에 신규회원으로 등록하였습니다.!");
                   res.redirect('/adminmem/list/1');
                }
           });
       }
      }
     else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'회원등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 회원등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};


//---------------------------회원상세화면출력 -----------------------------------
const PrintDetailMemberForm  = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str2;
  let    body = req.body;
  let    read;
  const  query = url.parse(req.url, true).query;

       if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/member/member_form_detail.ejs','utf8'); // 괸리자메인화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         sql_str2 = "SELECT memberNum, name, id, pw, tel, email, gender, birth, per, point, smsRec, emailRec From t3_member;";

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str2, (error, results, fields) => {  // 회원조회 SQL실행
           if (error) { res.status(562).end("PrintDetailMember: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 회원이 없다면, 오류메시지 출력
                     htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                     res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                                   'warn_title':'회원조회 오류',
                                                                   'warn_message':'조회된 회원이 없습니다.',
                                                                   'return_url':'/' }));
           }
           else {  // 조회된 회원이 있다면, 회원리스트를 출력

                  res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                    'logurl': '/users/logout',
                                                    'loglabel': '로그아웃',
                                                    'regurl': '/users/profile',
                                                    'reglabel': req.session.who,
                                                     'buttonType':'submit', //submit or buttonType
                                                     'button1': '수정', //수정 or 이전
                                                     'admin':'',//주석처리 or 공백
                                                     'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                     memberNum : req.query.memberNum,
                                                     memberDetail : results }));  // 조회된 회원정보

           } // else
        }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
              htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                                           'warn_title':'회원등록기능 오류',
                                                           'warn_message':'관리자로 로그인되어 있지 않아서, 회원등록 기능을 사용할 수 없습니다.',
                                                           'return_url':'/' }));
       }
};

//------------------------------------------------------------------------------

// 회원수정 식에서 입력된 회원정보를 등록(DB에 저장)합니다.
const HandleUpdateMember = (req, res) => {  // 회원수정
  let    body = req.body;
  let    htmlstream = '';
  const  query = url.parse(req.url, true).query;
  var id = req.query.memberNum;
  let sql_str3;
  console.log(body);

       if (req.session.auth && req.session.admin) {
           if (body.orderNum == '') {
             console.log("회원번호가 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">회원번호가 입력되지 않아 등록할 수 없습니다');
          }
          else {
            sql_str3 ="UPDATE t3_member SET name=?, id=?, pw=?, tel=?, email=?, gender=?, per=?, point=?, smsRec=?, emailRec=? where memberNum=?;";
              db.query(sql_str3,[ body.name, body.id, body.pw, body.tel, body.email, body.gender,
                     body.per, body.point, body.smsRec, body.emailRec, id], (error, results, fields) => {
               if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'회원정보수정 오류',
                                 'warn_message':'회원정보를 수정할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                } else {
                   console.log("회원정보를 수정하였으며, DB에 저장되었습니다.!");
                   res.redirect('/adminmem/list/1');
                }
           });
       }
      }
     else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'회원수정기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 회원수정 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};


//  -----------------------------------  회원삭제화면출력 -----------------------------------------
// 회원등록 입력양식을 브라우져로 출력합니다.
const PrintDeleteMemberForm = (req, res) => {
  let    htmlstream = '';
  // let    htmlstream2 = '';
  //let    sql_str4;
  let    body = req.body;
  var    memberNum = req.params.memberNum;

       // if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/delete_member.ejs','utf8'); // 괸리자메인화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         // sql_str4 = "SELECT memberNum, name, id, pw, tel, email, gender, birth, per, point, smsRec, emailRec From t3_member;";

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
         res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                           'logurl': '/users/logout',
                                           'loglabel': '로그아웃',
                                           'regurl': '/users/profile',
                                           'reglabel': req.session.who,
                                            memberNum : memberNum }));  // 조회된 회원정보





        //  db.query(sql_str4, (error, results, fields) => {  // 회원조회 SQL실행
        //    if (error) { res.status(562).end("PrintDeleteMember: DB query is failed"); }
        //    else if (results.length <= 0) {  // 조회된 회원이 없다면, 오류메시지 출력
        //              htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
        //              res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
        //                                                            'warn_title':'회원조회 오류',
        //                                                            'warn_message':'회원된 회원이 없습니다.',
        //                                                            'return_url':'/' }));
        //    }
        //    else {  // 조회된 회원이 있다면, 회원리스트를 출력
                  // res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                  //                                   'logurl': '/users/logout',
                  //                                   'loglabel': '로그아웃',
                  //                                   'regurl': '/users/profile',
                  //                                   'reglabel': req.session.who,
                  //                                   'buttonType':'submit', //submit or buttonType
                  //                                   'button2': '삭제', //삭제 or 다음
                  //                                   'admin':'',//주석처리 or 공백
                  //                                   'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                  //                                   memberNum : req.query.memberNum,
                  //                                   memberDetail : results }));  // 조회된 회원정보
        //    } // else
        // }); // db.query()
       // }
       // else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
       //        htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
       //        res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
       //                                                     'warn_title':'회원삭제기능 오류',
       //                                                     'warn_message':'관리자로 로그인되어 있지 않아서, 회원삭제 기능을 사용할 수 없습니다.',
       //                                                     'return_url':'/' }));
       // }
};

//------------------------------------------------------------------------------
// 회원삭제
const HandleDeleteMember = (req, res) => {
  let    body = req.body;
  // const  query = url.parse(req.url, true).query;
  var memberNum = body.hiddenMemNum;
  console.log(body);

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           db.query("delete from t3_member where memberNum=?", memberNum, (error, results, fields) => {  // 회원삭제 SQL실행
               if (error) {
                 res.status(562).end("HandleDeleteMember: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/adminmem/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
           res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                              'warn_title':'오류',
                              'warn_message':'관리자로 로그인 해야합니다.',
                              'return_url':'/' }));
         }
};

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/list/:page', AdminPrintMember);      // 회원리스트를 화면에 출력

router.get('/form', PrintAddMemberForm);   // 회원등록화면을 출력처리
router.post('/member', HandleAddMember);    // 회원등록내용을 DB에 저장처리

router.get('/detail', PrintDetailMemberForm);   // 회원 상세화면 출력
router.put('/detail', HandleUpdateMember);    // 화원 정보 수정

router.get('/delete/:memberNum', PrintDeleteMemberForm);   // 화원 삭제 화면 출력
router.delete('/delete', HandleDeleteMember);  // 회원 정보 삭제
// router.get('/', function(req, res) { res.send('respond with a resource 111'); });

module.exports = router;
