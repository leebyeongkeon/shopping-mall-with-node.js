const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   url = require('url');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');
const   router = express.Router();
const   fileUpload = require('express-fileupload');

const   db = mysql.createConnection({
        host: 'localhost', // DB서버 IP주소
        port: 3306, // DB서버 Port주소
        user: '2019pprj', // DB접속 아이디
        password: 'pprj2019', // DB암호
        database: 'db2019' //사용할 DB명
});

//  -----------------------------------  상점리스트 기능 -----------------------------------------
// (관리자용) 등록된 상점리스트를 브라우져로 출력합니다.
const AdminPrintShop = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str1;
  var    page = req.params.page;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminshop.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str1 = "SELECT shopNum, shopName, master, shopStatus from t3_shop order by shopNum desc;"; // 상점조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str1, (error, results, fields) => {  // 상점조회 SQL실행
               if (error) { res.status(562).end("AdminPrintShop: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상점이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상점조회 오류',
                                      'warn_message':'조회된 상점이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상점이 있다면, 상점리스트를 출력
                      var shopArray = new Array(results.length);
                      for(var i=0;i<results.length;i++){
                        if(results[i].shopStatus==0)
                           shopArray[i]="입점 신청";
                        else if(results[i].shopStatus==1)
                           shopArray[i]="정상 영업";
                        else if(results[i].shopStatus==2)
                           shopArray[i]="영업 정지";
                      }
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
                                                       shopArray : shopArray,
                                                       shopdata : results }));  // 조회된 상점정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상점등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상점등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};



//  -----------------------------------  입점리스트 기능 -----------------------------------------
// (관리자용) 등록된 상점리스트를 브라우져로 출력합니다.
const AdminPrintOpenShop = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str9;
  var    page = req.params.page;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminshopopen.ejs','utf8');
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str9 = "SELECT shopNum, shopName, master, shopStatus from t3_shop  order by shopNum desc;"; // 상점조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str9, (error, results2, fields) => {  // 상점조회 SQL실행
               if (error) { res.status(562).end("AdminPrintShop: DB query is failed"); }
               else if (results2.length <= 0) {  // 조회된 상점이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상점조회 오류',
                                      'warn_message':'조회된 상점이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상점이 있다면, 상점리스트를 출력
                      var shopArray2 = new Array(results2.length);
                      for(var i=0;i<results2.length;i++){
                        if(results[i].shopStatus==0)
                           shopArray2[i]="입점 대기";
                        else if(results2[i].shopStatus==1)
                           shopArray2[i]="정상 영업";
                        else if(results2[i].shopStatus==2)
                           shopArray2[i]="영업 정지";
                      }
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       length : results2.length-1,
                                                       page : page,
                                                       previous : Number(page)-1,
                                                       next : Number(page)+1,
                                                       page_num : 10,
                                                       shopArray2 : shopArray2,
                                                       openshopdata : results2 }));  // 조회된 상점정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상점등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상점등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};

//  -----------------------------------  상점등록화면 -----------------------------------------
// 상점등록 입력양식을 브라우져로 출력합니다.
const PrintAddShopForm = (req, res) => {
  let    htmlstream = '';

       if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop/shop_form.ejs','utf8'); // 괸리자메인화면
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
                            'warn_title':'상점등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상점등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};

//------------------------------------------------------------------------------
// 상점등록 양식에서 입력된 상점정보를 신규로 등록(DB에 저장)합니다.
const HandleAddShop = (req, res) => {  // 상점등록
  let    body = req.body;
  let    htmlstream = '';
  let    shopimage = '/images/uploads/shop/'; // 상점이미지 저장디렉터리
  var    picfile = req.files.shopImg;
  const  path = '/home/3team/svr/v0.8/sample/p-project/public/images/uploads/shop/'+ picfile.name;
       console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).

       if (req.session.auth && req.session.admin) {
           if (body.shopNum == '') {
             console.log("상점번호가 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">상점번호가 입력되지 않아 등록할 수 없습니다');
          }
          else {
              db.query('INSERT INTO t3_shop (shopNum, shopName, shopImg, shopMent, openshopNum, masterEmail, shopAddr, shopStatus, masterNum, master) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [body.shopNum, body.shopName, picfile.name, body.shopMent, body.openshopNum, body.masterEmail,
                     body.shopAddr, body.shopStatus, body.masterNum, body.master], (error, results, fields) => {
               if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'상점등록 오류',
                                 'warn_message':'상점으로 등록할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                } else {
                   picfile.mv(path);
                   console.log("상점등록에 성공하였으며, DB에 신규상점으로 등록하였습니다.!");
                   res.redirect('/adminsh/list/1');
                }
           });
        }
      }
     else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상점등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상점등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};

