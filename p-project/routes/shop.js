const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   url = require('url');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   moment = require('moment');
const   multer = require('multer');

const upload = multer({dest: __dirname + '/../public/images/uploads/products'});

const  router = express.Router();

// router.use(bodyParser.urlencoded({ extended: false }));
const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019',         //사용할 DB명
    multipleStatements: true

});
const ShopMyPage = (req, res) => {
    let    htmlstream = '';
    htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/mypage_shop.ejs','utf8');
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
    var masterName=req.session.who;
    var sql_shop = "SELECT * from t3_shop where master ='"+masterName+"';";
    db.query(sql_shop, (error, results, fields) => {
      if (error) {
        console.log(error)
        res.status(562).end("AdminPrintProd: DB query is failed");
      }
      else if (results.length <= 0) {  // 샵 정보 없음
        popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
        res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
      }
      else {
        res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                          'logurl': '/users/logout',
                                        'loglabel': '로그아웃',
                                          'regurl': '/users/profile',
                                        'reglabel': req.session.who,
                                         shopData : results }));
      }
    });

};

const ShopUpdateForm = (req, res) => {
    let    htmlstream = '';
    htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopupdate.ejs','utf8');
    htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
    res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

    var shopName=req.session.who;
    var sql_shop = "SELECT * from t3_shop where shopName ='"+shopName+"';";
    db.query(sql_shop, (error, results, fields) => {
      if (error) {
        console.log(error)
        res.status(562).end("AdminPrintProd: DB query is failed");
      }
      else if (results.length <= 0) {  // 샵 정보 없음
        popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
        res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
      }
      else {
        res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                          'logurl': '/users/logout',
                                        'loglabel': '로그아웃',
                                          'regurl': '/users/profile',
                                        'reglabel': req.session.who,
                                         shopData : results }));
      }
    });

};
const HandleShopUpdate = (req, res) => {
    let body=req.body;
    console.log(body);
    if(body.imgFlag=='1'){
        let    shopImg = '/images/uploads/products/';
        let    picfile=req.file;
        let    result = { originalName  : picfile.originalname,
                         size : picfile.size     }
        console.log(picfile.filename);
        console.log(picfile.size);
        shopImg = shopImg + picfile.filename;
        var shop_sql="update t3_shop set shopMent=?, masterEmail=?, shopAddr=?, master=?, masterTel=?, shopImg=? where shopName=?;";
        db.query(shop_sql, [body.shopMent, body.masterEmail, body.shopAddr,  body.master, body.masterTel, shopImg, req.session.who],
        (error, results, fields) => {
          if(error){
            console.log(error);
          }
          else{
            console.log("상점 정보 수정 완료");
            res.redirect('/shop');
          }
        });
    }
    else{
      var shop_sql="update t3_shop set shopMent=?, masterEmail=?, shopAddr=?, master=?, masterTel=? where shopName=?;";
      db.query(shop_sql, [body.shopMent, body.masterEmail, body.shopAddr,  body.master, body.masterTel, req.session.who],
      (error, results, fields) => {
        if(error){
          console.log(error);
        }
        else{
          console.log("상점 정보 수정 완료");
          res.redirect('/shop');
        }
      });
    }

};
const PrintRegistProduct = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
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
      // for(var i=0;i<body.optCount;i++){
      //   if(body.optCount==1){
      //     db.query('INSERT INTO t3_optSet(optSetName, optValue1, optValue2, optValue3, optValue4, optValue5) VALUES(?, ?, ?, ?, ?, ?);',
      //     [body.optName, body.optVal1, body.optVal2, body.optVal3, body.optVal4, body.optVal5],
      //     (error, results, fields) => {
      //       if (error) {
      //         console.log(error);
      //       }else {
      //           console.log("옵션 등록 성공.!");
      //       }
      //     });
      //   }
      //   else{
      //         db.query('INSERT INTO t3_optSet(optSetName, optValue1, optValue2, optValue3, optValue4, optValue5) VALUES(?, ?, ?, ?, ?, ?);',
      //         [body.optName[i], body.optVal1[i], body.optVal2[i], body.optVal3[i], body.optVal4[i], body.optVal5[i]],
      //         (error, results, fields) => {
      //           if (error) {
      //             console.log(error);
      //           } else {
      //               console.log("옵션 등록 성공.!");
      //           // res.redirect('/');
      //
      //       }
      //     });
      //   }
      // }
      // sql_str="SELECT optSetNum from t3_optSet ORDER BY optSetNum DESC LIMIT "+body.optName.length+";";
      //
      // db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
      //     if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
      //     else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
      //         htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
      //         res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
      //                            'warn_title':'상품조회 오류',
      //                            'warn_message':'조회된 상품이 없습니다.',
      //                            'return_url':'/' }));
      //         }
          // else {  // 조회된 상품이 있다면, 상품리스트를 출력
                // res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                //                                   'logurl': '/users/logout',
                //                                   'loglabel': '로그아웃',
                //                                   'regurl': '/users/profile',
                //                                   // 'reglabel': req.session.who,
                //                                    prodata : results }));  // 조회된 상품정보
                // console.log("옵션 저장 결과");
                // console.log(results);
                // console.log(results[0]);
                // console.log(results[1]);
                // console.log(results[0].optSetNum);
                // var options = "";
                // for(var j=0;j<body.optName.length;j++){
                //   options+=results[j].optSetNum+',';
                // }
                // options=options.substr(0, options.length-1);
                // console.log(options);

                sql_str = "select shopNum,shopName from t3_shop where masterNum=(select memberNum from t3_member where id='"+  req.session.loginId +"');";
                             console.log("SQL: " + sql_str);
                             db.query(sql_str, (error, results, fields) => {
                               if (error) {
                                 console.log(error);
                                 res.status(562).end("Login Fail as No id in DB!");
                               }
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
                                [body.productname, body.price, results[0].shopName, results[0].shopNum, body.bigCate, body.midCate, null, prodimage, body.productdesc, detailImg, null, body.minPrice, null],
                                (error, results2, fields) => {
                                   if (error) {
                                     console.log(error);
                                     htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                                     res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                                        'warn_title':'상품등록 오류',
                                                        'warn_message':'이미 등록된 상품입니다.',
                                                        'return_url':'/' }));
                                   } else {
                                    console.log("상품등록에 성공하였으며, DB에 신규상품으로 등록하였습니다.!");
                                    res.redirect('/shop/product_list/1');
                                   }
                                });

                                    } // else
                                  }  // else
                             });
            // } // else
      // }); // db.query()


    }
};

