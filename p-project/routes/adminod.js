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

//  -----------------------------------  주문리스트 기능 -----------------------------------------
// (관리자용) 등록된 주문리스트를 브라우져로 출력합니다.
const AdminPrintOrder = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str1;
  var    page = req.params.page;


       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminorder.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str1 = "SELECT orderNum, deliveryNum, orderProductName, deliveryCompany, DATE_FORMAT(orderDate, '%Y-%m-%d') as orderDate, DATE_FORMAT(deliveryDate, '%Y-%m-%d') as deliveryDate, orderStatus from t3_order order by orderNum desc;"; // 주문조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str1, (error, results, fields) => {  // 주문조회 SQL실행
               if (error) { res.status(562).end("AdminPrintOrder: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 주문이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'주문조회 오류',
                                      'warn_message':'조회된 주문이 없습니다.',
                                      'return_url':'/' }));
               }
              else {  // 조회된 주문이 있다면, 주문리스트를 출력
                      var orderArray = new Array(results.length);
                      for(var i=0;i<results.length;i++){
                        if(results[i].orderStatus==0)
                           orderArray[i]="발송 예정";
                        else if(results[i].orderStatus==1)
                           orderArray[i]="발송 완료";
                        else if(results[i].orderStatus==2)
                           orderArray[i]="배송 완료";
                           else if(results[i].orderStatus==3)
                              orderArray[i]="주문 취소";
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
                                                       orderArray : orderArray,
                                                       orderdata : results }));  // 조회된 주문정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'주문등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 주문등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};

//  -----------------------------------  주문등록기능 -----------------------------------------
// 주문등록 입력양식을 브라우져로 출력합니다.
const PrintAddOrderForm = (req, res) => {
  let    htmlstream = '';

       if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/order/order_form.ejs','utf8'); // 괸리자메인화면
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
                            'warn_title':'주문등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 주문등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};

//------------------------------------------------------------------------------

// 주문등록 양식에서 입력된 주문정보를 신규로 등록(DB에 저장)합니다.
const HandleAddOrder = (req, res) => {  // 주문등록
  let    body = req.body;
  let    htmlstream = '';

  console.log(body);

       if (req.session.auth && req.session.admin) {
           if (body.orderNum == '') {
             console.log("주문번호가 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">주문번호가 입력되지 않아 등록할 수 없습니다');
          }
          else {

              db.query('INSERT INTO t3_order (orderNum, receiver, orderDate, orderAddr, orderStatus, orderMessage, orderTel, orderProduct, orderProductNum, optValNum, deliveryNum, deliveryCompany, deliveryDate, buyerId, buyerName, orderQuantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [body.orderNum, body.receiver, body.orderDate, body.orderAddr, body.orderStatus, body.orderMessage, body.orderTel,
                     body.orderProduct, body.orderProductName, body.optValNum, body.deliveryNum, body.deliveryCompany, body.deliveryDate,
                     body.buyerId, body.buyer, body.orderQuantity], (error, results, fields) => {
               if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'주문등록 오류',
                                 'warn_message':'신규 주문을 등록할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/adminod/list/1' }));
                } else {
                   console.log("주문등록에 성공하였으며, DB에 신규주문으로 등록하였습니다.!");
                   res.redirect('/adminod/list/1');
                }
           });
       }
      }
     else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'주문등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 주문등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};

//  -----------------------------------  주문상세화면출력 -----------------------------------------
// 주문등록 입력양식을 브라우져로 출력합니다.
const PrintDetailOrderForm = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str2;
  let    body = req.body;
  let    read;
  const  query = url.parse(req.url, true).query;

       if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/order/order_form_detail.ejs','utf8'); // 괸리자메인화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         sql_str2 = "SELECT orderNum, receiver, orderDate, orderAddr, orderStatus, orderMessage, orderTel, orderProduct, orderProductName, optValNum, deliveryNum, deliveryCompany, deliveryDate, buyerId, buyerNum, orderQuantity From t3_order;";

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str2, (error, results, fields) => {  // 주문조회 SQL실행
           if (error) { res.status(562).end("PrintDetailOrder: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 주문이 없다면, 오류메시지 출력
                     htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                     res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                                   'warn_title':'주문조회 오류',
                                                                   'warn_message':'조회된 주문이 없습니다.',
                                                                   'return_url':'/' }));
           }
           else {  // 조회된 주문이 있다면, 주문리스트를 출력

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
                                                     orderNum : req.query.orderNum,
                                                     orderDetail : results }));  // 조회된 주문정보

           } // else
        }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
              htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                                           'warn_title':'주문등록기능 오류',
                                                           'warn_message':'관리자로 로그인되어 있지 않아서, 주문등록 기능을 사용할 수 없습니다.',
                                                           'return_url':'/' }));
       }
};

