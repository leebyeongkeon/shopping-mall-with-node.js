const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   url = require('url');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');

const upload = multer({dest: __dirname + '/../public/images/uploads/products'});
const   router = express.Router();
// const   fileUpload = require('express-fileupload');

const   db = mysql.createConnection({
        host: 'localhost', // DB서버 IP주소
        port: 3306, // DB서버 Port주소
        user: '2019pprj', // DB접속 아이디
        password: 'pprj2019', // DB암호
        database: 'db2019' //사용할 DB명
});

//  -----------------------------------  상품리스트 기능 -----------------------------------------
// (관리자용) 등록된 상품리스트를 브라우져로 출력합니다.
const AdminPrintProd = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str1;
  var    page = req.params.page;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminproduct.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str1 = "SELECT productNum, productName, price, bigCate, midCate, smallCate, shopName from t3_product order by productNum desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str1, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상품조회 오류',
                                      'warn_message':'조회된 상품이 없습니다.',
                                      'return_url':'/' }));
                   }
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
                                                       prodata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상품등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상품등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }

};

//  -----------------------------------  상품등록기능 -----------------------------------------
// 상품등록 입력양식을 브라우져로 출력합니다.
const PrintAddProductForm = (req, res) => {
    let    htmlstream = '';

        if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
            htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product/product_form.ejs','utf8'); // 괸리자메인화면
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
                                                         'warn_title':'상품등록기능 오류',
                                                         'warn_message':'관리자로 로그인되어 있지 않아서, 상품등록 기능을 사용할 수 없습니다.',
                                                         'return_url':'/' }));
        }

};

//------------------------------------------------------------------------------
// 상품등록 양식에서 입력된 상품정보를 신규로 등록(DB에 저장)합니다.
// const HandleAddProduct = (req, res) => {  // 상품등록
//   let    body = req.body;
//   let    htmlstream = '';
//   let    shopimage = '/images/uploads/product/'; // 상품이미지 저장디렉터리
//   var    picfile1 = req.files.productImg;
//   var    picfile2 = req.files.detailImg;
//   const  path1 = '/home/3team/svr/v0.8/sample/p-project/public/images/uploads/product/'+ picfile1.name;
//   const  path2 = '/home/3team/svr/v0.8/sample/p-project/public/images/uploads/product/'+ picfile2.name;
//        console.log(body);     // 이병문 - 개발과정 확인용(추후삭제).
//
//        if (req.session.auth && req.session.admin) {
//            if (body.productNum == '') {
//              console.log("상품번호가 입력되지 않아 DB에 저장할 수 없습니다.");
//              res.status(561).end('<meta charset="utf-8">상품번호가 입력되지 않아 등록할 수 없습니다');
//           }
//           else {
//               db.query('INSERT INTO t3_product (productNum, productName, shopNum, shopName, price, minPrice, bigCate, midCate, smallCate, productMent, productImg, detailImg ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//                     [body.productNum, body.productName,body.shopNum, body.shopName, body.price, body.minPrice,
//                      body.bigCate, body.midCate, null, body.productMent, picfile1.name, picfile2.name], (error, results, fields) => {
//                if (error) {
//                    htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
//                    res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
//                                  'warn_title':'상품등록 오류',
//                                  'warn_message':'상품 정보 등록 중 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
//                                  'return_url':'/' }));
//                 } else {
//                    picfile1.mv(path1);
//                    picfile2.mv(path2);
//                    console.log("상품등록에 성공하였으며, DB에 신규상품으로 등록하였습니다.!");
//                    res.redirect('/adminprod/list/1');
//                 }
//            });
//         }
//       }
//      else {
//          htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
//          res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
//                             'warn_title':'상품등록기능 오류',
//                             'warn_message':'관리자로 로그인되어 있지 않아서, 상품등록 기능을 사용할 수 없습니다.',
//                             'return_url':'/' }));
//        }
// };