const PrintProductList = (req, res) => {
  var    page = req.params.page;
  var sql="select * from t3_product where shopName='"+req.session.who+"';";
  var htmlstream = '';
  htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop_product_list.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
  res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
  db.query(sql, (error, results, fields) => {
    if(error){
      //쿼리 오류
      res.redirect('/shop');
    }
    else if(results.length <= 0){//상품이 없을 경우
      res.redirect('/shop');
    }
    else{//조회 상품 있을 경우
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
                                       prodata : results }));
    }
  });
};

const PrintUpdateForm = (req, res) => {
  var prodNum = req.params.prodNum;
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/produpdate.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       var sql = "select * from t3_product where productNum="+prodNum+";";
       db.query(sql, (error, results, fields) => {
         if(error){
           console.log(error);
         }
         else if(results.length<=0){
           console.log("조회된 상품이 없음");
         }
         else{
             if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
                 res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                   'logurl': '/users/logout',
                                                   'loglabel': '로그아웃',
                                                   'regurl': '/users/profile',
                                                   'reglabel':req.session.who,
                                                    prodata : results}));
             }
             else {
                res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                                'logurl': '/users/auth',
                                                'loglabel': '로그인',
                                                'regurl': '/users/reg',
                                                'reglabel':'가입' }));
             }
         }
       });

};
const HandleProdUpdate = (req, res) => {
  let body = req.body;
  console.log(body);
  var sql_shop="select shopName from t3_shop where masterNum=(select memberNum from t3_member where id='"+  req.session.loginId +"');";
  db.query(sql_shop, (error, results, fields) => {
    if(error){
      console.log(error);
    }
    else if(results.length<=0){
      console.log("없음");
    }
    else{
      console.log(results[0]);
      if(body.imgFlag=="1"){
        let    productImg = '/images/uploads/products/';
        let    picfile = req.files[0];
        let    result = { originalName  : picfile.originalname,
                         size : picfile.size     }

        let    detailImg = '/images/uploads/products/';
        let    picfile2 = req.files[1];
        let    result2 = { originalName  : picfile2.originalname,
                         size : picfile2.size     }

        console.log(picfile.filename);
        console.log(picfile.size);

        productImg = productImg + picfile.filename;
        detailImg = detailImg + picfile2.filename;

        var shop_sql="update t3_product set productName=?, price=?, shopName=?, bigCate=?, midCate=?, productMent=?, minPrice=?, productImg=?, detailImg=? where productNum=?;";
        db.query(shop_sql, [body.productname, body.price, results[0].shopName, body.bigCate, body.midCate, body.productdesc, body.minPrice, productImg, detailImg, body.productNum],
        (error, results, fields) => {
          if(error){
            console.log(error);
          }
          else{
            console.log("상품 정보 수정 완료");
            res.redirect('/shop/product_list/1');
          }
        });
      }
      else if(body.imgFlag="0"){
        var shop_sql="update t3_product set productName=?, price=?, shopName=?, bigCate=?, midCate=?, productMent=?, minPrice=? where productNum=?;";
        db.query(shop_sql, [body.productname, body.price, results[0].shopName, body.bigCate, body.midCate, body.productdesc, body.minPrice, body.productNum],
        (error, results, fields) => {
          if(error){
            console.log(error);
          }
          else{
            console.log("상품 정보 수정 완료");
            res.redirect('/shop/product_list/1');
          }
        });
      }
    }
  });
};

