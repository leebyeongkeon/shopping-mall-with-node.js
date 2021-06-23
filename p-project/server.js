// Node.JS 내외부 모듈추출
const   cookieParser = require('cookie-parser');
const   session = require('express-session');
const   bodyParser = require('body-parser');
const   express = require('express');
const   app = express();
const   createError = require('http-errors');
const   path = require('path');
const   fileUpload = require('express-fileupload');
var methodOverride = require('method-override');

// 쇼핑몰 개발소스 모듈
const   mainui = require('./routes/mainui');
const   users = require('./routes/users');
const   adminmem = require('./routes/adminmem');
const   adminsh = require('./routes/adminsh');
const   adminprod = require('./routes/adminprod');
const   adminbull = require('./routes/adminbulletin');
const   adminod = require('./routes/adminod');
const   product = require('./routes/product');
const   comm = require('./routes/comm');
const   service = require('./routes/service');
const   search = require('./routes/search');
const   event = require('./routes/event');
const   order = require('./routes/order');
const   shop = require('./routes/shop');
const   adminmain = require('./routes/adminmain');
const   guide = require('./routes/guide');
const   recommend = require('./routes/recommend');
// 쇼핑몰전용 PORT주소 설정
const   PORT = 65005;

// 실행환경 설정부분
app.set('views', path.join(__dirname, 'views'));  // views경로 설정
app.set('view engine', 'ejs');                    // view엔진 지정
app.use(express.static(path.join(__dirname, 'public')));   // public설정
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ key: 'sid',
                  secret: 'secret key',  // 세션id 암호화할때 사용
                  resave: false,         // 접속할때마다 id부여금지
                  saveUninitialized: true })); // 세션id사용전에는 발급금지

// URI와 핸들러를 매핑
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method
    return method
  }
}));
app.use('/', mainui);       // URI (/) 접속하면 mainui로 라우팅
app.use('/users', users);   // URI('/users') 접속하면 users로 라우팅
app.use('/product', product); // URI('/product') 접속하면 product로 라우팅
app.use('/search', search);
app.use('/comm', comm);
app.use("/event",event);
app.use('/adminmem', adminmem); // URI('/adminmem') 접속하면 adminprod로 라우팅
app.use('/adminod', adminod); // URI('/adminod') 접속하면 adminod로 라우팅
app.use('/order', order);
app.use('/shop', shop);
app.use('/adminmain', adminmain);
app.use('/adminprod', adminprod); // URI('/adminprod') 접속하면 adminprod로 라우팅
app.use('/guide', guide);
app.use('/recommend', recommend);
//
app.use(fileUpload());
app.use('/adminbulletin', adminbull);
app.use("/service",service);
app.use('/adminsh', adminsh); // URI('/adminsh') 접속하면 adminsh로 라우팅


//app.use('/users/checkID', checkID);
// app.use('/log', login);
// app.use('/log', login);
// app.use('/log', login);


// 서버를 실행합니다.
app.listen(PORT, function () {
       console.log('서버실행: http://203.249.127.60:' + PORT);
       console.log('서버실행: http://192.9.80.96:' + PORT);
});