const HandleAddProduct = (req, res) => {  // 상품등록
  let body = req.body;
  let htmlstream='';
  let sql_str;
  let    prodimage = '/images/uploads/products/';
  let    detailImg = '/images/uploads/products/';
  let    picfile = req.files[0];
  let    picfile2 = req.files[1];

  let    result = { originalName  : picfile.originalname,
                   size : picfile.size     }
  let    result2 = { originalName  : picfile2.originalname,
                   size : picfile2.size     }

          prodimage = prodimage + picfile.filename;
          detailImg = detailImg + picfile2.filename;
       console.log(body);

       if (req.session.auth && req.session.admin) {
           if (body.productNum == '') {
             console.log("상품번호가 입력되지 않아 DB에 저장할 수 없습니다.");
             res.status(561).end('<meta charset="utf-8">상품번호가 입력되지 않아 등록할 수 없습니다');
          }
          else {
            db.query('INSERT INTO t3_product(productNum, productName, price, shopName, shopNum, bigCate, midCate, smallCate, productImg, productMent, detailImg, optSetNum, minPrice, proOptNum) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
               [body.productNum, body.productName, body.price, body.shopName, body.shopNum, body.bigCate, body.midCate, null, prodimage, body.productMent, detailImg, null, body.minPrice, null], (error, results, fields) => {
               if (error) {
                   console.log(error);
                   htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                 'warn_title':'상품등록 오류',
                                 'warn_message':'상품 정보 등록 중 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                 'return_url':'/' }));
                } else {
                   // picfile1.mv(path1);
                   // picfile2.mv(path2);
                   console.log("상품등록에 성공하였으며, DB에 신규상품으로 등록하였습니다.!");
                   res.redirect('/adminprod/list/1');
                }
           });
        }
      }
     else {
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'상품등록기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 상품등록 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};


//  -----------------------------------  상품수정 화면 출력 -----------------------------------------
// 상품등록 입력양식을 브라우져로 출력합니다.
const PrintDetailProdForm = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str2;
  let    body = req.body;
  //let    read;
  const  query = url.parse(req.url, true).query;

       if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product/product_form_detail.ejs','utf8'); // 괸리자메인화면
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         sql_str2 = "select * from t3_product where productNum="+req.query.productNum+";";

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str2, (error, results, fields) => {  // 상품조회 SQL실행
           if (error) { res.status(562).end("PrintDetailProdForm: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                     htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                     res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                                   'warn_title':'상품조회 오류',
                                                                   'warn_message':'조회된 상품이 없습니다.',
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
                                                    // productNum : req.query.productNum,
                                                    productDetail : results }));  // 조회된 상품정보

           } // else
        }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
              htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                                           'warn_title':'상품등록기능 오류',
                                                           'warn_message':'관리자로 로그인되어 있지 않아서, 상품등록 기능을 사용할 수 없습니다.',
                                                           'return_url':'/' }));
       }
};

//------------------------------------------------------------------------------
// 상품수정 식에서 입력된 상품정보를 등록(DB에 저장)합니다.
const HandleUpdateProd = (req, res) => {  // 상품수정
  let    body = req.body;
  console.log('상품 정보 수정');
  console.log(body);

  if(body.imgFlag=='0'){
    db.query('update t3_product set productName=?, price=?, shopName=?, shopNum=?, bigCate=?, midCate=?, productMent=?, minPrice=? where productNum=?;',
        [body.productName, body.price, body.shopName, body.shopNum, body.bigCate, body.midCate, body.productMent, body.minPrice, body.productNum],
        (error, results, fields) => {
            if (error) {
                console.log(error);
                htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                                             'warn_title':'상품등록 오류',
                                                             'warn_message':'상품 정보 등록 중 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                                             'return_url':'/' }));
            } else {
                     // picfile1.mv(path1);
                     // picfile2.mv(path2);
                console.log("상품수정에 성공하였습니다.(이미지 수정X)!");
                res.redirect('/adminprod/list/1');
            }
      });
  }

  else if(body.imgFlag='1'){

    let    prodimage = '/images/uploads/products/';
    let    detailImg = '/images/uploads/products/';
    let    picfile = req.files[0];
    let    picfile2 = req.files[1];

    let    result = { originalName  : picfile.originalname,
                     size : picfile.size     }
    let    result2 = { originalName  : picfile2.originalname,
                     size : picfile2.size     }

    prodimage = prodimage + picfile.filename;
    detailImg = detailImg + picfile2.filename;


    db.query('update t3_product set productName=?, price=?, shopName=?, shopNum=?, bigCate=?, midCate=?, productImg=?, productMent=?, detailImg=?,  minPrice=? where productNum=?;',
        [body.productName, body.price, body.shopName, body.shopNum, body.bigCate, body.midCate, prodimage, body.productMent, detailImg, body.minPrice, body.productNum], (error, results, fields) => {
            if (error) {
                console.log(error);
                htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                                             'warn_title':'상품등록 오류',
                                                             'warn_message':'상품 정보 등록 중 DB저장 오류가 발생하였습니다. 원인을 파악하여 재시도 바랍니다',
                                                             'return_url':'/' }));
            } else {
                     // picfile1.mv(path1);
                     // picfile2.mv(path2);
                console.log("상품수정에 성공하였습니다.(이미지 수정O)!");
                res.redirect('/adminprod/list/1');
            }
      });


  }
};

const PrintDeleteCheck = (req, res) => {
  let body=req.body;
  console.log(body);
  let prodNum=req.params.prodNum;
  console.log(prodNum);
  let htmlstream='';
  htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/delete_check_product.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
  res.status(562).end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                               'logurl': '/users/logout',
                                               'loglabel': '로그아웃',
                                               'regurl': '/users/profile',
                                               'reglabel': req.session.who,
                                               productNum : prodNum }));

};



