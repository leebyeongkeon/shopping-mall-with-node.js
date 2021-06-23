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
const   multer = require('multer');
router.use(bodyParser.urlencoded({ extended: false }));

const upload = multer({dest: __dirname + '/../public/images/mainImg'});

const  db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019',         //사용할 DB명

});

//  -----------------------------------  메인화면 이미지 변경 폼 -----------------------------------------

const PrintAdminMain = (req, res) => {
  let    htmlstream = '';

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminmain.ejs','utf8'); // 이미지 변경 화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

           sql_str = "SELECT * FROM t3_mainImg ORDER BY idx DESC limit 1;";
          console.log("SQL: " + sql_str);


                   db.query(sql_str, (error, results, fields) => {
                     if (error) { res.status(562).end("find Fail "); }
                     else if (results.length <= 0){
                         // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)

                             popalert = fs.readFileSync(__dirname + '/../views/alerts/NoMember.ejs','utf8');
                             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
                                               }

                     else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)

                       results.forEach((item, index) => {
                          banner1 =item.banner1;
                          banner2= item.banner2;
                          banner3= item.banner3;






                        }); /* foreach */

                                   res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰',
                                                                     'logurl': '/users/logout',
                                                                     'loglabel': '로그아웃',
                                                                     'regurl': '/users/profile',
                                                                     'reglabel':req.session.who,
                                                                   'banner1':banner1, 'banner2':banner2, 'banner3':banner3 }));  // 세션에 저장된 사용자명표시
                          } // else

                   });




            }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
        }
       };
       //--------------------------------- 이미지 등록기능 --------------------------
         const HandleAdminMain = (req , res) => {







                                       let    banner1 = '/images/mainImg/';
                                       let    banner2 = '/images/mainImg/';
                                       let    banner3 = '/images/mainImg/';


                                       let    picfile1 = req.files[0];
                                       let    picfile2 = req.files[1];
                                       let    picfile3 = req.files[2];



                                       let    result = { originalName  : picfile1.originalname,
                                                        size : picfile1.size     }
                                       let    result2 = { originalName  : picfile2.originalname,
                                                        size : picfile2.size     }
                                       let    result3 = { originalName  : picfile3.originalname,
                                                        size : picfile3.size     }



                                                        banner1 = banner1 + picfile1.filename;
                                                        banner2 = banner2 + picfile2.filename;
                                                        banner3 = banner3 + picfile3.filename;







                  console.log(picfile1);
                  console.log(picfile2);

                  if (req.session.auth && req.session.admin) {
                     db.query('INSERT INTO t3_mainImg ( banner1,banner2,banner3) VALUES (?,?,?)',
                    [ banner1,banner2,banner3], (error, results, fields) => {
                        if (error) {
                          console.log("등록 실패.");
                          htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                          res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                             'warn_title':'이미지 등록 오류',
                                             'warn_message':'이미지 등록 오류가 발생.',
                                             'return_url':'/' }));

                        } else {

                         console.log("이미지등록성공! DB저장 완료!");
                         res.redirect('/');
                        }
                     });

                  } else {
                    popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
                    res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
                    }
              };



    const UserMainUI = (req, res) => {   // 확인용 사용자 메인화면 출력
              let    htmlstream = '';
                let    sql_str="";
                let    sql_str2="";
                let banner1;
                let banner2;
                let banner3;




                   htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분


                    //로그아웃한 상태라면
                     htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
                     htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/content.ejs','utf8'); // Content
                   htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer




                   var sql_main = 'select * from t3_product order by productNum desc limit 8;';
                   db.query(sql_main, (error, results, fields) => {  // 상품조회 SQL실행
                       if (error) {
                         console.log(error);
                         console.log("상품 검색 에러");
                         res.status(562).end("AdminPrintProd: DB query is failed");
                       }
                       else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                           htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                           res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                              'warn_title':'상품조회 오류',
                                              'warn_message':'조회된 상품이 없습니다.',
                                              'return_url':'/' }));
                           }
                       else {  // 조회된 상품이 있다면, 상품리스트를 출력

                         sql_str2 = "SELECT * FROM t3_mainImg ORDER BY idx DESC limit 1;";
                          console.log(sql_str2);
                           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
                           db.query(sql_str2, (error, results2, fields) => {
                               if (error) {
                                  console.log(error);
                                 res.status(562).end("AdminPrintProd: DB query is failed"); }
                               else if (results2.length <= 0) {
                                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');

                                 }////////////조회정보 없을 경우

                              else {  console.log("이미지 검색 실행");


                                             results2.forEach((item2, index) => {

                                                banner1= item2.banner1;
                                                banner2=item2.banner2;
                                                banner3=item2.banner3;
                                                logo=item2.logo;
                                                console.log(banner1);
                                                console.log(banner2);
                                                console.log(banner3);

                                              });


                                     if(req.session.auth){
                                     res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                                                       'logurl': '/users/logout',
                                                                       'loglabel': '로그아웃',
                                                                       'regurl': '/users/profile',
                                                                        'reglabel': req.session.who,
                                                                        prodata: results,
                                                                        'banner1':banner1, 'banner2':banner2, 'banner3':banner3,
                                                                       }));
                                    }
                                    else{
                                      res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                                                      'logurl': '/users/auth',
                                                                      'loglabel': '로그인',
                                                                      'regurl': '/users/reg',
                                                                      'reglabel':'회원가입',
                                                                      prodata: results,
                                                                      'banner1':banner1, 'banner2':banner2, 'banner3':banner3,
                                                                       }));
                                    }
                                    //<%=mainImage[0].logo%>
                                  }
                           });


                       }
                     });



              };








router.get('/mainimg', PrintAdminMain);      // 이미지 등록 화면 출력
router.post('/mainimg',upload.array('photo', 3), HandleAdminMain);      // 이미지 등록
router.get('/usermain', UserMainUI);
//router.get('/mainimg/modify', PrintAdminMainModify);
//router.put('/mainimg/modify', HandleAdminMainModify);






module.exports = router;