//------------------------------------------------------------------------------

// 주문수정 식에서 입력된 주문정보를 등록(DB에 저장)합니다.
const HandleUpdateOrder = (req, res) => {  // 주문수정
  let    body = req.body;
  let    htmlstream = '';
  const  query = url.parse(req.url, true).query;
  var id = req.query.orderNum;
  let sql_str3;
  console.log(body);

       if (req.session.auth && req.session.admin) {
           if (body.orderNum == '') {
             console.log("주문번호가 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">주문번호가 입력되지 않아 등록할 수 없습니다');
          }
          else {
            sql_str3 ="UPDATE t3_order SET receiver=?, orderDate=?, orderAddr=?, orderStatus=?, orderMessage=?, orderTel=?, orderProduct=?, orderProductName=?, deliveryNum=?, deliveryCompany=?, deliveryDate=?, buyerId=?, buyerNum=?, orderQuantity=? where orderNum=?;";
              db.query(sql_str3,[ body.receiver, body.orderDate, body.orderAddr, body.orderStatus, body.orderMessage, body.orderTel,
                     body.orderProduct, body.orderProductName, body.deliveryNum, body.deliveryCompany, body.deliveryDate,
                     body.buyerId,body.buyerNum, body.orderQuantity, id], (error, results, fields) => {
               if (error) {
                 console.log(sql_str3);
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'주문수정 오류',
                                 'warn_message':'주문내역을 수정할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                } else {
                   console.log("주문내역 수정하였으며, DB에 저장되었습니다.!");
                   res.redirect('/adminod/list/1');
                }
           });
       }
      }
     else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'주문등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 주문등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};


//  -----------------------------------  주문삭제화면출력 -----------------------------------------
// 주문등록 입력양식을 브라우져로 출력합니다.
const PrintDeleteOrderForm = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str4;
  let    body = req.body;
  const  query = url.parse(req.url, true).query;

       if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/order/order_form_delete.ejs','utf8'); // 괸리자메인화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         sql_str4 = "SELECT orderNum, receiver, orderDate, orderAddr, orderStatus, orderMessage, orderTel, orderProduct, orderProductName, optValNum, deliveryNum, deliveryCompany, deliveryDate, buyerId, buyerNum, orderQuantity From t3_order;";

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str4, (error, results, fields) => {  // 주문조회 SQL실행
           if (error) { res.status(562).end("PrintDeleteOrderForm: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 주문이 없다면, 오류메시지 출력
                     htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                     res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                                   'warn_title':'주문조회 오류',
                                                                   'warn_message':'조회된 주문이 없습니다.',
                                                                   'return_url':'/' }));
           }
           else {  // 조회된 주문이 있다면, 주문리스트를 출력
                  res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                    'logurl': '/users/logout',
                                                    'loglabel': '로그아웃',
                                                    'regurl': '/users/profile',
                                                    'reglabel': req.session.who,
                                                    'buttonType':'submit', //submit or buttonType
                                                    'button2': '삭제', //삭제 or 다음
                                                    'admin':'',//주석처리 or 공백
                                                    'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                    orderNum : req.query.orderNum,
                                                    orderDetail : results }));  // 조회된 주문정보
           } // else
        }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
              htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                                           'warn_title':'주문등록기능 오류',
                                                           'warn_message':'관리자로 로그인되어 있지 않아서, 주문등록 기능을 사용할 수 없습니다.',
                                                           'return_url':'/' }));
       }
};

//------------------------------------------------------------------------------
// 주문삭제
const HandleDeleteOrder = (req, res) => {
  let    body = req.body;
  const  query = url.parse(req.url, true).query;
  var id = req.query.orderNum;

  if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다

           db.query("delete from t3_order where orderNum=?", [body.orderNum], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("HandleDeleteOrder: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/adminod/list/1');
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
router.get('/list/:page', AdminPrintOrder);      // 주문리스트를 화면에 출력

router.get('/form', PrintAddOrderForm);   // 주문등록화면을 출력처리
router.post('/order', HandleAddOrder);    // 주문등록내용을 DB에 저장처리

router.get('/detail', PrintDetailOrderForm);  //  주문상세화면을 출력처리
router.put('/detail', HandleUpdateOrder);   //  주문내용수정

router.get('/delete', PrintDeleteOrderForm);  // 주문 삭제 화면 출력
router.delete('/delete', HandleDeleteOrder);  // 주문내용삭제

// router.get('/', function(req, res) { res.send('respond with a resource 111'); });

module.exports = router;
