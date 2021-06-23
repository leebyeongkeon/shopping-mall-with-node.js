const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   url = require('url');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   moment = require('moment');
const   multer = require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/../public/images/review');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
});

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

//  -----------------------------------  상품리스트 기능 -----------------------------------------
// (관리자용) 등록된 상품리스트를 브라우져로 출력합니다.
const PrintCategoryProd = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, search_cat;
  const  query = url.parse(req.url, true).query;

       console.log(query.category);

       if (req.session.auth)   {   // 로그인된 경우에만 처리한다



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
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT maker, pname, modelnum, rdate, price, pic from products where category='" + search_cat + "' order by rdate desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상품조회 오류',
                                      'warn_message':'조회된 상품이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
                    res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                                      'logurl': '/users/logout',
                                                      'loglabel': '로그아웃',
                                                      'regurl': '/users/profile',
                                                       'reglabel': req.session.who}));
                }
                else {
                   res.end(ejs.render(htmlstream, { 'title' : 'SlowMade',
                                                   'logurl': '/users/auth',
                                                   'loglabel': '로그인',
                                                   'regurl': '/users/reg',
                                                   'reglabel':'회원가입' }));
                }
                 } // else
           }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'로그인 필요',
                            'warn_message':'상품검색을 하려면, 로그인이 필요합니다.',
                            'return_url':'/' }));
       }
};

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/list', PrintCategoryProd);      // 상품리스트를 화면에 출력




const PrintDetailInfo = (req, res) => {//상품 상세정보 조회
  let    htmlstream = '';
  let    body=req.body;
  let    prodNum=body.productNum;
  var    sql_str2,sql_str3;
  console.log(prodNum)
       console.log("request값 : "+JSON.stringify(body));
       // console.log(body);

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
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/productDetail.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

      sql_str="SELECT * from t3_product where productNum ="+prodNum+";";
      db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
          if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
          else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
              htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              console.log(results);
              res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                        'warn_title':'상품조회 오류',
                                                        'warn_message':'조회된 상품이 없습니다.',
                                                        'return_url':'/' }));
          }
          else {
                  var opt_sql="SELECT * from t3_stock where stockProduct="+prodNum+";";
                  db.query(opt_sql, (error, results3, fields) => {  // 상품조회 SQL실행
                      if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
                      else if (results3.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                            popalert = fs.readFileSync(__dirname + '/../views/alerts/noproduct.ejs','utf8');
                            res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
                          }
                          else{
                                sql_str2 = "SELECT reviewNum, writer,writerNum,shopName,shopNum, reviewMent, reviewImg, productName, productNum, DATE_FORMAT(reviewDATE, '%Y-%m-%d') as reviewDATE,assessment, productNum from t3_review where productNum='"+prodNum+"'order by reviewNum;"; // 상품조회SQL
                                db.query(sql_str2, (error, results2, fields) => {  // 상품조회 SQL실행
                                      if (error) {
                                        console.log(error);
                                        res.status(562).end("AdminPrintProd: DB query is failed"); }
                                      else{
                                        sql_str3 = "select writer,DATE_FORMAT(date, '%Y-%m-%d') as date, enquiryNum, commentWriterNum, enquiryTitle, writerMent from t3_enquiry where prodNum='"+prodNum+"';";
                                        db.query(sql_str3, (error, results4, fields) => {  // 상품조회 SQL실행
                                              if (error) {
                                                console.log(error);
                                                res.status(562).end("AdminPrintProd: DB query is failed"); }
                                              else{
                                        res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                                          'logurl': '/users/logout',
                                                                          'loglabel': '로그아웃',
                                                                          'regurl': '/users/profile',
                                                                          'reglabel': req.session.who,
                                                                          // 'category': searchType,
                                                                           stockData: results3,
                                                                           review: results2,
                                                                           enquiry : results4,
                                                                           prodata : results}));
                                                                         }

                                                                       });//재고조회 전체

                                                             }

                                                           });
                                                         }
                                                       });

                                                     }
                                          });
                            };


////////////////////////////////////상품 상세정보 조회, 주문폼 출력//////////////////////////////////