//  -----------------------------------  상점세부 기능 -----------------------------------------
// (관리자용) 등록된 상점세부정보를 브라우져로 출력합니다.
const PrintDetailShop = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str2;
  let    body = req.body;
  const  query = url.parse(req.url, true).query;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop/shop_form_detail.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str2 = "SELECT shopNum, shopName, shopMent, openshopNum, masterEmail, shopAddr, shopStatus, masterNum, master from t3_shop;"

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str2, (error, results, fields) => {  // 상점조회 SQL실행
               if (error) { res.status(562).end("PrintDetailShop: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상점이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상점조회 오류',
                                      'warn_message':'조회된 상점이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상점이 있다면, 상점리스트를 출력
                res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                  'logurl': '/users/logout',
                                                  'loglabel': '로그아웃',
                                                  'regurl': '/users/profile',
                                                  'reglabel': req.session.who,
                                                  'buttonType':'submit', //submit or buttonType
                                                  'button1': '수정', //수정 or 이전
                                                  'admin':'',//주석처리 or 공백
                                                  'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                  shopNum : req.query.shopNum,
                                                  shopDetail : results }));  // 조회된 상점정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상점등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상점등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};

// 상점수정 양식에서 입력된 상점정보를 수정(DB에 저장)합니다.
const HandleUpdateShop = (req, res) => {  // 상점수정
  let    body = req.body;
  let    htmlstream = '';
  let    shopimage = '/images/uploads/shop/'; // 상점이미지 저장디렉터리
  var    picfile = req.files.shopImg;
  var    id = req.query.shopNum;
  const  path = '/home/3team/svr/v0.8/sample/p-project/public/images/uploads/shop/'+ picfile.name;
       console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).

       if (req.session.auth && req.session.admin) {
           if (body.shopNum == '') {
             console.log("상점번호가 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">상점번호가 입력되지 않아 등록할 수 없습니다');
          }
          else {
              db.query('UPDATE t3_shop SET shopName=?, shopImg=?, shopMent=?, openshopNum=?, masterEmail=?, shopAddr=?, shopStatus=?, masterNum=?, master=? WHERE shopNum=?',
                    [ body.shopName, picfile.name, body.shopMent, body.openshopNum, body.masterEmail,
                     body.shopAddr, body.shopStatus, body.masterNum, body.master, id], (error, results, fields) => {
               if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'상점수정 오류',
                                 'warn_message':'상점으로 수정할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                } else {
                   picfile.mv(path);
                   console.log("상점수정에 성공하였으며, DB에서 정보가 수정되었습니다.!");
                   res.redirect('/adminsh/list/1');
                }
           });
        }
      }
     else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상점수정기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상점수정 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};


//  -----------------------------------  상점삭제화면출력 -----------------------------------------
// 상점등록 입력양식을 브라우져로 출력합니다.
const PrintDeleteShop = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str3;
  let    body = req.body;
  const  query = url.parse(req.url, true).query;

       if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop/shop_form_delete.ejs','utf8'); // 괸리자메인화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         sql_str3 = "SELECT shopNum, shopName, shopMent, openshopNum, masterEmail, shopAddr, shopStatus, masterNum, master from t3_shop;"

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str3, (error, results, fields) => {  // 상점조회 SQL실행
           if (error) { res.status(562).end("PrintDeleteShop: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 상점이 없다면, 오류메시지 출력
                     htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                     res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                                   'warn_title':'상점조회 오류',
                                                                   'warn_message':'조회된 상점이 없습니다.',
                                                                   'return_url':'/' }));
           }
           else {  // 조회된 상점이 있다면, 상점리스트를 출력
                  res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                    'logurl': '/users/logout',
                                                    'loglabel': '로그아웃',
                                                    'regurl': '/users/profile',
                                                    'reglabel': req.session.who,
                                                    'buttonType':'submit', //submit or buttonType
                                                    'button2': '삭제', //삭제 or 다음
                                                    'admin':'',//주석처리 or 공백
                                                    'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                    shopNum : req.query.shopNum,
                                                    shopDetail : results }));  // 조회된 상점정보
           } // else
        }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
              htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                                           'warn_title':'상점등록기능 오류',
                                                           'warn_message':'관리자로 로그인되어 있지 않아서, 상점등록 기능을 사용할 수 없습니다.',
                                                           'return_url':'/' }));
       }
};

