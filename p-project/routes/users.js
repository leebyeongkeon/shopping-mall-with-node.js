const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   router = express.Router();
const   url = require('url');

router.use(bodyParser.urlencoded({ extended: false }));

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: '2019pprj',            // DB접속 아이디
    password: 'pprj2019',  // DB암호
    database: 'db2019'         //사용할 DB명
});

//-------------------아이디 중복 검사 기능 ----------------------
const PrintIdCheck = (req, res) => {
  let    htmlstream = '';




      // htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/checkID.ejs','utf8');



       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});





          res.end(ejs.render(htmlstream, { 'title' : 'SlowMade',
                                          'logurl': '/users/auth',
                                          'loglabel': '로그인',
                                          'regurl': '/users/checkid',
                                          'reglabel':'아이디 체크' }));


};

//입력된 아이디의 중복을 검사합니다.
const HandleIdCheck = (req, res) =>{

    let body = req.body;
    let sql_str;
    let htmlstream = '';

if(body.id==""){

  console.log("아이디가 입력되지 않음.");
  popalert = fs.readFileSync(__dirname + '/../views/alerts/idchecknoid.ejs','utf8');
  res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
}
else{
  console.log("아이디 검색 실행");
  console.log(body.id);
  sql_str = "SELECT id from t3_member where id ='"+ body.id +"';";
  console.log("SQL: " + sql_str);
  db.query(sql_str, (error, results, fields) => {
    if (error) { res.status(562).end("Login Fail as No id in DB!"); console.log("아이디 검색 에러");}
    else {
       if (results.length <= 0 ) {  // select 조회결과가 없는 경우 (즉, 존재하지 않는 아이디인 경우)
            console.log("아이디 조회결과 없음");
                                htmlstream = fs.readFileSync(__dirname + '/../views/alerts/idcheckok.ejs','utf8');
                                res.status(562).end(ejs.render(htmlstream,{'return_url':'/'}));



        } else  {  // select 조회결과가 있는 경우 (즉, 이미 존재하는 아이디인 경우)

          console.log("아이디 조회결과 있음");
          popalert = fs.readFileSync(__dirname + '/../views/alerts/idchecknotok.ejs','utf8');
          res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         } // else


       }  // else
  });

}


}



//  -----------------------------------  회원가입기능 -----------------------------------------
// 회원가입 입력양식을 브라우져로 출력합니다.
const PrintRegistrationForm = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/reg_form.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');

       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

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

};

// 회원가입 양식에서 입력된 회원정보를 신규등록(DB에 저장)합니다.
const HandleRegistration = (req, res) => {  // 회원가입
let body = req.body;
let htmlstream='';

     console.log(body.id);     // 임시로 확인하기 위해 콘솔에 출력해봅니다.
     console.log(body.pw1);     console.log(body.name);    console.log(body.birth);
     console.log(body.gender);     console.log(body.smsRec);     console.log(body.emailRec);
     console.log(body.email1);   console.log(body.email2);
     body.email = body.email1+body.email2;
     body.tel = body.tel1+body.tel2+body.tel3;


if(body.id==""||body.pw1==""|| body.pw1 == ''||body.birth== '' || body.gender== '' || body.smsRec== ''
|| body.emailRec== '' ||body.tel1== '' ||body.tel2== '' ||body.tel3== '' || body.email1== '' ||body.email2== ''){
  console.log("데이터입력이 되지 않아 DB에 저장할 수 없습니다.");
  popalert = fs.readFileSync(__dirname + '/../views/alerts/joinerr.ejs','utf8');
  res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

}


    else {

        db.query('INSERT INTO t3_member (name, id, pw, birth, gender, smsRec, emailRec, tel ,email) VALUES (?, ?, ?, ?, ?, ?,?,?,?)',
         [body.name, body.id, body.pw1, body.birth, body.gender, body.smsRec, body.emailRec,body.tel1+body.tel2+body.tel3, body.email1+"@"+body.email2], (error, results, fields) => {
           if (error) {
             console.log("가입 실패.");
             popalert = fs.readFileSync(__dirname + '/../views/alerts/joinerrmsg.ejs','utf8');
             res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
           }
           else {
             console.log("회원가입에 성공하였으며, DB에 신규회원으로 등록하였습니다!");

             res.redirect('/');
            }
     });

}



};

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/reg', PrintRegistrationForm);   // 회원가입화면을 출력처리
router.post('/reg', HandleRegistration);   // 회원가입내용을 DB에 등록처리
router.get('/checkid', PrintIdCheck);   // 아이디 중복 검사 화면을 출력처리
router.post('/checkid', HandleIdCheck);  //아이디 중복 검사 처리