const PrintDeleteProduct = (req, res) => {
  let body=req.body;
  console.log(body);
  let prodNum=req.params.prodNum;
  console.log(prodNum);
  let htmlstream='';
  htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 관리자메뉴
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/delete_shop_product.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
  res.status(562).end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                               'logurl': '/users/logout',
                                               'loglabel': '로그아웃',
                                               'regurl': '/users/profile',
                                               'reglabel': req.session.who,
                                                productNum : prodNum }));
};

const HandleDeleteProduct = (req, res) => {
  let body=req.body;
  console.log(body);

  if (req.session.auth && req.session.shop) {
    var sql='delete from t3_product where productNum='+body.hiddenProdNum+';';
    db.query(sql, (error, results, fields) => {
      if(error){
        console.log(error);
      }
      else{
        // res.redirect('/shop/product_list/1');
        console.log("상품 삭제 성공");
        res.redirect('/shop/product_list/1');
      }
    });
  }
  else{
    var htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
    res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                       'warn_title':'상품등록기능 오류',
                       'warn_message':'판매자로 로그인되어 있지 않아서, 상품삭제 기능을 사용할 수 없습니다.',
                       'return_url':'/' }));
  }

};



const PrintStockList = (req, res) => {
  let body = req.body;
  let    htmlstream = '';
  var    page = req.params.page;
  var memberNum=req.session.memberNum;
       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/stock_manage.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
  var stocklist_sql='select * from t3_stock where shopNum=(select shopNum from t3_shop where masternum='+memberNum+');';
  console.log(stocklist_sql);
  db.query(stocklist_sql, (error, results, fields) => {
    if(error){
      console.log(error);
    }
    else if(results.length<=0){
      console.log("상품 물량 없음");
    }
    else{
      console.log(results[0].stockDATE);
      res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                        'logurl': '/users/logout',
                                        'loglabel': '로그아웃',
                                        'regurl': '/users/profile',
                                        'reglabel':req.session.who,
                                        length : results.length-1,
                                        page : page,
                                        previous : Number(page)-1,
                                        next : Number(page)+1,
                                        page_num : 5,
                                        stockData : results}));
    }
  });
};

const PrintStockAdd = (req, res) => {
  let htmlstream='';
  htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/stockadd.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
  var sql='select * from t3_product where shopNum=(select shopNum from t3_shop where masternum='+req.session.memberNum+');'
  db.query(sql, (error, results, fields) =>{
    if(error){
      console.log(error);
    }
    else if(results.length<=0){
      console.log("등록된 상품 없음");
    }
    else{
      res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                        'logurl': '/users/logout',
                                        'loglabel': '로그아웃',
                                        'regurl': '/users/profile',
                                        'reglabel':req.session.who,
                                         prodata : results}));
    }
  });
};


