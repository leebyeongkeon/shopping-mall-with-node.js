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

// router.use(bodyParser.urlencoded({ extended: false }));

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019'         //사용할 DB명
});

//----------------------  상점세부 기능 -----------------------------------------
// (판매자용) 등록된 상점세부정보를 브라우져로 출력합니다.
const ShopPrintShop = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str1;
  let    body = req.body;
  const  query = url.parse(req.url, true).query;


       if (req.session.auth && req.session.shop)   {   // 상점으로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 상점메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop_detail2.ejs','utf8'); // 상점화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str1 = "SELECT shopNum, shopName, shopMent, openshopNum, masterEmail, shopAddr, shopStatus, masterNum, master from t3_shop where MasterNum="+ req.session.loginId +";"

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db1.query(sql_str1, (error, results, fields) => {  // 상점조회 SQL실행
               if (error) { res.status(562).end("ShopPrintShop: DB query is failed"); }
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
                                                   shopDetail : results }));  // 조회된 주문정보
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
  let    shopimage = '/images/uploads/shop/'; // 상품이미지 저장디렉터리
  let    picfile = req.files.shopImg;
  var    loginId = req.session.loginId
  const  path = '/home/3team/svr/v0.8/sample/p-project/public/images/uploads/shop/'+ picfile.name;
       console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).

       if (req.session.auth && req.session.shop) {
           if (body.shopNum == '') {
             console.log("상점번호가 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">상점번호가 입력되지 않아 등록할 수 없습니다');
          }
          else {
              db.query('UPDATE t3_shop SET shopName=?, shopImg=?, shopMent=?, masterEmail=?, shopAddr=?, masterNum=?, master=? WHERE masterNum=?',
                    [body.shopName, picfile.name, body.shopMent, body.masterEmail,
                     body.shopAddr, body.masterNum, body.master, loginId], (error, results, fields) => {
               if (error) {
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'상점수정 오류',
                                 'warn_message':'상점으로 수정할때 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                } else {
                   picfile.mv(path);
                   console.log("상점수정에 성공하였으며, DB에서 정보가 수정되었습니다.!");
                   res.redirect('/adminsh/list');
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

// REST API의 URI와 핸들러를 매핑합니다.

router.get('/list', ShopPrintShop);     // 상점수정화면을 출력처리
router.put('/list', HandleUpdateShop);  // 상점정보수정

router.get('/', function(req, res) { res.send('respond with a resource 111'); });
module.exports = router
