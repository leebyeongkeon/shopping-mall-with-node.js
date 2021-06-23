const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');
const formidable = require('formidable');
const upload = multer({dest: __dirname + '/../public/images/uploads/products'});
const   router = express.Router();

// router.use(bodyParser.urlencoded({ extended: false }));

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019'         //사용할 DB명
});


const PrintRegistProduct = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/productregist.ejs','utf8');
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

const HandleRegistProduct = (req, res) => {
let body = req.body;
let htmlstream='';
// var picfile;
let    prodimage = '/images/uploads/products/'; // 상품이미지 저장디렉터리
let    picfile = req.file;

// let    picfile = body.file.productImg;
let    detailImage = '/images/uploads/products/';
// let    detail = req.files[1];
// var form = new formidable.IncomingForm();
// form.parse(req, function(err,fields, files){
//   console.log(files);
//   console.log(fields);
//   picfile=files[0];
// // });
let    result = { originalName  : picfile.originalname,
                 size : picfile.size     }

        console.log(picfile.originalname);
        console.log(picfile.size);
        console.log(body.filename);

    // console.log(body.productname);     // 임시로 확인하기 위해 콘솔에 출력해봅니다.
    // console.log(body.price);
    // console.log(body.minPrice);
    // console.log(body.productdesc);    //요약설명
    // // console.log(body.product_detail);
    // console.log(body.bigCate);
    // console.log(body.midCate);
    // console.log(body.smallCate);
    //
    // console.log(body.optName);
    // console.log(body.optVal1);
    // console.log(body.optVal2);
    // console.log(body.optVal3);
    // console.log(body.optVal4);
    // console.log(body.optVal5);
    // console.log(body);
    if (body.productname == '' || body.price == '') {
         console.log("데이터입력이 되지 않아 DB에 저장할 수 없습니다.");
         res.status(561).end('<meta charset="utf-8">데이터가 입력되지 않아 상품등록을 할 수 없습니다');
    }
    else {
      //옵션 값들 먼저 옵션 테이블에 저장한 후 저장한 개수만큼 마지막 index에서부터 optNum값들 select 후 optNum값들을 구분자를 넣어서 prodcut테이블에 저장한다
       db.query('INSERT INTO t3_product(productName, price, shopName, shopNum, bigCate, midCate, smallCate, minPrice, productImg, productMent, detailImg, optSetNum) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
       // [body.productName, body.price, body.shopName, body.shopNum, body.bigCate, body.midCate, body.smallCate, body.minPrice, body.productImg, body.productMent, body.detailImg, body.optSetNum],
       [body.productname, body.price, null, 1, body.bigCate, body.midCate, body.smallCate, body.minPrice, null, body.productdesc, null, null],
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

    }
};
const ProductSearch = (req,res) => {
  console.log("검색됨");
};
router.get('/productsearch', ProductSearch);
// REST API의 URI와 핸들러를 매핑합니다.
router.get('/productregist', PrintRegistProduct);   // 회원가입화면을 출력처리
router.post('/productregistering', HandleRegistProduct);   // 회원가입내용을 DB에 등록처리
router.get('/', function(req, res) { res.send('respond with a resource 111'); });
module.exports = router