const HandleAddStock = (req, res) => {
    let body=req.body;
    console.log(body);
    var stockProd=body.selectStockProd.split(',');
    var shopNum_sql='select shopNum from t3_shop where masternum='+req.session.memberNum+';';
    db.query(shopNum_sql, (error, result_shop, fields) => {
      if(error){
        console.log(error);
      }
      else if(result_shop.length<=0){
        console.log("등록된 상점이 없을 경우");
      }
      else{
        console.log(result_shop);
        var sql='insert into t3_stock(stockProduct, stockDATE, stockAmount, shopNum, stockProdName) values(?,?,?,?,?);';
        db.query(sql, [Number(stockProd[1]), body.stockDate, body.stockQuantity, result_shop[0].shopNum, stockProd[0]], (error, results, fields) => {
          if(error){
            console.log(error);
          }
          else{
            console.log('추가 제작 등록 성공');
            res.redirect('/shop/stock/1');
          }
        });
      }
    });
};
const PrintStockUpdate = (req, res) => {
  let htmlstream='';
  htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/stockupdate.ejs','utf8');
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');

  var prod_sql='select * from t3_product where shopNum=(select shopNum from t3_shop where masternum='+req.session.memberNum+');'
  var stockIdx=req.params.stockIdx;
  var sql='select * from t3_stock where stockIdx='+stockIdx+';';

  db.query(sql, (error, results, fiedls) => {
    if(error){
      console.log(error);
    }
    else{
      console.log(results);
      db.query(prod_sql, (error, results2, fields) => {
        if(error){
          console.log(error);
        }
        else{
          res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                            'logurl': '/users/logout',
                                            'loglabel': '로그아웃',
                                            'regurl': '/users/profile',
                                            'reglabel':req.session.who,
                                             prodata: results2,
                                             stockData : results}));
        }
      });
    }
  });
};

const HandleUpdateStock = (req, res) => {
  let body = req.body;
  console.log(body);

  var prodInfo=body.selectStockProd.split(',');
  var sql='update t3_stock set stockProduct=?, stockDATE=?, stockAmount=?, stockProdName=? where stockIdx=?';
  db.query(sql, [Number(prodInfo[1]), body.stockDate, Number(body.stockQuantity), prodInfo[0], body.stockIdx],(error, results, fields) => {
    if(error){
      console.log(error);
    }
    else{
      console.log("재고 업데이트 성공");
      res.redirect('/shop/stock/1');
    }
  });
};
const HandleDeleteStock = (req, res) => {
  let body=req.body;
  var stockIdx=body.checkedStock;
  console.log(stockIdx);
  var sql_str='delete from t3_stock where stockIdx='+stockIdx+';';
  db.query(sql_str, (error, results, fields) => {
    if(error){
      console.log(error);
    }
    else{
      console.log("성공적으로 삭제됨");
      res.redirect('/shop/stock/1');
    }
  });
};

//---------------------------------리뷰관리----------------------

const  PrintReviewManage = (req, res) => {   // 메인화면을 출력합니다
  let    htmlstream = '';
  let    htmlstream2='';
  let    sql_str, sql_str2;
  const  query = url.parse(req.url, true).query;
  var page = req.params.page;
if(req.session.auth){
      htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 일반사용자메뉴
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop/reviewManage.ejs','utf8'); // 공지사항
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
      sql_str = "select shopNum from t3_shop where masternum='"+req.session.memberNum+"';";
      res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

      db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
          if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
          else {

            sql_str2 = "SELECT reviewNum, writer,shopNum, reviewMent, reviewImg,  DATE_FORMAT(reviewDATE, '%Y-%m-%d') as reviewDATE, productNum, productName from t3_review where shopNum='"+results[0].shopNum+"' order by reviewNum;"; // 상품조회SQL
            db.query(sql_str2,(error,results2,fields) => {
              if(error){
                console.log(error);
                res.status(562).end("AdminPrintProd: DB query is failed");
              }else{
                console.log(results2);
                res.end(ejs.render(htmlstream,
                  { 'title' : '쇼핑몰site',
                    'logurl': '/users/logout',
                    'loglabel': '로그아웃',
                    'regurl': '/users/profile',
                    'reglabel': req.session.who,
                      length : results2.length-1,
                      page : page,
                      previous : Number(page)-1,
                      next : Number(page)+1,
                      page_num : 10,
                      review : results2 }));

              }
            });

            }
            });

            } // else
}; // db.query()
//---------------------------------문의관리----------------------