//  -----------------------------------  상품삭제화면출력 -----------------------------------------
// 상품등록 입력양식을 브라우져로 출력합니다.
// const PrintDeleteProdForm = (req, res) => {
//   let    htmlstream = '';
//   let    htmlstream2 = '';
//   let    sql_str3;
//   let    body = req.body;
//   const  query = url.parse(req.url, true).query;
//
       // if (req.session.auth && req.session.admin) { // 관리자로 로그인된 경우에만 처리한다
         // htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         // htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admin/adminbar.ejs','utf8');  // 관리자메뉴
         // htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product/product_form_delete.ejs','utf8'); // 괸리자메인화면
         // htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         // sql_str3 = "SELECT productNum, productName, shopNum, shopName, price, minPrice, bigCate, midCate, smallCate, productMent From t3_product;";

//          res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
//
//          db.query(sql_str3, (error, results, fields) => {  // 상품조회 SQL실행
//            if (error) { res.status(562).end("PrintDeleteProdForm: DB query is failed"); }
//            else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
//                      htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
//                      res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
//                                                                    'warn_title':'상품조회 오류',
//                                                                    'warn_message':'조회된 상품이 없습니다.',
//                                                                    'return_url':'/' }));
//            }
//            else {  // 조회된 상품이 있다면, 상품리스트를 출력
//                   res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
//                                                     'logurl': '/users/logout',
//                                                     'loglabel': '로그아웃',
//                                                     'regurl': '/users/profile',
//                                                     'reglabel': req.session.who,
//                                                     'buttonType':'submit', //submit or buttonType
//                                                     'button2': '삭제', //삭제 or 다음
//                                                     'admin':'',//주석처리 or 공백
//                                                     'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
//                                                     productNum : req.query.productNum,
//                                                     productDetail : results }));  // 조회된 상품정보
//            } // else
//         }); // db.query()
//        }
//        else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
//               htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
//               res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
//                                                            'warn_title':'상품삭제기능 오류',
//                                                            'warn_message':'관리자로 로그인되어 있지 않아서, 상품등록 기능을 사용할 수 없습니다.',
//                                                            'return_url':'/' }));
//        }
// };

//------------------------------------------------------------------------------
// 상품삭제
const HandleDeleteProd = (req, res) => {
  let    body = req.body;

  console.log(body);
  var prodNum=body.hiddenProdNum;

  if (req.session.auth && req.session.admin)   {
    db.query("delete from t3_product where productNum=?", [prodNum], (error, results, fields) => {  // 상품조회 SQL실행
        if (error) {
          res.status(562).end("HandleDeleteProd: DB query is failed");
        } else {
         console.log("삭제 성공! DB삭제 완료!");
         res.redirect('/adminprod/list/1');
       } // else
    });
  }
  else{
    htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
    res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                       'warn_title':'오류',
                       'warn_message':'관리자로 로그인 해야합니다.',
                       'return_url':'/' }));
  }



  // db.query("delete from t3_product where productNum=?", [body.productNum], (error, results, fields) => {  // 상품조회 SQL실행
  //     if (error) {
  //       res.status(562).end("HandleDeleteProd: DB query is failed");
  //     } else {
  //      console.log("삭제 성공! DB삭제 완료!");
  //      res.redirect('/adminprod/list/1');
  //    } // else
  // }); // db.query()
  //
  // const  query = url.parse(req.url, true).query;
  // var    id = req.query.productNum;
  //
  //
  // if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
  //
  //          db.query("delete from t3_product where productNum=?", [body.productNum], (error, results, fields) => {  // 상품조회 SQL실행
  //              if (error) {
  //                res.status(562).end("HandleDeleteProd: DB query is failed");
  //              } else {
  //               console.log("삭제 성공! DB삭제 완료!");
  //               res.redirect('/adminprod/list/1');
  //             } // else
  //          }); // db.query()
  //        }
  //        else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
  //          htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
  //          res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
  //                             'warn_title':'오류',
  //                             'warn_message':'관리자로 로그인 해야합니다.',
  //                             'return_url':'/' }));
  //        }
};


// REST API의 URI와 핸들러를 매핑합니다.
router.get('/list/:page', AdminPrintProd);      // 상품리스트를 화면에 출력

router.get('/product', PrintAddProductForm);   // 상품등록화면을 출력처리
router.post('/product', upload.array("photo",2), HandleAddProduct);    // 상품등록내용을 DB에 저장처리

router.get('/detail', PrintDetailProdForm);  //  상품상세화면을 출력처리 수정화면
router.post('/produpdate', upload.array("photo",2), HandleUpdateProd);   //  상품내용수정 put으로 하려고  했으나 계속 HanleAddProduct가 post로 구현했음

router.get('/checkdelete/:prodNum', PrintDeleteCheck);
// router.post('/checkdelete', PrintDeleteCheck);  // 상품 삭제 화면 출력
router.delete('/product', HandleDeleteProd);  // 상품 정보 삭제

// router.get('/', function(req, res) { res.send('respond with a resource 111'); });

module.exports = router;
