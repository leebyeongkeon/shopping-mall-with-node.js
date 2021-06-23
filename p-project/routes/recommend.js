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

//------------------------------------------------------------------------------

const PrintPopForm = (req, res) => {

    let    htmlstream = '';
    //let    sql_str="";
    let    sql_str2="";
    let    banner1;
    let    banner2;
    let    banner3;


    htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
        if (req.session.auth && req.session.admin) {  // 만약, 관리자가 로그인했다면
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admincontent.ejs','utf8');
        }
        else if (req.session.auth && req.session.shop) {  // 만약, 판매자가 로그인했다면
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 판매자사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/content_pop.ejs','utf8'); // Content
        }
        else if (req.session.auth) {  // 로그인했다면
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 판매자사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/content_pop.ejs','utf8'); // Content
        }
        else {  //로그아웃한 상태라면
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');  // 일반사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/content_pop.ejs','utf8'); // Content
        }
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

        var sql_main = "select t3_product.*, count(*) from (t3_product, t3_order) where (t3_product.productNum=t3_order.orderProduct) group by orderProduct order by count(*) desc limit 8;"

        db.query(sql_main, (error, results, fields) => {  // 상품조회 SQL실행
            if (error) {
                console.log(error);
                console.log("상품 검색 에러");
                res.status(562).end("PrintPopForm: DB query is failed");
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
                        res.status(562).end("AdminPrintProd: DB query is failed");
                    }
                    else if (results2.length <= 0) {
                        htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                    }////////////조회정보 없을 경우
                    else {
                        console.log("이미지 검색 실행");
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
                                                              'banner1':banner1, 'banner2':banner2, 'banner3':banner3, }));
                        }
                        else{
                            res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                                              'logurl': '/users/auth',
                                                              'loglabel': '로그인',
                                                              'regurl': '/users/reg',
                                                              'reglabel':'회원가입',
                                                               prodata: results,
                                                              'banner1':banner1, 'banner2':banner2, 'banner3':banner3, }));
                        }
                        //<%=mainImage[0].logo%>
                    }
               });
           }
      });
};

const PrintAiForm = (req, res) => {
    let    htmlstream = '';
    //let    sql_str="";
    let    sql_str2="";
    let    banner1;
    let    banner2;
    let    banner3;
    var    getMemberId=req.session.loginId;

    htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
        if (req.session.auth && req.session.admin) {  // 만약, 관리자가 로그인했다면
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admincontent.ejs','utf8');
        }
        else if (req.session.auth && req.session.shop) {  // 만약, 판매자가 로그인했다면
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');  // 판매자사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/content_ai.ejs','utf8'); // Content
        }
        else if (req.session.auth) {  // 로그인했다면
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 판매자사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/content_ai.ejs','utf8'); // Content
        }
        else {  //로그아웃한 상태라면
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');  // 일반사용자메뉴
            htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/content_ai.ejs','utf8'); // Content
        }
        htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer

        var sql_ai = "select t3_product.*, count(*) from (t3_product, t3_order, t3_member) where (t3_member.gender=(select gender from t3_member where t3_member.id='"+getMemberId+"') and t3_member.id=t3_order.buyerid and t3_product.productNum = t3_order.orderProduct) group by orderProduct order by count(*) desc limit 8;"



        db.query(sql_ai, (error, results, fields) => {  // 상품조회 SQL실행
            if (error) {
                console.log(error);
                console.log("상품 검색 에러");
                res.status(562).end("PrintPopForm: DB query is failed");
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
                        res.status(562).end("AdminPrintProd: DB query is failed");
                    }
                    else if (results2.length <= 0) {
                        htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                    }////////////조회정보 없을 경우
                    else {
                        console.log("이미지 검색 실행");
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
                                                              'banner1':banner1, 'banner2':banner2, 'banner3':banner3, }));
                        }
                        else{
                            res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                                              'logurl': '/users/auth',
                                                              'loglabel': '로그인',
                                                              'regurl': '/users/reg',
                                                              'reglabel':'회원가입',
                                                               prodata: results,
                                                              'banner1':banner1, 'banner2':banner2, 'banner3':banner3, }));
                        }
                        //<%=mainImage[0].logo%>
                    }
               });
           }
      });
};


router.get('/popular', PrintPopForm);
router.get('/ai', PrintAiForm);

module.exports = router;