router.get('/', function(req, res) { res.send('respond with a resource 111'); });

// ------------------------------------  로그인기능 --------------------------------------

// 로그인 화면을 웹브라우져로 출력합니다.
const PrintLoginForm = (req, res) => {
  let    htmlstream = '';

       htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/login_form.ejs','utf8');
       htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
           res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                               'reglabel': req.session.who }));
       }
       else {
          res.end(ejs.render(htmlstream, { 'title' : 'SlowMade',
                                          'logurl': '/users/auth',
                                          'loglabel': '로그인',
                                          'regurl': '/users/reg',
                                          'reglabel':'회원가입' }));
       }

};

// 로그인을 수행합니다. (사용자인증처리)
const HandleLogin = (req, res) => {
  let body = req.body;
  let userid, userpass, username, userper ;
  let sql_str;
  let htmlstream = '';

      console.log(body.loginid);
      console.log(body.loginpw);
      if (body.loginid == '' || body.loginpw == '') {
        console.log("아이디나 비밀번호가 입력되지 않아서 로그인할 수 없습니다.");

                           popalert = fs.readFileSync(__dirname + '/../views/alerts/loginnull.ejs','utf8');
                           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

      }
      else {
       sql_str = "SELECT id, pw, name, per, memberNum from t3_member where id ='"+ body.loginid +"' and pw='" + body.loginpw + "';";
       console.log("SQL: " + sql_str);
       db.query(sql_str, (error, results, fields) => {
         if (error) { res.status(562).end("Login Fail as No id in DB!"); }
         else {
            if (results.length <= 0) {  // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)

                                     popalert = fs.readFileSync(__dirname + '/../views/alerts/loginerr.ejs','utf8');
                                     res.status(562).end(ejs.render(popalert,{'return_url':'/'}));


             } else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)
               results.forEach((item, index) => {
                  userid = item.id;  userpass = item.pw; username = item.name; userper = item.per; userNum=item.memberNum;
                  console.log("DB에서 로그인성공한 ID/암호:%s/%s", userid, userpass);
                  if (body.loginid == userid && body.loginpw == userpass) {
                     req.session.auth = 99;      // 임의로 수(99)로 로그인성공했다는 것을 설정함
                     req.session.who = username; // 인증된 사용자명 확보 (로그인후 이름출력용)
                     req.session.loginId = userid;  //인증된 아이디 확보
                     req.session.memberNum = userNum;
                     req.session.pw=userpass;
                     if (userper == 9)    // 만약, 인증된 사용자의 권한이 9라면 이를 표시
                          req.session.admin = true;  //관리자 권한
                      else if (userper == 1)   // 만약, 인증된 사용자의 권한이 1라면 이를 표시
                           req.session.shop = true;  //판매자 권한
                         res.redirect('/');
                  }
                }); /* foreach */
              } // else
            }  // else
       });
   }
};


// REST API의 URI와 핸들러를 매핑합니다.
//  URI: http://xxxx/users/auth
router.get('/auth', PrintLoginForm);   // 로그인 입력화면을 출력
router.post('/auth', HandleLogin);     // 로그인 정보로 인증처리

// ------------------------------  로그아웃기능 --------------------------------------

const HandleLogout = (req, res) => {
     let    popalert = '';


       req.session.destroy();     // 세션을 제거하여 인증오작동 문제를 해결
      res.redirect('/');
}

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/logout', HandleLogout);       // 로그아웃 기능

//-----------------------------아이디/비밀번호 찾기 기능 --------------------------------
const PrintFindIdPw = (req, res) => {
      let    htmlstream = '';

      htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbarNoLogin.ejs','utf8');
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/findIdPw.ejs','utf8');
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');

      res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

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


}

