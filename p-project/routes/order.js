const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   url = require('url');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');

const upload = multer({dest: __dirname + '/../public/images/uploads/products'});
// 업로드 디렉터리를 설정한다. 실제디렉터리: /home/bmlee/
// const  upload = multer({dest: __dirname + '/../uploads/products'});
const  router = express.Router();

// router.use(bodyParser.urlencoded({ extended: false }));
const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019'         //사용할 DB명
});

const PrintOrder = (req, res) => {//주문 결제 페이지
  let    htmlstream = '';
  let    body=req.body;
         console.log(body);
         var reSendingData='';
         reSendingData+=body.datepicker+','
         +body.hiddenProdName+','
         +body.hiddenPrice+','
         +body.hiddenMinPrice+','
         +body.hiddenImg+','
         +body.salePrice+','
         +body.stockAmount+','
         +body.hiddenProdNum;
         console.log(reSendingData);
       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       if (req.session.auth && req.session.shop) {  // 만약, 판매자가 로그인했다면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 판매자사용자메뉴
       }
       else if (req.session.auth) {  // 로그인했다면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
       }

       else {  //로그아웃한 상태라면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');
       }
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/orderpage.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       // if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
       //     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
       //                                       'logurl': '/users/logout',
       //                                       'loglabel': '로그아웃',
       //                                       'regurl': '/users/profile',
       //                                       'reglabel':req.session.who }));
       // }
       // else {
       // res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
       //                                    'logurl': '/users/auth',
       //                                    'loglabel': '로그인',
       //                                    'regurl': '/users/reg',
       //                                    'reglabel':'가입' }));
      var id=req.session.loginId;
      // var memberNum=25;//임시
      // sql_str="SELECT * from t3_member where memberNum ='"+id+"';";
      sql_str="SELECT * from t3_member where id ='"+id+"';";
      db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
          if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
          else if (results.length <= 0) {  // 로그인안됨
            popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
            res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
          }
          else {

              console.log(results[0]);
              console.log("멤버 테이블 조회");

              console.log(results);
              res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                'logurl': '/users/logout',
                                              'loglabel': '로그아웃',
                                                'regurl': '/users/profile',
                                              'reglabel': req.session.who,
                                                orderData : reSendingData,                  // 'category': searchType,
                                                memData : results}));
          }

      });

};

