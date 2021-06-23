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

//  -----------------------------------  상품리스트 기능 -----------------------------------------
// (관리자용) 등록된 상품리스트를 브라우져로 출력합니다.
const PrintCategoryProd = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, search_cat;
  const  query = url.parse(req.url, true).query;

       console.log(query.category);

       if (req.session.auth)   {   // 로그인된 경우에만 처리한다

           switch (query.category) {
               case 'fan' : search_cat = "선풍기"; break;
               case 'aircon': search_cat = "에어컨"; break;
               case 'aircool': search_cat = "냉풍기"; break;
               case 'fridge': search_cat = "냉장고"; break;
               case 'minisun': search_cat = "미니선풍기"; break;
               default: search_cat = "선풍기"; break;
           }

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 사용자메뉴
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



//////////////////////////판매자용 상품 등록 폼 출력

const PrintRegistProduct = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/prodregist.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
           res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                             'reglabel':req.session.who }));
       }
       else {
          res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                          'logurl': '/users/auth',
                                          'loglabel': '로그인',
                                          'regurl': '/users/reg',
                                          'reglabel':'가입' }));
       }

};

// 상품 등록
const HandleRegistProduct = (req, res) => {
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


    if (body.productname == '' || body.price == '') {
         console.log("데이터입력이 되지 않아 DB에 저장할 수 없습니다.");
         res.status(561).end('<meta charset="utf-8">데이터가 입력되지 않아 상품등록을 할 수 없습니다');
    }
    else {
      //옵션 값들 먼저 옵션 테이블에 저장한 후 저장한 개수만큼 마지막 index에서부터 optNum값들 select 후 optNum값들을 구분자를 넣어서 prodcut테이블에 저장한다
      for(var i=0;i<body.optCount;i++){
        if(body.optCount==1){
          db.query('INSERT INTO t3_optSet(optSetName, optValue1, optValue2, optValue3, optValue4, optValue5) VALUES(?, ?, ?, ?, ?, ?);',
          [body.optName, body.optVal1, body.optVal2, body.optVal3, body.optVal4, body.optVal5],
          (error, results, fields) => {
            if (error) {
              console.log(error);
            }else {
                console.log("옵션 등록 성공.!");
            }
          });
        }
        else{
              db.query('INSERT INTO t3_optSet(optSetName, optValue1, optValue2, optValue3, optValue4, optValue5) VALUES(?, ?, ?, ?, ?, ?);',
              [body.optName[i], body.optVal1[i], body.optVal2[i], body.optVal3[i], body.optVal4[i], body.optVal5[i]],
              (error, results, fields) => {
                if (error) {
                  console.log(error);
                } else {
                    console.log("옵션 등록 성공.!");
                // res.redirect('/');

            }
          });
        }
      }
      sql_str="SELECT optSetNum from t3_optSet ORDER BY optSetNum DESC LIMIT "+body.optName.length+";";

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
                // res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                //                                   'logurl': '/users/logout',
                //                                   'loglabel': '로그아웃',
                //                                   'regurl': '/users/profile',
                //                                   // 'reglabel': req.session.who,
                //                                    prodata : results }));  // 조회된 상품정보
                console.log("옵션 저장 결과");
                console.log(results);
                console.log(results[0]);
                console.log(results[1]);
                console.log(results[0].optSetNum);
                var options = "";
                for(var j=0;j<body.optName.length;j++){
                  options+=results[j].optSetNum+',';
                }
                options=options.substr(0, options.length-1);
                console.log(options);

                sql_str = "select shopNum,shopName from t3_shop where masterNum=(select memberNum from t3_member where id='"+  req.session.loginId +"');";
                             console.log("SQL: " + sql_str);
                             db.query(sql_str, (error, results, fields) => {
                               if (error) { res.status(562).end("Login Fail as No id in DB!"); }
                               else {
                                  if (results.length <= 0) {  // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)

                                                           popalert = fs.readFileSync(__dirname + '/../views/alerts/noseller.ejs','utf8');
                                                           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));  //판매자가 아니라는 alert


                                   } else {  // select 조회결과가 있는 경우 (즉, 판매자인 경우)
                                     results.forEach((item, index) => {
                                        shopname=item.shopName; shopNum=item.shopNum;
                                        console.log("DB에서 검색 성공한 상점명:%s", shopname);
                                      }); /* foreach */
                      				  //옵션 값들 먼저 옵션 테이블에 저장한 후 저장한 개수만큼 마지막 index에서부터 optNum값들 select 후 optNum값들을 구분자를 넣어서 prodcut테이블에 저장한다
                             db.query('INSERT INTO t3_product(productName, price, shopName, shopNum, bigCate, midCate, smallCate, productImg, productMent, detailImg, optSetNum, minPrice, proOptNum) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',

                                [body.productname, body.price, shopname, shopNum, body.bigCate, body.midCate, body.smallCate, prodimage, body.productdesc, detailImg, null, body.minPrice, options],
                                (error, results, fields) => {
                                   if (error) {
                                     console.log(error);
                                     htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                                     res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                                        'warn_title':'상품등록 오류',
                                                        'warn_message':'이미 등록된 상품입니다.',
                                                        'return_url':'/' }));
                                   } else {
                                    console.log("상품등록에 성공하였으며, DB에 신규상품으로 등록하였습니다.!");
                                    res.redirect('/');
                                   }
                                });

                                    } // else
                                  }  // else
                             });
            } // else
      }); // db.query()


    }
};
router.get('/regist', PrintRegistProduct);
router.post('/registering', upload.array('photo', 2), HandleRegistProduct);
/////////////////////////////////////////판매자용 상품 등록 폼 출력/////////////////////////////////////////////////
const PrintDetailInfo = (req, res) => {//상품 상세정보 조회
  let    htmlstream = '';
  let    body=req.body;
  let    prodNum=body.productNum;
  console.log(prodNum)
       console.log("request값 : "+JSON.stringify(body));
       // console.log(body);

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
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

            var optNums = results[0].proOptNum.split(",").map(Number);
            console.log(optNums);
            console.log("옵션 테이블 조회");
            var opt_sql="SELECT * from t3_optSet where optSetNum in ("+optNums+");";

            db.query(opt_sql, (error, results2, fields) => {  // 상품조회 SQL실행
                  if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
                  else if (results2.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                      htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
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

                                res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                                  'logurl': '/users/logout',
                                                                  'loglabel': '로그아웃',
                                                                  'regurl': '/users/profile',
                                                                  'reglabel': req.session.who,
                                                                  // 'category': searchType,
                                                                   stockData: results3,
                                                                   optData : results2,
                                                                   prodata : results}));
                          }//재고조회 성공
                });//재고조회 전체

            }

          });
      }
    });

};

router.post('/detail', PrintDetailInfo);
////////////////////////////////////상품 상세정보 조회, 주문폼 출력//////////////////////////////////
module.exports = router;



const ProductAll = (req, res) => {
        let    htmlstream = '';
        let    htmlstream2 = '';
        let    sql_str="";
        let    body = req.body;
        let    currentPage=body.hiddenCurrent;
        // console.log(searchword);
        // console.log(body);
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 사용자메뉴
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product_all.ejs','utf8'); // 카테고리별 제품리스트
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
         sql_str += "select * from t3_product order by productNum desc;"; // 상품조회SQL


         console.log(sql_str);
         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

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
                                                                  'reglabel': req.session.who,
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
                                                      currentPage: currentPage,
                                                      prodata : results}));
                  }
                  else{
                    res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                      'logurl': '/users/users/auth',
                                                      'loglabel': '로그인',
                                                      'regurl': '/users/profile',
                                                      'reglabel': req.session.who,
                                                       currentPage: currentPage,
                                                       prodata : results}));
                  }
                }
         });
};
router.post('/all', ProductAll);
module.exports = router;