//  아이디 찾기 기능
const HandleFindId = (req, res) =>{
  let body = req.body;
  let findedid;

  let sql_str;
  let htmlstream = '';

body.findemail=body.findemail1+"@"+body.findemail2;

      console.log(body.findname);
      console.log(body.findemail);

      if (body.findname == '') {
        console.log("이름이 입력되지 않았습니다.");

                           popalert = fs.readFileSync(__dirname + '/../views/alerts/FindIdErr.ejs','utf8');
                           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

      }
      else if ( body.findemail2 == '' || body.findemail1 == '') {
        console.log("이메일이 입력되지 않았습니다.");

                           popalert = fs.readFileSync(__dirname + '/../views/alerts/FindIdErr.ejs','utf8');
                           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

      }
      else {
       sql_str = "SELECT id, name from t3_member where name ='"+ body.findname +"' and email='" + body.findemail + "';";
       console.log("SQL: " + sql_str);
       db.query(sql_str, (error, results, fields) => {
         if (error) { res.status(562).end("find Fail "); }
         else {
            if (results.length <= 0) {  // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)

                                     popalert = fs.readFileSync(__dirname + '/../views/alerts/NoMember.ejs','utf8');
                                     res.status(562).end(ejs.render(popalert,{'return_url':'/'}));


             } else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)
               results.forEach((item, index) => {
                  findedid = item.id;
                  username= item.name;
                  console.log("DB에서 검색 성공한 ID:%s", findedid);



                  htmlstream = fs.readFileSync(__dirname + '/../views//alerts/FindedId.ejs','utf8');
                  res.status(562).end(ejs.render(htmlstream, {
                                     'findedid':findedid,
                                     'username':username


                                      }));

                }); /* foreach */
              } // else
            }  // else
       });
   }


}

const HandleFindPw = (req, res) =>{
  let body = req.body;
  let findedpw;

  let sql_str;
  let htmlstream = '';

body.findemail=body.findemail1+"@"+body.findemail2;

      console.log(body.findname);
      console.log(body.findemail);
      console.log(body.findid);


      if (body.findname == '') {
        console.log("이름이 입력되지 않았습니다.");

                           popalert = fs.readFileSync(__dirname + '/../views/alerts/FindIdErr.ejs','utf8');
                           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

      }
      else if ( body.findemail2 == '' || body.findemail1 == '') {
        console.log("이메일이 입력되지 않았습니다.");

                           popalert = fs.readFileSync(__dirname + '/../views/alerts/FindIdErr.ejs','utf8');
                           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

      }
      else if ( body.findid == '' ) {
        console.log("이메일이 입력되지 않았습니다.");

                           popalert = fs.readFileSync(__dirname + '/../views/alerts/FindIdErr.ejs','utf8');
                           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

      }

      else {
       sql_str = "SELECT pw, name from t3_member where name ='"+ body.findname +"' and email='" + body.findemail + "' and id='"+ body.findid +"';";
       console.log("SQL: " + sql_str);
       db.query(sql_str, (error, results, fields) => {
         if (error) { res.status(562).end("find Fail "); }
         else {
            if (results.length <= 0) {  // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)

                                     popalert = fs.readFileSync(__dirname + '/../views/alerts/NoMember.ejs','utf8');
                                     res.status(562).end(ejs.render(popalert,{'return_url':'/'}));


             } else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)
               results.forEach((item, index) => {
                  findedpw = item.pw;
                  username= item.name;
                  console.log("DB에서 검색 성공한 pw:%s", findedpw);



                  htmlstream = fs.readFileSync(__dirname + '/../views//alerts/FindedPw.ejs','utf8');
                  res.status(562).end(ejs.render(htmlstream, {
                                     'findedpw':findedpw,
                                     'username':username

                                      }));

                }); /* foreach */
              } // else
            }  // else
       });
   }


};

router.get('/find', PrintFindIdPw);   // 아이디비번 찾기 화면을 출력처리
router.post('/findId', HandleFindId);  //아이디 찾기 처리
router.post('/findPw', HandleFindPw);  //비밀번호 찾기 처리