const ProductAll = (req, res) => {
  let body=req.body;
  console.log(body);
  var page=req.params.page;
  console.log(sql_str);
  res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

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
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product_all.ejs','utf8'); // 카테고리별 제품리스트
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
  var sql_str = "select * from t3_product order by productNum desc;"; // 상품조회SQL

  db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
      if (error) {
          console.log(error);
          res.status(562).end("AdminPrintProd: DB query is failed"); }
      else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
          htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
          if(req.session.auth){
                res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                              'warn_title':'상품조회 오류',
                                                              'warn_message':'조회된 상품이 없습니다.',
                                                              'logurl': '/users/logout',
                                                              'loglabel': '로그아웃',
                                                              'regurl': '/users/profile',
                                                              'reglabel': req.session.who,
                                                              'return_url':'/' }));
          }
          else {
                res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                                              'warn_title':'상품조회 오류',
                                                              'warn_message':'조회된 상품이 없습니다.',
                                                              'logurl': '/users/users/auth',
                                                              'loglabel': '로그인',
                                                              'regurl': '/users/profile',
                                                              'reglabel':'회원가입',
                                                              'return_url':'/' }));
          }
      }////////////조회정보 없을 경우
      else {  // 조회된 상품이 있다면, 상품리스트를 출력
          if(req.session.auth){
                res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                  'logurl': '/users/logout',
                                                  'loglabel': '로그아웃',
                                                  'regurl': '/users/profile',
                                                  'reglabel': req.session.who,
                                                   length : results.length-1,
                                                   page : page,
                                                   previous : Number(page)-1,
                                                   next : Number(page)+1,
                                                   page_num : 16,
                                                   prodata : results}));
          }
          else{
                res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                  'logurl': '/users/users/auth',
                                                  'loglabel': '로그인',
                                                  'regurl': '/users/profile',
                                                  'reglabel':'회원가입',
                                                   length : results.length-1,
                                                   page : page,
                                                   previous : Number(page)-1,
                                                   next : Number(page)+1,
                                                   page_num : 16,
                                                   prodata : results}));
          }
      }
    });
  };








//  -----------------------------------  문의등록 폼 -----------------------------------------

const PrintEnquiryForm = (req, res) => {
  let    prodNum = req.body.productNum;
  let    htmlstream = '';
  var    sql_str;

  if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
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
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/enquiry/shopenquiryForm.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer


           sql_str="SELECT * from t3_product where productNum ="+prodNum+";";

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       list : results
                                                        }));  // 조회된 상품정보

                 } // else
           });
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
        }
       };



//--------------------------------- 문의 등록기능 --------------------------

const AddEnquiry = (req , res) => {
     let body = req.body;
     let htmlstream='';
     let today = moment().format("YYYY-MM-DD");
     var sql_str;
         console.log(body);

         if (req.session.auth) {
           sql_str = "select master, masternum from t3_shop where shopNum='"+body.shopNum+"';";
           db.query(sql_str,(error,results2,fields) => {
             if (error) {
               console.log(error);
               res.status(562).end("AdminPrintProd: DB query is failed");
             }
             else{
               db.query('INSERT INTO t3_enquiry (writer, date, enquiryTitle, writerMent,commentWriter,commentWriterNum, enquiryType, prodNum) VALUES (?,?, ?, ?, ?,?,?, ?)',
               [req.session.who,today, body.title, body.intro, results2[0].master, results2[0].masternum, body.category, body.prodNum],
               (error, results, fields) => {
                  if (error) {
                    console.log(error);
                    res.status(562).end("AdminPrintProd: DB query is failed");
                   }

                    else{
                   console.log("문의등록성공! DB저장 완료!");
                   res.redirect('/'); }
                  });
             }
           });
         } else {
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
           }
     };

     //  -----------------------------------  리뷰등록 폼 -----------------------------------------

     const PrintReviewForm = (req, res) => {
       let    htmlstream = '';
       var    sql_str,sql_str2;
       const  query = url.parse(req.url, true).query;
       let    id = req.query.orderNum;

       if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
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
                htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/reviewNew.ejs','utf8'); // 카테고리별 제품리스트
                htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

                sql_str="SELECT * from t3_order where buyerNum ="+req.session.memberNum+" and orderNum='"+id+"';";

                res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
                db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
                    if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
                   else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     console.log(results);
                     sql_str2="select shopName, shopNum from t3_product where productNum= '"+results[0].orderProduct+"';";
                     db.query(sql_str2,(error,results2)=>{
                       if(error){console.log(error)}
                       else{
                          res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                            'logurl': '/users/logout',
                                                            'loglabel': '로그아웃',
                                                            'regurl': '/users/profile',
                                                            'reglabel': req.session.who,
                                                            list : results,
                                                            shop : results2
                                                             }));  // 조회된 상품정보
                                                             }
                                                           });
                      } // else
                });
              }
              else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
                popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
                res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
             }
            };

            //--------------------------------- 리뷰 등록기능 --------------------------

            const AddReview = (req , res) => {
                 let body = req.body;
                 let htmlstream='';
                 let today = moment().format("YYYY-MM-DD");
                 let image = '/images/review/';
                 let picfile = req.file;
                 var sql_str;
                 let    result = { originalName  : picfile.originalname,
                                  size : picfile.size     }
                    image = image + picfile.filename;

                     console.log(body);

                     if (req.session.auth) {
                       sql_str = "select master, masternum from t3_shop where shopNum='"+body.shopNum+"';";
                       db.query(sql_str,(error,results2,fields) => {
                         if (error) {
                           console.log(error);
                           res.status(562).end("AdminPrintProd: DB query is failed");
                         }
                         else{
                           db.query('INSERT INTO t3_review (writer, writerNum, shopName, shopNum, reviewMent, reviewImg, productName, productNum, reviewDATE, assessment) VALUES (?,?,?,?,?,?,?,?,?,?)',
                           [req.session.who, req.session.memberNum, body.shopName,body.shopNum , body.intro, result.originalName, body.productName,body.prodNum, today, body.assessment],
                           (error, results, fields) => {
                              if (error) {
                                console.log(error);
                                res.status(562).end("AdminPrintProd: DB query is failed");
                               }

                                else{
                               console.log("문의등록성공! DB저장 완료!");
                               res.redirect('/'); }
                              });
                         }
                       });
                     } else {
                       popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
                       res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
                       }
                 };