const  PrintEnquiryManage = (req, res) => {   // 문의 출력합니다
  let    htmlstream = '';
  let    htmlstream2='';
  let    sql_str, sql_str2;
  const  query = url.parse(req.url, true).query;
  var page = req.params.page;

if(req.session.auth){
      htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 일반사용자메뉴
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop/enquiryManage.ejs','utf8'); // 공지사항
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
      sql_str = "select masternum from t3_shop where masternum='"+req.session.memberNum+"';";
      res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

      db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
          if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
          else {

            sql_str2 = "SELECT enquiryNum,enquiryTitle, writer,commentWriter,commentWriterNum, writerMent, DATE_FORMAT(date, '%Y-%m-%d') as date, prodNum, enquiryType from t3_enquiry where commentWriterNum='"+req.session.memberNum+"'and enquiryType ='2' order by enquiryNum;"; // 상품조회SQL
            db.query(sql_str2,(error,results2,fields) => {
              if(error){
                console.log(error);
                res.status(562).end("AdminPrintProd: DB query is failed");
              }else{
                console.log(results2);
                res.end(ejs.render(htmlstream,
                  { 'title' : '쇼핑몰site',
                    'logurl': '/users/logout',
                    'loglabel': '로그아웃',
                    'regurl': '/users/profile',
                    'reglabel': req.session.who,
                      length : results2.length-1,
                      page : page,
                      previous : Number(page)-1,
                      next : Number(page)+1,
                      page_num : 10,
                      list : results2 }));

              }
            });

            }
            });

            } // else
}; // db.query()

//---------------------------------문의 상세정보-------------------------

const PrintEnquiryDetail = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, sql_str2;
  const  query = url.parse(req.url, true).query;


           if (req.session.auth && req.session.shop) {  // 만약, 판매자가 로그인했다면
             htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 판매자사용자메뉴
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop/enquiryDetailRe.ejs','utf8'); // 카테고리별 제품리스트
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
             sql_str = "SELECT enquiryNum, writer, enquiryTitle,writerMent, DATE_FORMAT(date, '%Y-%m-%d') as date, commentWriterNum, enquiryType, commentWriter,prodNum from t3_enquiry order by enquiryNum;"; // 상품조회SQL
             sql_str2 = "SELECT commentNum, commentMent, DATE_FORMAT(commentDATE, '%Y-%m-%d') as commentDATE, commentWriter from t3_comment where enquiryNum = '"+req.query.id+"' order by enquiryNum;";
             res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

             db.query(sql_str+sql_str2, (error, results, fields) => {  // 상품조회 SQL실행
                 if (error) {
                   console.log(error);
                   res.status(562).end("AdminPrintProd: DB query is failed"); }
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
                                                         'onclick2':'',
                                                         id : req.query.id,
                                                         Detail : results[0],
                                                          comment: results[1]}));  // 조회된 상품정보
                                                         // console.log(results[1]);
                   } // else;
             }); // db.query()
           }
           else if (req.session.auth) {  // 로그인했다면
             htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop/enquiryDetail.ejs','utf8'); // 카테고리별 제품리스트
             htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
             sql_str = "SELECT enquiryNum, writer, enquiryTitle,writerMent, DATE_FORMAT(date, '%Y-%m-%d') as date, commentWriterNum, enquiryType, commentWriter,prodNum from t3_enquiry order by enquiryNum;"; // 상품조회SQL
             sql_str2 = "select commentNum, commentMent, DATE_FORMAT(commentDATE, '%Y-%m-%d') as commentDATE, commentWriter from t3_comment where enquiryNum = '"+req.query.id+"' order by enquiryNum;";
             res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

             db.query(sql_str+sql_str2, (error, results, fields) => {  // 상품조회 SQL실행
                 if (error) {
                   console.log(error);
                   res.status(562).end("AdminPrintProd: DB query is failed"); }
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
                                                         'onclick2':'',
                                                         id : req.query.id,
                                                         Detail : results[0],
                                                          comment: results[1]}));  // 조회된 상품정보
                                                         // console.log(results[1]);
                   } // else;
             }); // db.query()
           }

           else {  //로그아웃한 상태라면
             popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
            }


};