// --------------- 마이페이지 기능 --------------------

const PrintProfile = (req, res) => {
  let    htmlstream = '';
  let sql_str;
  let userid;
  let username;
  let useremail;
  let usertel;
  let usersmsRec;
  let useremailRec;
  let userbirth;


  const  query = url.parse(req.url, true).query;

 if (req.session.auth && req.session.shop)   {
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/shopnavbar.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/mypage.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
         sql_str = "SELECT name,id,tel,email,DATE_FORMAT(birth, '%Y-%m-%d') as birth,smsRec,emailRec from t3_member where id ='"+  req.session.loginId +"' ;";
        console.log("SQL: " + sql_str);

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str, (error, results, fields) => {
           if (error) { res.status(562).end("find Fail "); }
           else if (results.length <= 0){
               // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)

                   popalert = fs.readFileSync(__dirname + '/../views/alerts/NoMember.ejs','utf8');
                   res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
                                     }

           else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)

             results.forEach((item, index) => {
                userid = item.id;
                username= item.name;
                useremail=item.email;
                usertel=item.tel;
                userbirth=item.birth;
                if(item.smsRec==1) usersmsRec="수신함";
                else if(item.smsRec==0) usersmsRec="수신안함";

                if(item.emailRec==0) useremailRec="수신안함";
                else if(item.emailRec==1) useremailRec="수신함";

                console.log("DB에서 검색 성공한 NAME:%s",username);
                  console.log("DB에서 검색 성공한 NAME:%s",useremailRec);
                    console.log("DB에서 검색 성공한 NAME:%s",usersmsRec);

                      console.log("DB에서 검색 성공한 NAME:%s",usertel);
                        console.log("DB에서 검색 성공한 NAME:%s",useremail);
                        console.log("DB에서 검색 성공한 NAME:%s",userbirth);







              }); /* foreach */
                 res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                                   'logurl': '/users/logout',
                                                   'loglabel': '로그아웃',
                                                   'regurl': '/users/profile',
                                                   'reglabel':req.session.who,
                                                    'name' : username, 'id':userid, 'email':useremail, 'tel':usertel,
                                                    'smsRec':usersmsRec, 'emailRec':useremailRec, 'birth':userbirth }));
                } // else

         }); //db.query





       }
       else if(req.session.auth){
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/mypage.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
         sql_str = "SELECT name,id,tel,email,DATE_FORMAT(birth, '%Y-%m-%d') as birth,smsRec,emailRec from t3_member where id ='"+  req.session.loginId +"' ;";
        console.log("SQL: " + sql_str);

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str, (error, results, fields) => {
           if (error) { res.status(562).end("find Fail "); }
           else if (results.length <= 0){
               // select 조회결과가 없는 경우 (즉, 등록계정이 없는 경우)

                   popalert = fs.readFileSync(__dirname + '/../views/alerts/NoMember.ejs','utf8');
                   res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
                                     }

           else {  // select 조회결과가 있는 경우 (즉, 등록사용자인 경우)

             results.forEach((item, index) => {
                userid = item.id;
                username= item.name;
                useremail=item.email;
                usertel=item.tel;
                userbirth=item.birth;
                if(item.smsRec==1) usersmsRec="수신함";
                else if(item.smsRec==0) usersmsRec="수신안함";

                if(item.emailRec==0) useremailRec="수신안함";
                else if(item.emailRec==1) useremailRec="수신함";

                console.log("DB에서 검색 성공한 NAME:%s",username);
                  console.log("DB에서 검색 성공한 NAME:%s",useremailRec);
                    console.log("DB에서 검색 성공한 NAME:%s",usersmsRec);

                      console.log("DB에서 검색 성공한 NAME:%s",usertel);
                        console.log("DB에서 검색 성공한 NAME:%s",useremail);
                        console.log("DB에서 검색 성공한 NAME:%s",userbirth);







              }); /* foreach */
                 res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                                   'logurl': '/users/logout',
                                                   'loglabel': '로그아웃',
                                                   'regurl': '/users/profile',
                                                   'reglabel':req.session.who,
                                                    'name' : username, 'id':userid, 'email':useremail, 'tel':usertel,
                                                    'smsRec':usersmsRec, 'emailRec':useremailRec, 'birth':userbirth }));
                } // else

         }); //db.query

       }
       else{

         popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
         res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }

};