//------------------------------------------------------------------------------
// 상점삭제
const HandleDeleteShop = (req, res) => {
  let    body = req.body;
  const  query = url.parse(req.url, true).query;
  var    id = req.query.shopNum;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다

           db.query("delete from t3_shop where shopNum=?", [body.shopNum], (error, results, fields) => {  // 상점조회 SQL실행
               if (error) {
                 res.status(562).end("HandleDeleteShop: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/adminsh/list/1');
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


//  -----------------------------------  상점 매출 기능 -----------------------------------------
// (관리자용) 등록된 상점리스트와 매출을 브라우져로 출력합니다.
const PrintSalesShopForm = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    htmlstream3 = '';
  let    sql_str4;
  //let    sql_str6;
  let    sql_str8;
  var    page = req.params.page;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminsale.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str4 = "SELECT shopNum, shopName, master, shopStatus from t3_shop where shopStatus=1 order by shopNum desc;"; // 상점조회SQL
           //sql_str6 = "SELECT t3_shop.shopNum, t3_product.productNum, t3_product.price, t3_order.orderNum from t3_shop, t3_product, t3_order where t3_shop.shopNum=t3_product.shopNum and t3_product.productNum = t3_order.orderProduct order by shopNum;";
           sql_str8 = "SELECT t3_shop.shopNum, sum(t3_product.price) from (t3_shop, t3_product, t3_order) where (t3_shop.shopNum=t3_product.shopNum and t3_product.productNum = t3_order.orderProduct) GROUP BY shopNum;";

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str4, (error, results, fields) => {  // 상점조회 SQL실행
               if (error) { res.status(562).end("PrintSalesShopForm: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상점이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상점조회 오류',
                                      'warn_message':'조회된 상점이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상점이 있다면, 상점리스트를 출력
                      var shopArray = new Array(results.length);
                      for(var i=0;i<results.length;i++){
                        if(results[i].shopStatus==0)
                           shopArray[i]="입점 신청";
                        else if(results[i].shopStatus==1)
                           shopArray[i]="정상 영업";
                        else if(results[i].shopStatus==2)
                           shopArray[i]="영업 정지";

                        db.query(sql_str8, (error, results2, fiells) => {
                          if(error) {res.status(562).end("PrintSalesShopForm: DB query is failed");}
                          else if(results2.length<=0){
                              htmlstream3 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                              res.status(562).end(ejs.render(htmlstream3, { 'title': '알리미',
                                                                            'warn_title':'상점조회 오류',
                                                                            'warn_message':'조회된 상점이 없습니다.',
                                                                            'return_url':'/' }));
                          }
                          else{
                              var shopSale = new Array(results2.length);
                              for(var i=0; i<results2.length; i++){
                                  shopSale[i] = result2.sum(t3_product.price);
                              }

                          }
                        })
                      }
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
                                                       shopArray : shopArray,
                                                       //shopSale : shopSale,
                                                       shopdata : results }));  // 조회된 상점정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상점등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상점등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};


//  -----------------------------------  상점세부 기능 -----------------------------------------
// (관리자용) 등록된 상점세부정보를 브라우져로 출력합니다.
const PrintDetailSalesShop = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str5;
  let    body = req.body;
  const  query = url.parse(req.url, true).query;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop/shop_sales_detail.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str5 = "SELECT shopNum, shopName, shopMent, openshopNum, masterEmail, shopAddr, shopStatus, masterNum, master from t3_shop;"

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str5, (error, results, fields) => {  // 상점조회 SQL실행
               if (error) { res.status(562).end("PrintDetailShop: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상점이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상점조회 오류',
                                      'warn_message':'조회된 상점이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상점이 있다면, 상점리스트를 출력
                res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                  'logurl': '/users/logout',
                                                  'loglabel': '로그아웃',
                                                  'regurl': '/users/profile',
                                                  'reglabel': req.session.who,
                                                  'buttonType':'submit', //submit or buttonType
                                                  'button1': '수정', //수정 or 이전
                                                  'admin':'',//주석처리 or 공백
                                                  'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                  shopNum : req.query.shopNum,
                                                  shopDetail : results }));  // 조회된 상점정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상점등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상점등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};


// REST API의 URI와 핸들러를 매핑합니다.
router.get('/list/:page',AdminPrintShop);  // 상점리스트를 화면에 출력

router.get('/openshop', AdminPrintOpenShop);  // 입점문의만 화면에 출력

router.get('/form', PrintAddShopForm);       // 상점등록화면을 출력처리
router.post('/shop', HandleAddShop);             // 상점등록내용을 DB에 저장처리

router.get('/detail', PrintDetailShop); //  상점상세화면을 출력처리
router.put('/detail', HandleUpdateShop);    // 상점수정내용을 DB에 저장처리

router.get('/delete', PrintDeleteShop); //상점삭제화면을 출력처리
router.delete('/delete', HandleDeleteShop); //  상점삭제내용을 DB에 저장처리

router.get('/sales', PrintSalesShopForm); // 상점매출화면을 출력처리
router.get('/salesdetail', PrintDetailSalesShop);  //상점 매출 세부내역 조회

// router.get('/', function(req, res) { res.send('respond with a resource 111'); });

module.exports = router;