const HanlePayment = (req, res) => {//주문 결제 페이지
  let    htmlstream = '';
  let    body=req.body;
  console.log("------결제------");
  console.log(body);
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();

  if(month.length==1)
    month='0'+month;
  var today=""+year+"-"+month+"-"+day;
  var current=new Date(today);
  console.log(req.session.loginId);
  var getId=req.session.loginId;
  sql_str="SELECT memberNum from t3_member where id ='"+req.session.loginId+"';";
  db.query(sql_str, (error, results, fields) => {
    console.log(results[0].memberNum);
    db.query('INSERT INTO t3_order(receiver, orderDate, orderAddr, orderStatus, orderMessage, orderTel, orderProduct, orderProductName, optValNum, deliveryNum, deliveryCompany, deliveryDate, buyerId, buyerNum, orderQuantity) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [body.receiver, current, body.address, 0, body.recvMsg, body.tel1+body.tel2+body.tel3, parseInt(body.productNum), body.productName, null, null, null, body.deliveryDate, getId, results[0].memberNum, parseInt(body.quantity)],
        (error, results, fields) => {
          if (error) {
            console.log(error);
          } else {
              console.log("주문 성공.!");
          // res.redirect('/');
          var stockDate=new Date(body.deliveryDate);
          var stock_sql='select stockAmount, stockIdx from t3_stock where stockDATE="'+body.deliveryDate+'" and stockProduct='+parseInt(body.productNum)+';';
          db.query(stock_sql,(error, results, fields) => {  // 상품조회 SQL실행
              if (error) {
                console.log(error);
                res.status(562).end("AdminPrintProd: DB query is failed");
              }
              else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                popalert = fs.readFileSync(__dirname + '/../views/alerts/nopro.ejs','utf8');
                res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

              }else{//재고테이블 조회 성공
                console.log("재고 테이블 조회 성공");
                var updatedAmount=results[0].stockAmount-parseInt(body.quantity);
                var updateStockSql='update t3_stock set stockAmount = '+updatedAmount+' where stockIdx='+results[0].stockIdx+';';
                db.query(updateStockSql,(error, results, fields) => {  // 재고 업데이트
                    if (error) {
                      console.log(error);
                      res.status(562).end("AdminPrintProd: DB query is failed");
                    }
                    else{//재고 테이블 업데이트 성공
                        console.log("재고 테이블 업데이트 성공");
                        var leftPoint = body.point-body.usepoint;
                        console.log(body.point);
                        console.log(body.usepoint);
                        console.log(leftPoint);
                        var updateMemSql='update t3_member set point = '+leftPoint+' where id="'+req.session.loginId+'";';
                        db.query(updateMemSql,(error, results, fields) => {  // 재고 업데이트
                            if (error) {
                              console.log(error);
                              res.status(562).end("AdminPrintProd: DB query is failed");
                            }

                            else{
                              console.log("멤버 테이블 업데이트 성공");
                              res.redirect('/');
                              // res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                              //                                   'logurl': '/users/logout',
                              //                                 'loglabel': '로그아웃',
                              //                                   'regurl': '/users/profile',
                              //                                 'reglabel': req.session.who}));

                            }//멤버 포인트 업데이트 성공
                        });//멤버 포인트 업데이트
                    }//재고 테이블 업데이트 성공
                  });//재고 테이블 업데이트
              }//재고 테이블 조회 성공
          });//재고 테이블 조회
        }//주문 테이블 추가 성공
      });//주문 테이블 추가
    });// id로 memberNum 가져옴. 오류 예외처리를 하지 않았음
};//HanlePayment 종료


const PrintOrderList = (req, res) => {
    let    htmlstream = '';
    let    body=req.body;
    var    getMemberNum=req.session.memberNum;
    let    sql_str1;
    //var    page = req.params.page;

    sql_str1 ="SELECT orderNum, deliveryNum, orderProductName, deliveryCompany, DATE_FORMAT(orderDate, '%Y-%m-%d') as orderDate, DATE_FORMAT(deliveryDate, '%Y-%m-%d') as deliveryDate, orderStatus from t3_order where buyerNum='"+getMemberNum+"'order by orderNum desc;"; // 주문조회SQL

    if (req.session.auth)   {   // 로그인된 경우에만 처리한다
        htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/order/order_list.ejs','utf8');
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');

        res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});



        db.query(sql_str1, (error, results, fields) => {  // 주문조회 SQL실행
           if (error) { res.status(562).end("AdminPrintOrder: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 주문이 없다면, 오류메시지 출력
             popalert = fs.readFileSync(__dirname + '/../views/alerts/noorder.ejs','utf8');
             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
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
                      }
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       //length : results.length-1,
                                                       //page : page,
                                                       //previous : Number(page)-1,
                                                       //next : Number(page)+1,
                                                       //page_num : 10,
                                                       orderArray : orderArray,
                                                       orderdata : results }));  // 조회된 주문정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
         res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }

};