const ProductListCategory = (req, res) => {
  let body=req.body;
  let cate=req.params.cate;
  console.log(body);
  console.log(cate);
  var category='';
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
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product_all.ejs','utf8'); // 카테고리별 제품리스트
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
  switch(Number(cate)){

    case 1:
      category+='목걸이';
      break;
    case 2:
      category+='귀걸이';
      break;
    case 3:
      category+='반지';
      break;
    case 4:
      category+='팔찌,발찌';
      break;
    case 5:
      category+='기타';
      break;
    case 6:
      category+='비누';
      break;
    case 7:
      category+='캔들';
      break;
    case 8:
      category+='디퓨저';
      break;
    case 9:
      category+='화장품';
      break;
    case 10:
      category+='향수';
      break;
    case 11:
      category+='가방';
      break;
    case 12:
      category+='신발';
      break;
    case 13:
      category+='모자';
      break;
    case 14:
      category+='지갑';
      break;
    case 15:
      category+='핸드폰 케이스';
      break;
    case 16:
      category+='에어팟/버즈 케이스';
      break;
    case 17:
      category+='파우치';
      break;
    case 18:
      category+='인형';
      break;
    case 19:
      category+='문구/팬시';
      break;
    case 20:
      category+='장난감';
      break;
    case 21:
      category+='디저트';
      break;
    case 22:
      category+='커피/차';
      break;
    case 23:
      category+='수제반찬';
      break;
  }
  var sql_cate="select * from t3_product where midCate='"+category+"';";
  console.log(sql_cate);
  db.query(sql_cate, (error, results, fields) => {
    if(error){
      console.log(error);
    }
    else if(results.length<=0){
      console.log("상품없음");
    }
    else{
      console.log(results);
      var page=1;
      res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                        'logurl': '/users/logout',
                                        'loglabel': '로그아웃',
                                        'regurl': '/users/profile',
                                        'reglabel': req.session.who,
                                         length : results.length-1,
                                         page : page,
                                         previous : Number(page)-1,
                                         next : Number(page)+1,
                                         page_num : 16,
                                         prodata : results}));  // 조회된 상품정보
    }
  });
};

router.get('/review/new', PrintReviewForm);
router.get('/category/:cate', ProductListCategory);
router.get('/all/:page', ProductAll);
router.post('/enquiry/form',PrintEnquiryForm);  //faq 등록 폼 출력
router.post('/detail', PrintDetailInfo);
router.post('/enquiry/new',AddEnquiry);       //공지사항 등록기능
router.post('/review/new',upload.single('file'),AddReview);       //리뷰 등록기능

module.exports = router;