// ‘/’ get 메소드의 핸들러를 정의
router.get('/enquiry/detail', PrintEnquiryDetail);

//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ1대1문의 댓글기능ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
 const AddComment = (req , res) => {
      let body = req.body;
      let htmlstream='';
      let today = moment().format("YYYY-MM-DD");
      const  query = url.parse(req.url, true).query;
      var id2 = req.query.id;
      let sql1,sql2,sql3;

          if (req.session.auth && req.session.shop ) {
            sql1 ="update t3_enquiry set commentWriterNum=?, commentWriter=? where enquiryNum=?;";
            sql2 ="insert into t3_comment (commentMent,commentDATE,enquiryNum,commentWriterNum,commentWriter,commentEnquirytype) values (?,?,?,?,?,?);";
             db.query(sql1+sql2,[req.session.memberNum ,req.session.who, id2,
               body.content, today, id2, req.session.memberNum,req.session.who,2], (error, results, fields) => {
                if (error) {
                  htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                  res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                                     'warn_title':'답변등록 오류',
                                     'warn_message':'답변등록 오류가 발생.',
                                     'return_url':'/' }));
                } else {
                 console.log("답변등록성공! DB저장 완료!");
                 res.redirect('/shop/enquiry/detail?id='+id2);
                }
             });

          } else {
            popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
            res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
            }
      };
 router.post('/enquiry/detail',AddComment);       //공지사항 등록기능


 //-------------------------------댓글 삭제기능------------------------
 const DeleteComment = (req, res) => {
   let body = req.body;
   let sql_str,sql_str2;
   const  query = url.parse(req.url, true).query;
   var id3 = req.query.id;
   params = [body.num];
   console.log(body);
// ,'미답변',0,id3
   if (req.session.auth && req.session.shop)   {   // 관리자로 로그인된 경우에만 처리한다
            sql_str = "delete from t3_comment where commentNum=?"; // 상품조회SQL
            // sql_str2 = "update t3_enquiry set commentWriter=?, commentWriterNum=? where enquiryNum=? "
            db.query(sql_str, params, (error, results, fields) => {  // 상품조회 SQL실행
                if (error) {
                  console.log(error);
                  res.status(562).end("AdminPrintProd: DB query is failed");
                } else {
                 console.log("삭제 성공! DB삭제 완료!");
                 res.redirect('/shop/enquiry/detail?id='+id3);
               } // else
            }); // db.query()
          }
          else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
            popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
            res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
          }
 };
 router.put('/enquiry/detail',DeleteComment);

//------------------------------문의 선택 삭제기능------------------------
const EnquiryDelete = (req, res) => {
  let body = req.body;
  let    sql_str;
  var    page = req.params.page;
  console.log(body);

  if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "delete from t3_enquiry where enquiryNum=?"; // 상품조회SQL
           db.query(sql_str, [body.info], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/shop/enquiry/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};

router.post('/enquiry/list/:page',EnquiryDelete);          //공지사항 리스트에서 삭제기능


const PrintShopInfo = (req, res) => {
  let body=req.body;
  let shopNum=body.shopNum;
  let htmlstream='';
  var sql_shop = 'select * from t3_shop where shopNum='+shopNum+';';
  db.query(sql_shop, (error, results, fields) => {
    if(error){
      console.log(error);
    }
    else if(results.length<=0){
      console.log("상점 정보가 없음");
    }
    else{//상점 정보 조회 성공

      console.log(results);
      res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
      if(req.session.auth){//로그인
          if(req.session.shop){//상점 로그인
            htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 일반사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop_info.ejs','utf8'); // 상점 정보 페이지
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
            res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                              'logurl': '/users/logout',
                                              'loglabel': '로그아웃',
                                              'regurl': '/users/profile',
                                              'reglabel':req.session.who,
                                               shopData: results }));
          }
          else{//일반 사용자 로그인
            htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop_info.ejs','utf8'); // 상점 정보 페이지
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
            res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                              'logurl': '/users/logout',
                                              'loglabel': '로그아웃',
                                              'regurl': '/users/profile',
                                              'reglabel':req.session.who,
                                               shopData: results }));
          }
      }
      else{//로그인 안된 경우
            htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop_info.ejs','utf8'); // 상점 정보 페이지
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
            res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                              'logurl': '/users/auth',
                                              'loglabel': '로그인',
                                              'regurl': '/users/reg',
                                              'reglabel': '회원가입',
                                               shopData: results }));

      }//로그인 안된 경우
    }//상점 정보 조회 성공
  });//쿼리
};