router.get('/profile', PrintProfile);     // 정보변경화면을 출력

//router.post('/profile', HandleProfile);


//----------------회원 탈퇴 기능-------------------------

const PrintDeleteInfo = (req, res) => {
  let    htmlstream = '';
    let    htmlstream2 = '';






       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/deleteCheck.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');

           res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                              'reglabel': req.session.who}));


       }
       else {


                                          popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
                                          res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }
};

const HandleDeleteInfo = (req, res) => {
  let body = req.body;
  let sql_str;
  let htmlstream2 = '';
  if(req.session.auth&&req.session.shop){  //판매자가 탈퇴하기를 클릭하면
    popalert = fs.readFileSync(__dirname + '/../views/alerts/cantdelete.ejs','utf8');
    res.status(562).end(ejs.render(popalert,{'return_url':'/'}));  //판매자는 관리자에게 문의하라는 경고 날리기

  }
  else {  //그 외 사용자가 탈퇴하기를 클릭하면
    console.log("회원의 주문 존재 여부 검색 실행");
    sql_str = "select id from t3_member where memberNum=(select buyerNum from t3_order where buyerId='"+ req.session.loginId +"');";
    console.log("SQL: " + sql_str);
    db.query(sql_str, (error, results, fields) => {
      if (error) { res.status(562).end("Login Fail as No id in DB!"); console.log("검색 에러");}
      else {
         if (results.length <= 0 ) {  // select 조회결과가 없는 경우 (즉, 주문내역이 없으면)
              console.log("주문 내역이 존재하지 않음");

              if(body.pw==""){

                console.log("비밀번호가 입력되지 않음.");
                popalert = fs.readFileSync(__dirname + '/../views/alerts/idchecknoid.ejs','utf8');
                res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
              }
              else{
                console.log("비밀번호 검색 실행");
                console.log(body.pw);
                sql_str = "SELECT id, pw from t3_member where id ='"+ req.session.loginId +"' and pw='" + body.pw + "';";
                console.log("SQL: " + sql_str);
                db.query(sql_str, (error, results, fields) => {
                  if (error) { res.status(562).end("Login Fail as No id in DB!"); console.log("비밀번호 검색 에러");}
                  else {
                     if (results.length <= 0 ) {  // select 조회결과가 없는 경우 (즉, 존재하지 않는 아이디인 경우)
                          console.log("아이디 비밀번호 일치하지 않음");
                                              htmlstream = fs.readFileSync(__dirname + '/../views/alerts/pwerr.ejs','utf8');
                                              res.status(562).end(ejs.render(htmlstream,{'return_url':'/'}));



                      } else  {  // select 조회결과가 있는 경우 (즉, 이미 존재하는 아이디인 경우)

                        console.log("아이디 비밀번호 일치함. 탈퇴를 실행함");
                        sql_str = "DELETE from t3_member where id ='"+ req.session.loginId +"';";
                          console.log("SQL: " + sql_str);
                            db.query(sql_str, (error, results, fields) => {
                            if (error) { res.status(562).end("delete Fail!"); console.log("삭제 실패");}
                            else{

                                            console.log("탈퇴처리 완료");


                                            req.session.destroy();     // 세션을 제거하여 인증오작동 문제를 해결

                                            res.redirect('/');
                                 }
                           }); //db.query
                       } // else
                     }  // else
                });

              }


          } else  {  // select 조회결과가 있는 경우 (즉, 주문 내역이 존재한다면)

            console.log("주문 내역이 존재함");

                          if(body.pw==""){

                            console.log("비밀번호가 입력되지 않음.");
                            popalert = fs.readFileSync(__dirname + '/../views/alerts/idchecknoid.ejs','utf8');
                            res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
                          }
                          else{
                            console.log("비밀번호 검색 실행");
                            console.log(body.pw);
                            sql_str = "SELECT id, pw from t3_member where id ='"+ req.session.loginId +"' and pw='" + body.pw + "';";
                            console.log("SQL: " + sql_str);
                            db.query(sql_str, (error, results, fields) => {
                              if (error) { res.status(562).end("Login Fail as No id in DB!"); console.log("비밀번호 검색 에러");}
                              else {
                                 if (results.length <= 0 ) {  // select 조회결과가 없는 경우 (즉, 비밀번호가 일치하지 않음

                                      console.log("아이디 비밀번호 일치하지 않음");
                                                          htmlstream = fs.readFileSync(__dirname + '/../views/alerts/pwerr.ejs','utf8');
                                                          res.status(562).end(ejs.render(htmlstream,{'return_url':'/'}));



                                  } else  {  // select 조회결과가 있는 경우 (즉, 이미 존재하는 아이디인 경우)

                                    res.redirect('/users/deleteuser/more');

                                   } // else
                                 }  // else
                            });

                          }











           } // else
         }  // else
    });



  }




};