//  -----------------------------------  주문상세화면출력 -----------------------------------------
// 주문등록 입력양식을 브라우져로 출력합니다.
const PrintDetailOrder = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str2;
  let    body = req.body;
  var    getMemberNum=req.session.memberNum;
  let    read;
  const  query = url.parse(req.url, true).query;

       if (req.session.auth) { //  로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  //
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/order/order_list_consumer.ejs','utf8'); //
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         sql_str2 = "SELECT orderNum, receiver, orderDate, orderAddr, orderStatus, orderMessage, orderTel, orderProduct, orderProductName, optValNum, deliveryNum, deliveryCompany, deliveryDate, buyerId, buyerNum, orderQuantity From t3_order where buyerNum='"+getMemberNum+"'order by orderNum desc;";
         //sql_str5 = "select orderNum from t3_order where orderProduct = ANY (select productNum from t3_product where shopNum=ANY (select shopNum from t3_shop where masterNum='"+getMemberNum+"'1)) order by orderNum desc;";
         //sql_str2 = "select * from t3_order where orderProduct = ANY (select productNum from t3_product where shopNum=ANY (select shopNum from t3_shop where masterNum='"+getMemberNum+"'1)) order by orderNum desc;";



         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str2, (error, results, fields) => {  // 주문조회 SQL실행
           if (error) { res.status(562).end("PrintDetailOrder: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 주문이 없다면, 오류메시지 출력
             popalert = fs.readFileSync(__dirname + '/../views/alerts/nopro.ejs','utf8');
             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
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
             }

              res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                    'logurl': '/users/logout',
                                                    'loglabel': '로그아웃',
                                                    'regurl': '/users/profile',
                                                    'reglabel': req.session.who,
                                                     'buttonType':'submit', //submit or buttonType
                                                     'button1': '수정', //수정 or 이전
                                                     'button2': '삭제', //삭제 or 다음
                                                     'button3': '주문취소',
                                                     'admin':'',//주석처리 or 공백
                                                     'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                     orderNum : req.query.orderNum,
                                                     orderDetail : results,
                                                    orderArray : orderArray }));  // 조회된 주문정보

           } // else
        }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
         res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }
};

//------------------------------------------------------------------------------
// 주문삭제
const HandleCancleOrder = (req, res) => {
  let    body = req.body;
  const  query = url.parse(req.url, true).query;
  var orderNum=req.params.orderNum;
  // var    id = req.query.orderNum;

  if (req.session.auth && req.session.shop)   {   // 관리자로 로그인된 경우에만 처리한다

           db.query("delete from t3_order where orderNum=?", [body.orderNum], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("HandleCancleOrder: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/order/list');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};

//------------------------------------------------------------------------------
// 상점 주문 내역 조회
const PrintOrderShopList = (req, res) => {
    let    htmlstream = '';
    let    body=req.body;
    var    getMasterNum=req.session.memberNum;
    let    sql_str3;
    //var    page = req.params.page;
    sql_str3 = "select orderNum, deliveryNum, orderProductName, deliveryCompany, DATE_FORMAT(orderDate, '%Y-%m-%d') as orderDate, DATE_FORMAT(deliveryDate, '%Y-%m-%d') as deliveryDate, orderStatus from t3_order where orderProduct = ANY (select productNum from t3_product where shopNum = ANY (select shopNum from t3_shop where masterNum='"+getMasterNum+"')) order by orderNum desc;";

    //sql_str3 ="SELECT orderNum, deliveryNum, orderProductName, deliveryCompany, DATE_FORMAT(orderDate, '%Y-%m-%d') as orderDate, DATE_FORMAT(deliveryDate, '%Y-%m-%d') as deliveryDate, orderStatus from t3_order where masterNum='"+getMasterNum+"'order by orderNum desc;"; // 주문조회SQL

    if (req.session.auth)   {   // 로그인된 경우에만 처리한다
        htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/order/order_list_shop.ejs','utf8');
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');

        res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});



        db.query(sql_str3, (error, results, fields) => {  // 주문조회 SQL실행
           if (error) { res.status(562).end("AdminPrintOrder: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 주문이 없다면, 오류메시지 출력
             popalert = fs.readFileSync(__dirname + '/../views/alerts/noorder.ejs','utf8');
             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
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
                                                       //length : results.length-1,
                                                       //page : page,
                                                       //previous : Number(page)-1,
                                                       //next : Number(page)+1,
                                                       //page_num : 10,
                                                       orderArray : orderArray,
                                                       orderdata : results }));  // 조회된 주문정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
         res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }

};


//  -----------------------------------  상점주문상세화면출력 -----------------------------------------
// 주문등록 입력양식을 브라우져로 출력합니다.
const PrintDetailShopOrder = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str4;
  let    body = req.body;
  var    getMasterNum=req.session.memberNum;
  let    read;
  const  query = url.parse(req.url, true).query;

       if (req.session.auth) { //  로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  //
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/order/order_list_detail.ejs','utf8'); //
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         //sql_str4 = "SELECT orderNum, receiver, orderDate, orderAddr, orderStatus, orderMessage, orderTel, orderProduct, orderProductName, optValNum, deliveryNum, deliveryCompany, deliveryDate, buyerId, buyerNum, orderQuantity From t3_order where buyerNum='"+getMemberNum+"'order by orderNum desc;";
         sql_str4 = "select orderNum, receiver, orderDate, orderAddr, orderStatus, orderMessage, orderTel, orderProduct, orderProductName, optValNum, deliveryNum, deliveryCompany, deliveryDate, buyerId, buyerNum, orderQuantity from t3_order where orderProduct = ANY (select productNum from t3_product where shopNum=ANY (select shopNum from t3_shop where masterNum='"+getMasterNum+"')) order by orderNum desc;";


         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str4, (error, results, fields) => {  // 주문조회 SQL실행
           if (error) { res.status(562).end("PrintDetailOrder: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 주문이 없다면, 오류메시지 출력
             popalert = fs.readFileSync(__dirname + '/../views/alerts/noorder.ejs','utf8');
             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
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
                                                     'button3': '배송처리',
                                                     'admin':'',//주석처리 or 공백
                                                     'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                     orderNum : req.query.orderNum,
                                                     orderDetail : results }));  // 조회된 주문정보

           } // else
        }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
         res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }
};