const PrintShopList = (req, res) => {
  let body=req.body;
  let htmlstream='';
  console.log(body);
  var sql_shop='select * from t3_shop where shopStatus=1';
  db.query(sql_shop, (error, results, fields) => {
    if(error){
      console.log(error);
    }
    else if(results.length<=0){
      console.log("조회된 상점 없음");
    }
    else{
      console.log(results);
      res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
      if(req.session.shop){
        htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 일반사용자메뉴
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop_list.ejs','utf8'); // 상점 정보 페이지
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
        res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                          'logurl': '/users/logout',
                                          'loglabel': '로그아웃',
                                          'regurl': '/users/profile',
                                          'reglabel':req.session.who,
                                           shopList: results }));
      }
      else if(req.session.auth){
        htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 일반사용자메뉴
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop_list.ejs','utf8'); // 상점 정보 페이지
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
        res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                          'logurl': '/users/logout',
                                          'loglabel': '로그아웃',
                                          'regurl': '/users/profile',
                                          'reglabel':req.session.who,
                                           shopList: results }));
      }
      else {
        htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shop_list.ejs','utf8'); // 상점 정보 페이지
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
        res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                          'logurl': '/users/auth',
                                          'loglabel': '로그인',
                                          'regurl': '/users/reg',
                                          'reglabel': '회원가입',
                                           shopList: results }));
      }
    }
  });
};










// ‘/’ get 메소드의 핸들러를 정의
router.get('/enquiry/list/:page', PrintEnquiryManage);//문의관리 페이지 출력

// ‘/’ get 메소드의 핸들러를 정의
router.get('/review/list/:page', PrintReviewManage);//리뷰관리 페이지 출력


router.get('/stock', PrintStockAdd);//재고 추가 폼 출력
router.post('/stock', HandleAddStock);//재고 추가 처리
router.put('/stock', HandleUpdateStock);//재고 수정 처리
router.delete('/stock', HandleDeleteStock);//재고 삭제 처리

router.get('/stockup/:stockIdx',PrintStockUpdate);//재고 수정 폼 출력
router.get('/stock/:page', PrintStockList);//재고 목록 출력

router.get('/product', PrintRegistProduct);//상품 등록 폼 출력
router.post('/product', upload.array('photo', 2), HandleRegistProduct);//상품 등록
router.post('/produpdate', upload.array('photo', 2), HandleProdUpdate);//상품 수정
/////////////등록과 같은 /shop/product로 작성하고 form에는 input type=hidden name=_method value=put으로,
////////////shop.js에서는 router.put으로 작성하였었으나
////////////계속 상품이 새로 등록되는 오류가 발생하여 uri를 달리 하였음

router.get('/product/:prodNum', PrintDeleteProduct);
router.delete('/product', HandleDeleteProduct);//상품 삭제

router.get('/produpdate/:prodNum', PrintUpdateForm);//상품 수정 폼 출력
router.get('/product_list/:page', PrintProductList);//상품 목록 출력

router.post('/update', upload.single("shopImg"), HandleShopUpdate);//상점 정보 수정
router.get('/update', ShopUpdateForm);//상점 정보 수정 폼 출력

router.post('/info', PrintShopInfo);

router.get('/list', PrintShopList);

router.get('/', ShopMyPage);

module.exports = router;