const PrintDeleteInfoMore = (req, res) => {
  let    htmlstream = '';


       res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/deletecheckmore.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');

           res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                             'logurl': '/users/logout',
                                             'loglabel': '로그아웃',
                                             'regurl': '/users/profile',
                                              'reglabel': req.session.who}));


       }
       else {


                                          popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
                                          res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }
};




const HandleDeleteInfoMore = (req, res) => {
  let body = req.body;
  let sql_str;
  let htmlstream2 = '';

  if(body.pw==""){

    console.log("비밀번호가 입력되지 않음.");
    popalert = fs.readFileSync(__dirname + '/../views/alerts/idchecknoid.ejs','utf8');
    res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
  }
  else{
    console.log("비밀번호 검색 실행");
    console.log(body.pw);
    sql_str = "SELECT id, pw from t3_member where id ='"+ req.session.loginId +"' and pw='" + body.pw + "';";
    console.log("SQL: " + sql_str);
    db.query(sql_str, (error, results, fields) => {
      if (error) { res.status(562).end("Login Fail as No id in DB!"); console.log("비밀번호 검색 에러");}
      else {
         if (results.length <= 0 ) {  // select 조회결과가 없는 경우 (즉, 존재하지 않는 아이디인 경우)
              console.log("아이디 비밀번호 일치하지 않음");
                                  htmlstream = fs.readFileSync(__dirname + '/../views/alerts/pwerr.ejs','utf8');
                                  res.status(562).end(ejs.render(htmlstream,{'return_url':'/'}));



          } else  {  // select 조회결과가 있는 경우 (즉, 이미 존재하는 아이디인 경우)

            console.log("아이디 비밀번호 일치함. 탈퇴를 실행함");
            sql_str = "DELETE from t3_member where id ='"+ req.session.loginId +"';";
              console.log("SQL: " + sql_str);
                db.query(sql_str, (error, results, fields) => {
                if (error) { res.status(562).end("delete Fail!"); console.log("삭제 실패");}
                else{

                                console.log("탈퇴처리 완료");


                                req.session.destroy();     // 세션을 제거하여 인증오작동 문제를 해결

                                res.redirect('/');
                     }
               }); //db.query
           } // else
         }  // else
    });

  }




};