//------------------------------------------------------------------------------
// 상품 배송
const HandleSendOrder = (req, res) => {
  let    body = req.body;
  const  query = url.parse(req.url, true).query;
  var    id = req.query.orderNum;
  console.log(body);
  if (req.session.auth && req.session.shop)   {   //  로그인된 경우에만 처리한다

           db.query("update t3_order SET orderStatus=?, deliveryNum=?, deliveryCompany=? where orderNum=?", [body.orderStatus, body.deliveryNum, body.deliveryCompany, id], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("HandleSendOrder: DB query is failed");
               } else {
                console.log("발송 성공! DB저장 완료!");
                res.redirect('/order/shoplist');
              } // else
           }); // db.query()
         }
         else  {  //  로그인하지 않고 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};


//  -----------------------------------  회원삭제화면출력 -----------------------------------------
// 회원등록 입력양식을 브라우져로 출력합니다.
const PrintDeleteShopOrder = (req, res) => {
  let    htmlstream = '';
  // let    htmlstream2 = '';
  //let    sql_str4;
  let    body = req.body;
  var    memberNum = req.params.memberNum;

       // if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/order/delete_order.ejs','utf8'); // 괸리자메인화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         // sql_str4 = "SELECT memberNum, name, id, pw, tel, email, gender, birth, per, point, smsRec, emailRec From t3_member;";

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
         res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                           'logurl': '/users/logout',
                                           'loglabel': '로그아웃',
                                           'regurl': '/users/profile',
                                           'reglabel': req.session.who,
                                            memberNum : memberNum }));  // 조회된 회원정보




};
//------------------------------------------------------------------------------
// 주문삭제
const HandleCancleShopOrder = (req, res) => {
  let    body = req.body;
  const  query = url.parse(req.url, true).query;
  var    id = req.query.orderNum;

  if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다

           db.query("delete from t3_order where orderNum=?", [body.orderNum], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("HandleCancleShopOrder: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/order/list');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};



router.post('/', PrintOrder);
router.post('/payment', HanlePayment);

router.get('/list', PrintOrderList);

router.get('/detail', PrintDetailOrder);
router.delete('/cancle/:orderNum', HandleCancleOrder);

router.get('/shoplist', PrintOrderShopList);

router.get('/shopdetail', PrintDetailShopOrder);
router.put('/send', HandleSendOrder);

router.get('/delete/:orderNum', PrintDeleteShopOrder);
router.delete('/shopcancle', HandleCancleShopOrder);



module.exports = router;