const PrintModifyInfo = (req, res) => {
  let    htmlstream = '';
  let popalert='';
  let    sql_str;
  let    body = req.body;
  let    read;

  let userid;
  let username;
  let useremail;
  let usertel;
  let usersmsRec;
  let useremailRec;

  let userpw;







       if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/modifyMemberInfo.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');
         sql_str = "SELECT name, pw, tel, email, smsRec, emailRec, point From t3_member where id ='"+  req.session.loginId +"' ;";

         res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

         db.query(sql_str, (error, results, fields) => {  // 회원조회 SQL실행
           if (error) { res.status(562).end("PrintDetailMember: DB query is failed"); }
           else if (results.length <= 0) {  // 조회된 회원이 없다면, 오류메시지 출력
                 popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
                 res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
           }
           else {

             results.forEach((item, index) => {

                username= item.name;
                useremail=item.email;
                usertel=item.tel;
                usersmsRec=item.smsRec;
                useremailRec=item.emailRec;
                userpw=item.pw;


                console.log("DB에서 검색 성공한 NAME:%s",username);
                  console.log("DB에서 검색 성공한 NAME:%s",useremailRec);
                    console.log("DB에서 검색 성공한 NAME:%s",usersmsRec);

                      console.log("DB에서 검색 성공한 NAME:%s",usertel);
                        console.log("DB에서 검색 성공한 NAME:%s",useremail);



              });

                  res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                    'logurl': '/users/logout',
                                                    'loglabel': '로그아웃',
                                                    'regurl': '/users/profile',
                                                    'reglabel': req.session.who,
                                                     'buttonType':'submit', //submit or buttonType
                                                     'button1': '수정', //수정 or 이전
                                                     'admin':'',//주석처리 or 공백
                                                     'onclick2':'',//location.href='/adminbulletin/info/detail?id=<%= id + 1%>'
                                                     'email':useremail, 'tel':usertel, 'name':username,
                                                     'smsRec':usersmsRec, 'emailRec':useremailRec, 'pw':userpw,'name':username
                                                    }));  // 조회된 회원정보

           } // else
        }); // db.query()




       }
       else {


                                          popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
                                          res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }
};

const PrintModifyPw = (req, res) => {
  let    htmlstream = '';
  let popalert='';
  let    sql_str;
  let    body = req.body;
  let    read;


  let userpw;


         htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/modifypw.ejs','utf8');
         htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');


         if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
             res.end(ejs.render(htmlstream,  { 'title' : 'SlowMade',
                                               'logurl': '/users/logout',
                                               'loglabel': '로그아웃',
                                               'regurl': '/users/profile',
                                                 'reglabel': req.session.who,
                                                 'buttonType':'submit', //submit or buttonType
                                                 'button1': '수정', //수정 or 이전
                                                 'admin':'',//주석처리 or 공백
                                                 'onclick2':'' }));

         }
         else {
            res.end(ejs.render(htmlstream, { 'title' : 'SlowMade',
                                            'logurl': '/users/auth',
                                            'loglabel': '로그인',
                                            'regurl': '/users/reg',
                                            'reglabel':'회원가입',
                                            'buttonType':'submit', //submit or buttonType
                                            'button1': '수정', //수정 or 이전
                                            'admin':'',//주석처리 or 공백
                                            'onclick2':'', }));

     popalert = fs.readFileSync(__dirname + '/../views/alerts/loginNo.ejs','utf8');
     res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }





};



// 회원수정 식에서 입력된 회원정보를 등록(DB에 저장)합니다.
const HandleModifyInfo = (req, res) => {  // 회원수정
  let    body = req.body;
  let    htmlstream = '';
  const  query = url.parse(req.url, true).query;
  var id = req.query.memberNum;
  let sql_str;
  console.log(body);

       if (req.session.auth ) {

         if(req.session.pw!=body.pw){
           popalert = fs.readFileSync(__dirname + '/../views/alerts/pwerr.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

         }
         else {


                       sql_str ="UPDATE t3_member SET  tel=?, email=?,smsRec=?, emailRec=? where id ='"+  req.session.loginId +"' ;";
                         db.query(sql_str,[  body.tel, body.email, body.smsRec, body.emailRec], (error, results, fields) => {
                          if (error) {
                            popalert = fs.readFileSync(__dirname + '/../views/alerts/modifyerr.ejs','utf8');
                            res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
                           } else {
                              console.log("회원정보를 수정하였으며, DB에 저장되었습니다.!");
                              res.redirect('/users/profile');
                           }
                      });


         }


      }
     else {
       popalert = fs.readFileSync(__dirname + '/../views/alerts/modifyerr.ejs','utf8');
       res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }
};











const HandleModifyPw = (req, res) => {  // 비밀번호 수정
  let    body = req.body;
  let    htmlstream = '';
  const  query = url.parse(req.url, true).query;
  var id = req.query.memberNum;
  let sql_str;
  console.log(body);

       if (req.session.auth ) {

         if(req.session.pw!=body.pw){
           popalert = fs.readFileSync(__dirname + '/../views/alerts/pwerr.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));

         }
         else {


                       sql_str ="UPDATE t3_member SET  pw=? where id ='"+  req.session.loginId +"' ;";
                         db.query(sql_str,[ body.newpw], (error, results, fields) => {
                          if (error) {
                            popalert = fs.readFileSync(__dirname + '/../views/alerts/modifyerr.ejs','utf8');
                            res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
                           } else {
                              console.log("회원정보를 수정하였으며, DB에 저장되었습니다.!");
                              res.redirect('/users/profile');
                           }
                      });


         }


      }
     else {
       popalert = fs.readFileSync(__dirname + '/../views/alerts/modifyerr.ejs','utf8');
       res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
       }
};


//---------------------------------리뷰게시판 조회----------------------

const  PrintmyReview = (req, res) => {   // 메인화면을 출력합니다
  let    htmlstream = '';
  let    htmlstream2='';
  let    sql_str;
  const  query = url.parse(req.url, true).query;
  var page = req.params.page;

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
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/myreview.ejs','utf8'); // 공지사항
      htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
      sql_str = "SELECT reviewNum, writer, reviewMent, reviewImg,  DATE_FORMAT(reviewDATE, '%Y-%m-%d') as reviewDATE, productNum from t3_review where writerNum='"+req.session.memberNum+"' order by reviewNum;"; // 상품조회SQL

      res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

      db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
          if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
          else {
           if(req.session.auth){
             res.end(ejs.render(htmlstream,
               { 'title' : '쇼핑몰site',
                 'logurl': '/users/logout',
                 'loglabel': '로그아웃',
                 'regurl': '/users/profile',
                 'reglabel': req.session.who,
                   length : results.length-1,
                   page : page,
                   previous : Number(page)-1,
                   next : Number(page)+1,
                   page_num : 5,
                   review : results }));
                 console.log(results);
               }
           else {
                  res.end(ejs.render(htmlstream,
                    { 'title' : '쇼핑몰site',
                      'logurl': '/users/auth',
                      'loglabel': '로그인',
                      'regurl': '/users/reg',
                      'reglabel': '회원가입',
                        length : results.length-1,
                        page : page,
                        previous : Number(page)-1,
                        next : Number(page)+1,
                        page_num : 5,
                        review : results }));
              }

            } // else
      }); // db.query()

};
//------------------------------공지사항 선택 삭제기능------------------------
const DeleteReview = (req, res) => {
  let body = req.body;
  let    sql_str;
  var    page = req.params.page;
  console.log(body);

  if (req.session.auth)   {   // 관리자로 로그인된 경우에만 처리한다
           sql_str = "delete from t3_review where reviewNum=?"; // 상품조회SQL
           db.query(sql_str, [body.info], (error, results, fields) => {  // 상품조회 SQL실행
               if (error) {
                 res.status(562).end("AdminPrintProd: DB query is failed");
               } else {
                console.log("삭제 성공! DB삭제 완료!");
                res.redirect('/users/review/list/1');
              } // else
           }); // db.query()
         }
         else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
           popalert = fs.readFileSync(__dirname + '/../views/alerts/noadmin.ejs','utf8');
           res.status(562).end(ejs.render(popalert,{'return_url':'/'}));
         }
};

// ‘/’ get 메소드의 핸들러를 정의
router.get('/review/list/:page', PrintmyReview);
router.post('/review/list/:page',DeleteReview);          //공지사항 리스트에서 삭제기능






router.get('/deleteuser', PrintDeleteInfo);
router.post('/deleteuser', HandleDeleteInfo);
router.delete('/deleteuser', HandleDeleteInfo);
router.get('/deleteuser/more', PrintDeleteInfoMore);
router.post('/deleteuser/more', HandleDeleteInfoMore);
router.delete('/deleteuser/more', HandleDeleteInfoMore);

router.get('/modifyInfo', PrintModifyInfo);
router.put('/modifyInfo', HandleModifyInfo);
router.get('/modifyPw', PrintModifyPw);
router.put('/modifyPw', HandleModifyPw);



module.exports = router;
