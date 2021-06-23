-- MySQL dump 10.14  Distrib 5.5.60-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: db2019
-- ------------------------------------------------------
-- Server version	5.5.60-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t3_comment`
--

DROP TABLE IF EXISTS `t3_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_comment` (
  `commentNum` int(11) NOT NULL AUTO_INCREMENT,
  `commentMent` varchar(45) DEFAULT NULL,
  `commentDATE` date DEFAULT NULL,
  `enquiryNum` int(11) NOT NULL,
  `commentWriterNum` int(11) NOT NULL,
  `commentEnquirytype` int(11) DEFAULT NULL,
  `commentWriter` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`commentNum`),
  KEY `commentWriterNum` (`commentWriterNum`),
  KEY `enquiryNum` (`enquiryNum`),
  CONSTRAINT `commentWriterNum` FOREIGN KEY (`commentWriterNum`) REFERENCES `t3_member` (`memberNum`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `enquiryNum` FOREIGN KEY (`enquiryNum`) REFERENCES `t3_enquiry` (`enquiryNum`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t3_comment_ibfk_1` FOREIGN KEY (`enquiryNum`) REFERENCES `t3_enquiry` (`enquiryNum`),
  CONSTRAINT `t3_comment_ibfk_2` FOREIGN KEY (`commentWriterNum`) REFERENCES `t3_member` (`memberNum`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_comment`
--

LOCK TABLES `t3_comment` WRITE;
/*!40000 ALTER TABLE `t3_comment` DISABLE KEYS */;
INSERT INTO `t3_comment` VALUES (5,'왜했냐','2019-12-16',14,49,1,'감스트'),(6,'그래','2019-12-18',25,49,2,'감스트'),(25,'그렇나??','2019-12-18',25,24,2,'가천샵'),(27,'무슨 무늬냐 이건','2019-12-18',30,69,2,'B샵'),(28,'제대로 문의해라','2019-12-18',30,69,2,'B샵'),(29,'123','2019-12-18',29,69,2,'B샵');
/*!40000 ALTER TABLE `t3_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_enquiry`
--

DROP TABLE IF EXISTS `t3_enquiry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_enquiry` (
  `enquiryNum` int(11) NOT NULL AUTO_INCREMENT,
  `writer` varchar(45) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `enquiryTitle` varchar(45) DEFAULT NULL,
  `writerMent` varchar(45) DEFAULT NULL,
  `commentWriterNum` int(11) DEFAULT NULL,
  `enquiryType` varchar(45) DEFAULT NULL,
  `commentWriter` varchar(45) DEFAULT NULL,
  `prodNum` int(11) DEFAULT NULL,
  PRIMARY KEY (`enquiryNum`),
  KEY `commentWriterNum` (`commentWriterNum`),
  CONSTRAINT `t3_enquiry_ibfk_1` FOREIGN KEY (`commentWriterNum`) REFERENCES `t3_member` (`memberNum`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_enquiry`
--

LOCK TABLES `t3_enquiry` WRITE;
/*!40000 ALTER TABLE `t3_enquiry` DISABLE KEYS */;
INSERT INTO `t3_enquiry` VALUES (2,'kkj','2019-10-23','title','ment',1,'1','관리자',NULL),(9,NULL,'2019-12-13','물건 더 기다리면 할인 얼마 해줘요?','솔직히 오래 기다렸는데 할인 많이 해줘야 되는거 아니에요?',NULL,'2',NULL,NULL),(10,'최길동','2019-12-13','거 이거 너무한거 아니요!','아닙니다.',NULL,'2',NULL,NULL),(14,'감스트','2019-12-13','또 문의해버리자','해따',49,'1','감스트',NULL),(18,'감스트','2019-12-13','이제야','되따',1,'1','관리자',NULL),(23,'감스트','2019-12-17','문의합니다','팔찌무야',NULL,'2',NULL,NULL),(25,'감스트','2019-12-17','문이야','문이야문이야',24,'2','가천샵',86),(26,'최길동','2019-12-17','무니하자','무니무니해도무니가채고',NULL,'1',NULL,NULL),(27,'문의맨','2019-12-18','나문희요','나 문의요',71,'2','D샵',125),(28,'문의맨','2019-12-18','문의해보자','문의다 해',71,'2','D샵',124),(29,'문의맨','2019-12-18','여기도 문의','저기도 문의',69,'2','B샵',118),(30,'문의맨','2019-12-18','무늬무늬','다양한 무늬',69,'2','B샵',119),(31,'문의맨','2019-12-18','다다다다다다','물어봐버려',69,'2','B샵',120),(32,'문의맨','2019-12-18','문의드립니다','드렸습니다',NULL,'1',NULL,NULL),(33,'문의맨','2019-12-18','문의드립니다2','드렸습니다2',NULL,'1',NULL,NULL),(34,'문의맨','2019-12-18','문의합니다','문의합니다',NULL,'1',NULL,NULL),(35,'문의맨','2019-12-18','문의합니다','문의합니다5',NULL,'1',NULL,NULL);
/*!40000 ALTER TABLE `t3_enquiry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_event`
--

DROP TABLE IF EXISTS `t3_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_event` (
  `eventNum` int(11) NOT NULL AUTO_INCREMENT,
  `manager` varchar(45) DEFAULT NULL,
  `eventDATE` date DEFAULT NULL,
  `startDATE` date DEFAULT NULL,
  `endDATE` date DEFAULT NULL,
  `eventMent` varchar(45) DEFAULT NULL,
  `eTitle` varchar(45) DEFAULT NULL,
  `eventDetail` varchar(45) DEFAULT NULL,
  `eventImg` text,
  `hit` int(11) DEFAULT '0',
  PRIMARY KEY (`eventNum`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_event`
--

LOCK TABLES `t3_event` WRITE;
/*!40000 ALTER TABLE `t3_event` DISABLE KEYS */;
INSERT INTO `t3_event` VALUES (2,'김기정','2019-12-12','2019-12-05','2019-12-28','1','픈오벤트이','event12.jpg','2.jpg',9),(3,'KKJ','2019-12-12','2019-12-04','2019-12-21','1','이벤트 등록','event2.jfif','3.jpg',2),(4,'김기정','2019-12-12','2019-12-04','2020-01-04','1','이벤트 등록','event3.png','4.jpg',1),(5,'Santa','2019-12-12','2019-12-03','2020-01-03','414','이것이다','event4.png','5.jpg',0),(6,'조큐트남','2019-12-12','2020-01-01','2020-01-10','1','큐트','event12.jpg','6.jpg',0),(25,'KKJ','2019-12-13','2019-12-03','2019-12-20','r','Custom Markers','event.png','1.jpg',2),(27,'김기정','2019-12-15','2019-12-06','2019-12-19','1234','공지사항','event6.jfif','2.jpg',3),(28,'김기정','2019-12-15','2019-12-04','2020-01-03','좋은 상품이야','이벤트 등록','event12.jpg','2.jpg',0),(29,'KKJ','2019-12-15','2019-12-05','2019-12-26','이벤트입니다','이벤트','event10.jpg','1.jpg',2),(30,'KKJ','2019-12-15','2019-12-05','2019-12-28','좋은 상품이야','이벤트 등록','event7.gif','6.jpg',0),(31,'관리자','2019-12-18','2019-12-07','2020-01-03','이벤트등록합니다','이벤트입니다','event3.png','6.jpg',0),(32,'관리자','2019-12-18','2019-12-07','2020-01-03','이벤트등록합니다','이벤트입니다','event3.png','6.jpg',0);
/*!40000 ALTER TABLE `t3_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_faq`
--

DROP TABLE IF EXISTS `t3_faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_faq` (
  `faqNum` int(11) NOT NULL AUTO_INCREMENT,
  `faqTitle` varchar(45) DEFAULT NULL,
  `faqMent` varchar(45) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  `hit` int(11) DEFAULT '0',
  PRIMARY KEY (`faqNum`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_faq`
--

LOCK TABLES `t3_faq` WRITE;
/*!40000 ALTER TABLE `t3_faq` DISABLE KEYS */;
INSERT INTO `t3_faq` VALUES (1,'배송비는 얼마인가요?','배송비는 판매자바이판매자입니다.','ship',0),(2,'군부대에도 배송이 가능한가요? (수정)','불가능합니다.','ship',0),(3,'택배사는 어디인가요?','판매자 바이 판매자입니다.','ship',0),(4,'상품권으로 결제가 가능한가요?','불가능합니다.','payment',0),(5,'동일한 상품인데 왜 가격이 다른가요?','판매자가 이상합니다.','payment',0),(6,'werr','wrertq34','ship',0),(10,'[환불] 다른사람 명의의 계좌로 환불가능?','본인 명의의 계좌로만 환불가능합니다.','exchange',0),(11,'[반품] 반품 신청을 철회하고 싶어요.','하세요','exchange',0),(12,'[취소] 배송전 취소신청을 했는데, 상품이 배송되었습니다.','돌려주세요','exchange',0),(13,'[결제수단] 이미 주문을 했는데, 결제 수단을 변경할 수 있나요?','없어요','payment',0),(14,'[현금영수증] 현금영수증은 어떻게 받나요?','못받아요','payment',0),(15,'상품에 대해서 문의하려면 어떻게 해야 하나요?','상품문의로 가세요','product',0),(16,'로그인이 안댐미다','아이디를 찾아보세요','member',0),(17,'이벤트 뭐에요?','없어요','event',0);
/*!40000 ALTER TABLE `t3_faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_info`
--

DROP TABLE IF EXISTS `t3_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_info` (
  `infoNum` int(11) NOT NULL AUTO_INCREMENT,
  `manager` varchar(45) DEFAULT NULL,
  `infoDATE` date DEFAULT NULL,
  `infoMent` varchar(45) DEFAULT NULL,
  `infoName` varchar(45) DEFAULT NULL,
  `hit` int(11) DEFAULT '0',
  PRIMARY KEY (`infoNum`)
) ENGINE=InnoDB AUTO_INCREMENT=244 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_info`
--

LOCK TABLES `t3_info` WRITE;
/*!40000 ALTER TABLE `t3_info` DISABLE KEYS */;
INSERT INTO `t3_info` VALUES (1,'김기정','2019-12-16','공지사항을 수정해봅시다. 수정~2333 233','공지사항 수정 (수정)',0),(3,'KKJ','2019-12-16','공지사항일까요 아닐까요','공지사항(수정)1',0),(4,'강기정','2019-12-13','공사지항이다','공사지항',0),(5,'기정강','2019-12-13','항공지사다','항공지사',0),(6,'KKJ','2019-12-13','공지사항 내용입니다.','공지사항',0),(23,'Santa','2019-12-11','Santa is REAL','공지테스트',0),(235,'관리자','2019-12-18','공지사항 입니다.','공지입니다',0),(236,'관리자','2019-12-18','공지사항 입니다.2','공지입니다2',0),(237,'관리자','2019-12-18','공지사항 입니다.23','공지입니다23',0),(238,'관리자','2019-12-18','공지사항입니다','공지가 늘어나요',0),(239,'관리자','2019-12-18','공지합니다다','공지합니다',0),(240,'관리자','2019-12-18','공지합니다다2','공지합니다',0),(241,'관리자','2019-12-18','공지합니다다2','공지합니니다',0),(242,'관리자','2019-12-18','공지사항이에요','공지사항입니다.',0),(243,'관리자','2019-12-18','공지공지','공지드립니다',0);
/*!40000 ALTER TABLE `t3_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_mainImg`
--

DROP TABLE IF EXISTS `t3_mainImg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_mainImg` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `banner1` text,
  `banner2` text,
  `banner3` text,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_mainImg`
--

LOCK TABLES `t3_mainImg` WRITE;
/*!40000 ALTER TABLE `t3_mainImg` DISABLE KEYS */;
INSERT INTO `t3_mainImg` VALUES (3,'2','3','4'),(4,'/images/mainImg/1afb9be6658a538facaddabcad437bd2','/images/mainImg/2964d789da6547154e3491cd4aae7aaa','/images/mainImg/1fbe8fae683093b5fb75030ddeae2d00'),(7,'/images/mainImg/00354c0803679a6149afc8d9b857c438','/images/mainImg/9fdfb0d262e56f00cb61d422f9dd629e','/images/mainImg/bab163abc4e61ed02bdfde3afb00434a'),(8,'/images/mainImg/c99ee974e33f2fba713990c8fa107140','/images/mainImg/1010f8bbc55995c35af747c5c8ce70a3','/images/mainImg/b444f3256b49d07451e2ee02d7b604eb'),(9,'/images/mainImg/6caf1a34c756ee5eb8161883ba2c8617','/images/mainImg/974ad553499ce4aac8c0751e74e3d357','/images/mainImg/c983c08001e0a1bffe01715ea0fe0594'),(10,'/images/mainImg/e3ae40b7302dc5595de7458de85e3c26','/images/mainImg/6310c5429f0514b8eb084839ce043b4d','/images/mainImg/4d170d56c675d63339d8fb1f2cb90c20'),(11,'/images/mainImg/b7a865fb5b1e6f687ca8919f151a9761','/images/mainImg/269aa327d39c0dd7f40756003e26d6fc','/images/mainImg/97c92b7304f67f15305c28d16c053146'),(12,'/images/mainImg/01af7ed6511b4c10dc8aa998a2ca9d28','/images/mainImg/d9b97c3e2e49d12bedecc4128c29d265','/images/mainImg/cd422bb8c49cb776cbe19371ab0da94c'),(13,'/images/mainImg/751d6b59e5b230cf331167548f7cbe44','/images/mainImg/fbb4afd84d6d72af47c13ce677d7173b','/images/mainImg/6af9769b78463b4017a51cd3e5304f0b');
/*!40000 ALTER TABLE `t3_mainImg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_member`
--

DROP TABLE IF EXISTS `t3_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_member` (
  `memberNum` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `id` varchar(45) NOT NULL DEFAULT '',
  `pw` varchar(45) NOT NULL,
  `tel` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `gender` varchar(45) NOT NULL,
  `birth` date NOT NULL,
  `per` int(11) NOT NULL,
  `point` int(11) DEFAULT NULL,
  `smsRec` int(11) NOT NULL,
  `emailRec` int(11) NOT NULL,
  PRIMARY KEY (`memberNum`,`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_member`
--

LOCK TABLES `t3_member` WRITE;
/*!40000 ALTER TABLE `t3_member` DISABLE KEYS */;
INSERT INTO `t3_member` VALUES (1,'관리자','admin777','1234',NULL,'han@naver.com','M','1994-08-13',9,1000,0,0),(3,'관리자2','admin2','1234',NULL,'admin@naver.com','M','1994-08-13',9,1000,0,0),(5,'garam','hanriver94','winterprit','010-7475-3462','hanriver94@naver.com','M','0000-00-00',9,1000,1,1),(6,'테스트용상점회원','test002','1111','010-7475-3462','test002@naver.com','W','1968-01-01',1,1000,0,0),(8,'테슽흐','tteesstt','1111','12345678900','tteesstt@tttttt','W','1997-01-01',0,1000,1,1),(9,'최길동','cjd','1111','12345628900','dfdf@dddd','W','1991-01-01',0,1000,1,0),(11,'김길동','join','1111','11111111111','ssdf@sdfsdfd','W','2001-01-01',0,1000,1,1),(12,'박길동','join','1111','11111111111','ssdf@sdfsdfd','W','1997-01-01',0,1000,1,1),(14,'길길동','grgrg','1111','11112345678','dfdf@dfdfsfe','W','1988-01-01',0,1000,1,1),(24,'가천샵','hyunji980','1111','01098765432','khj@khjkhj','W','1985-01-01',1,1000,0,0),(25,'이병건','lbk','1234','01012341234','kyle0223@naver.com','M','1996-02-23',0,1000,0,0),(26,'가람','kdhong','4321','01012341234','asdf@asdf.asd','M','1990-01-01',0,1000,0,0),(27,'상점','shop','1111','01011111111','shop@shop.shop','M','1989-01-01',1,0,0,0),(28,'임길동','asdfasdf','asdfasdf','01012345678','asdf@asdfasd.asdf','W','1978-01-01',0,1000,1,1),(46,'김현지','hyunji98','1111','11111111111','111@111','W','1989-01-01',0,1000,1,1),(47,'KHJSHOP','khjshop','1111','11111111111','khjshop@khjkhj','W','1998-01-01',1,1000,1,1),(48,'민길동','123123123','1111','01012345678','asdf@asdfasd.asdf','M','1982-01-01',0,1000,1,1),(49,'감스트','test001','1111','01011111111','qwer@naver.com','M','1978-01-01',0,1000,0,0),(51,'bts','bts','1111','01012345678','bts@btsbtsbts','M','1975-01-01',0,1000,1,1),(52,'강동원','bbbbbbb','1111','01012345678','asf@asdfadsfnasdf','W','1988-01-01',0,1000,0,0),(65,'원빈','abcd','1234','01012345678','asc@naver.com','M','1994-01-01',0,NULL,1,1),(68,'A샵','ashop','1111','01012345678','ashop@111111','W','2005-01-01',1,NULL,1,1),(69,'B샵','bshop','1111','11111111111','bshop@bbbb','W','2002-01-01',1,NULL,1,1),(70,'C샵','cshop','1111','01012345678','cshop@cccccc','W','2000-01-01',1,NULL,1,1),(71,'D샵','dshop','1111','11111111111','dshop@dddddd','W','1999-01-01',1,NULL,0,0),(72,'아이유','iu','1111','01000000000','iu@iuiu','W','1993-02-01',1,0,1,1),(73,'문의맨','test003','1111','01011111111','test@naver.com','M','1989-01-01',0,0,0,1),(74,'윤길동','ykd','1111','11111111111','ykd@ykdykd','M','1978-01-01',0,0,1,1),(75,'박진영','pjy','1111','01011221122','pjy@pjy','M','1969-01-01',0,0,1,1),(76,'이수만','lsm','1111','01067886788','lsm@lsm','M','1999-01-01',0,0,1,1),(77,'방시혁','bsh','1111','01078787878','bsh@bsh','M','1987-01-01',0,NULL,1,1),(78,'장금이','jke','1111','01099998989','jke@jke','W','1979-01-01',0,0,1,0),(79,'민소희','msh','1111','01066666666','msh@msh','W','2002-01-01',0,0,0,0);
/*!40000 ALTER TABLE `t3_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_optSet`
--

DROP TABLE IF EXISTS `t3_optSet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_optSet` (
  `optSetNum` int(11) NOT NULL AUTO_INCREMENT,
  `optSetName` varchar(45) NOT NULL,
  `optValue1` varchar(45) DEFAULT NULL,
  `optValue2` varchar(45) DEFAULT NULL,
  `optValue3` varchar(45) DEFAULT NULL,
  `optValue4` varchar(45) DEFAULT NULL,
  `optValue5` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`optSetNum`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_optSet`
--

LOCK TABLES `t3_optSet` WRITE;
/*!40000 ALTER TABLE `t3_optSet` DISABLE KEYS */;
INSERT INTO `t3_optSet` VALUES (2,'opt2','dd','b','','',''),(3,'rr','','','','',''),(4,'사이즈','sss','ddd','','',''),(5,'color','1','2','','',''),(6,'opt2','111','112','','',''),(7,'ddd','fff','','','',''),(8,'opt2','d','','','',''),(9,'eee','d','','','',''),(10,'opt2','d','','','',''),(11,'op1','a','','','',''),(12,'opt2','6','w','','',''),(13,'op1','a','abc','','',''),(14,'사이즈','S','M','L','XL','XXL'),(15,'color','red','green','blue','yellow','white'),(16,'사이즈','S','M','L','XL','XXL'),(17,'색상','red','green','blue','white','black'),(18,'색상','red','green','blue','black','white'),(19,'사이즈','S','M','L','XL','XXL'),(20,'color','S','b','e','',''),(21,'색상','6','w','4','',''),(22,'color','red','green','blue','white','yellow'),(23,'size','S','M','L','XL','XXL'),(24,'color','S','b','c','XL','t'),(25,'size','S','M','L','XL','XXL'),(26,'op1','e','e','2','r',''),(27,'색상','d','3','44','',''),(28,'부','날','다','가','목','봉'),(29,'위','개','리','슴',NULL,NULL),(30,'op1','6','ㅇ','ㄴ','',''),(31,'사이즈','ㅇ','','','',''),(32,'color','a','green','4','',''),(33,'opt2','6','w','','',''),(34,'o','d','d','d','d','d'),(35,'p',NULL,NULL,NULL,NULL,NULL),(36,'t',NULL,NULL,NULL,NULL,NULL),(37,'2',NULL,NULL,NULL,NULL,NULL),(38,'ㅇ','ㅇ','ㅇ','ㅇ','ㅇ','ㅇ'),(39,'d','d','d','d','d','d'),(40,'d','d','d','d',NULL,'d'),(41,'d','d','d','d',NULL,NULL),(42,'o','ㅇ','ㅇ','ㅇ','ㅇ','ㅇ'),(43,'p',NULL,NULL,NULL,NULL,NULL),(44,'t',NULL,NULL,NULL,NULL,NULL),(45,'2',NULL,NULL,NULL,NULL,NULL),(46,'무','체','포','사',NULL,NULL),(47,'늬','리','도','과',NULL,NULL),(48,'로','사','포','수','딸','레'),(49,'고','과','도','박','기','몬'),(50,'색','골','실','로',' ',' '),(51,'상','드','버','즈',NULL,NULL),(52,'색','블','블','레','레',' '),(53,'상','랙','랙','드','드',NULL),(54,'(','벨','벨','벨','벨',NULL),(55,'사','벳','벳','벳','벳',NULL),(56,'이','(','(',' ',' ',NULL),(57,'즈','L','M','(','(',NULL),(58,')',')',')','L','M',NULL),(59,'색','레','레','실','실',' '),(60,'상','드','드','버','버',NULL),(61,'(','(','(','(','(',NULL),(62,'타','귀','귀','귀','귀',NULL),(63,'입','걸','찌','걸','찌',NULL),(64,')','이',')','이',')',NULL),(65,'원','블','담','가','페','아'),(66,'석','랙','수','넷','리','마'),(67,'색','블','퍼','핑','화','옐'),(68,'상','루','플','크','이','로'),(69,'색','블','퍼','핑','화','옐'),(70,'상','루','플','크','이','로'),(71,'색','블','퍼','핑','화','옐'),(72,'상','루','플','크','이','로'),(73,'색','블','퍼','핑','화','옐'),(74,'상','루','플','크','이','로'),(75,'색','블','퍼','핑','화','옐'),(76,'상','루','플','크','이','로'),(77,'색','보','분','빨','파','노'),(78,'상','라','홍','간','란','란'),(79,'색','보','분','빨','노','초'),(80,'상','라','홍','간','란','록'),(81,'색','분','민','남','검','흰'),(82,'상','홍','트','색','은','색'),(83,'색','r','b','y','p','g'),(84,'상','e','l','e','i','r'),(85,'색','보','분','갈','연','흰'),(86,'상','라','홍','색','두','색'),(87,'색','r','b','p','b','y'),(88,'상','e','l','i','l','e'),(89,'색','r','b','y','p','p'),(90,'상','e','l','e','i','u'),(91,'색','남','분','연','흰','검'),(92,'상','색','홍','두','색','정'),(93,'색','레','코','체','핫','옐'),(94,'피','극','지','민','건','극'),(95,'부','지','성','감','성','건'),(96,'타','성',NULL,'성',NULL,'성'),(97,'입',NULL,NULL,NULL,NULL,NULL),(98,' ',' ',' ',' ',' ',' '),(99,'종','유','자','레',' ',' '),(100,'류','자','몽','몬',NULL,NULL),(101,' ',' ',' ',' ',' ',' '),(102,'색','베','브','네',' ',' '),(103,'상','이','라','이',NULL,NULL),(104,'사','2','2','2','2','2'),(105,'이','3','4','5','6','7'),(106,'즈','0','0','0','0','0'),(107,'양','5','1','1','2','2'),(108,'썸','곰','토','거','돼','닭'),(109,'네',NULL,'끼','북','지',NULL),(110,'일',NULL,NULL,'이',NULL,NULL),(111,'이',NULL,NULL,NULL,NULL,NULL),(112,'미',NULL,NULL,NULL,NULL,NULL),(113,'지',NULL,NULL,NULL,NULL,NULL),(114,'썸네일이미지','곰','토끼','거북이','돼지','닭'),(115,'색상','갈색','흰색','검은색','빨간색','회색'),(116,'첨','초','아','땅','호','잣'),(117,'색상','분홍','검정','녹색','갈색','회색'),(118,'맛','감귤','감귤2','감귤3','감귤4','감귤5'),(119,'색깔','빨강','분홍','연두','주황','노랑'),(120,'모양','하트','별','하트2','별2','하트3'),(121,'색상','red','blue','yellow','green','black'),(122,'향','클린솝','','','',''),(123,'향','클린솝','스윗자몽','블랙체리','튤립','아랑아랑'),(124,'맛','간장(기본)','간장(덜짠)','양념(기본)','양념(덜짠)','반반'),(125,'펜촉','펜촉F형','펜촉EF형','펜촉M형',' ',' '),(126,' ',' ',' ',' ',' ',' '),(127,'색상','핑크','레드','노랑','흰색','흑색'),(128,'','','','','',''),(129,'1','1','2','3','4','5'),(130,'d','d','d','d','d','d'),(131,'첨','잣','호','아','땅','초'),(132,'가',NULL,'두','몬','콩','코'),(133,'e','e','e','e','e','e'),(134,'색상','빨강','흰색','회색','검정','남색'),(135,'색상','검정','빨강','흰색','남색','회색'),(136,'색상','남색','갈색','검정','흰색','회색'),(137,'1','1','1','1','1','1'),(138,'배경색','분홍','노랑','하늘','흰색','검정'),(139,'색상','검','흰','분','녹','청'),(140,'색상','분홍','검정','흰색','노랑','검정'),(141,'그림','1','2','3','4','5'),(142,'1','1','1','1','1','1');
/*!40000 ALTER TABLE `t3_optSet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_optionValue`
--

DROP TABLE IF EXISTS `t3_optionValue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_optionValue` (
  `optValNum` int(11) NOT NULL AUTO_INCREMENT,
  `optVal` varchar(45) DEFAULT NULL,
  `productNum` int(11) NOT NULL,
  `productName` varchar(45) DEFAULT NULL,
  `optValName` varchar(45) NOT NULL,
  `optSetNum` int(11) NOT NULL,
  PRIMARY KEY (`optValNum`),
  KEY `optSetNum` (`optSetNum`),
  KEY `productNum` (`productNum`),
  CONSTRAINT `productNum` FOREIGN KEY (`productNum`) REFERENCES `t3_product` (`productNum`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t3_optionValue_ibfk_1` FOREIGN KEY (`optSetNum`) REFERENCES `t3_optSet` (`optSetNum`),
  CONSTRAINT `t3_optionValue_ibfk_2` FOREIGN KEY (`productNum`) REFERENCES `t3_product` (`productNum`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_optionValue`
--

LOCK TABLES `t3_optionValue` WRITE;
/*!40000 ALTER TABLE `t3_optionValue` DISABLE KEYS */;
INSERT INTO `t3_optionValue` VALUES (1,'블루',71,'가방','색상',106);
/*!40000 ALTER TABLE `t3_optionValue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_order`
--

DROP TABLE IF EXISTS `t3_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_order` (
  `orderNum` int(11) NOT NULL AUTO_INCREMENT,
  `receiver` varchar(45) DEFAULT NULL,
  `orderDate` date DEFAULT NULL,
  `orderAddr` varchar(45) DEFAULT NULL,
  `orderStatus` int(11) DEFAULT NULL,
  `orderMessage` text,
  `orderTel` varchar(45) DEFAULT NULL,
  `orderProduct` int(11) NOT NULL,
  `orderProductName` varchar(45) DEFAULT NULL,
  `optValNum` int(11) DEFAULT NULL,
  `deliveryNum` int(11) DEFAULT NULL,
  `deliveryCompany` varchar(45) DEFAULT NULL,
  `deliveryDate` date DEFAULT NULL,
  `buyerId` varchar(45) NOT NULL,
  `buyerNum` int(11) NOT NULL,
  `orderQuantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`orderNum`,`orderProduct`),
  KEY `orderProduct` (`orderProduct`),
  KEY `optValNum` (`optValNum`),
  KEY `buyerNum` (`buyerNum`),
  CONSTRAINT `buyerNum` FOREIGN KEY (`buyerNum`) REFERENCES `t3_member` (`memberNum`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t3_order_ibfk_1` FOREIGN KEY (`orderProduct`) REFERENCES `t3_product` (`productNum`),
  CONSTRAINT `t3_order_ibfk_2` FOREIGN KEY (`optValNum`) REFERENCES `t3_optionValue` (`optValNum`),
  CONSTRAINT `t3_order_ibfk_3` FOREIGN KEY (`buyerNum`) REFERENCES `t3_member` (`memberNum`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_order`
--

LOCK TABLES `t3_order` WRITE;
/*!40000 ALTER TABLE `t3_order` DISABLE KEYS */;
INSERT INTO `t3_order` VALUES (6,'상점','0000-00-00','강남',2,'없으면 경비실에 맡겨주세요','01012345678',51,'6번이였던것',1,2147483647,'로젠택배','0000-00-00','shop',27,1),(8,'상점','2019-12-13','경기도',2,'없으면 경비실에 맡겨주세요','01012345678',51,'커스텀폰케이스',NULL,NULL,NULL,NULL,'shop',27,2),(9,'상점','2019-12-13','경기도',2,'없으면 경비실에 맡겨주세요','01012345678',51,'커스텀폰케이스',NULL,NULL,NULL,NULL,'shop',27,3),(10,'상점','2019-12-13','경기도',0,'없으면 경비실에 맡겨주세요','01012345678',51,'커스텀폰케이스',NULL,NULL,NULL,NULL,'shop',27,1),(11,'상점','2019-12-13','경기도',0,'없으면 경비실에 맡겨주세요','01012345678',51,'커스텀폰케이스',NULL,NULL,NULL,'2019-12-31','shop',27,2),(12,'상점','2019-12-13','경기도',0,'없으면 경비실에 맡겨주세요','01012345678',51,'커스텀폰케이스',NULL,NULL,NULL,'2019-12-31','shop',27,2),(13,'상점','2019-12-13','경기도',0,'없으면 경비실에 맡겨주세요','01012345678',51,'커스텀폰케이스',NULL,NULL,NULL,'2019-12-31','shop',27,1),(14,'상점','2019-12-13','경기도',0,'없으면 경비실에 맡겨주세요','01012345678',51,'커스텀폰케이스',NULL,NULL,NULL,'2019-12-19','shop',27,1),(15,'김현지','2019-12-13','경기도 용인시 기흥구',0,'없으면 경비실에 맡겨주세요','01011111111',70,'코듀로이 복조리 손가방',NULL,NULL,NULL,'2019-12-31','hyunji980',24,1),(16,'상점','2019-12-13','경기도',3,'없으면 경비실에 맡겨주세요','01012345678',78,'노트북 파우치',NULL,12,'한진','2019-12-31','shop',27,4),(17,'상점','0000-00-00','경기도',0,'없으면 경비실에 맡겨주세요','01012345678',86,'동백꽃필무렵 넝쿨원석팔찌',1,2147483647,'로젠택배','0000-00-00','shop',27,3),(20,'상점','0000-00-00','경기도',2,'없으면 경비실에 맡겨주세요','01012345678',86,'동백꽃필무렵 넝쿨원석팔찌',NULL,0,'','0000-00-00','shop',27,3),(21,'상점','0000-00-00','경기도',0,'없으면 경비실에 맡겨주세요','01012345678',86,'동백꽃필무렵 넝쿨원석팔찌',NULL,0,'','0000-00-00','shop',27,4),(22,'상점','0000-00-00','경기도',0,'없으면 경비실에 맡겨주세요','01012345678',86,'동백꽃필무렵 넝쿨원석팔찌',NULL,0,'','0000-00-00','shop',27,4),(30,'상점','2019-12-15','경기도',1,'없으면 경비실에 맡겨주세요','01012345678',78,'노트북 파우치',NULL,11,'한진','2019-12-24','shop',27,1),(33,'aaaa','0000-00-00','asdf',2,'없으면 경비실에 맡겨주세요','01012345678',86,'넝쿨원석팔찌',NULL,0,'','0000-00-00','bbbbbbb',52,1),(34,'감스트','2019-12-05','수정구 태평동',2,'전날 연락주세요','01011111111',119,'볼빵빵 다람쥐 케이스',NULL,34,'','2019-12-26','test001',49,2),(35,'문의맨','2019-12-04','수정구 태평동',2,'전날 연락주세요','01011111111',118,'개굴군 에어팟 케이스',NULL,35,'','2019-12-20','test003',73,5),(36,'문의맨','2019-12-19','수정구 태평동',2,'당일 연락주세요','01011111111',119,'볼빵빵 다람쥐 케이스',NULL,36,'한진','2020-01-02','test003',73,2),(37,'민소희','2019-12-18','경기도',0,'없으면 경비실에 맡겨주세요','01011111111',120,'바이올렛 파우치',NULL,NULL,NULL,'2019-12-21','msh',79,1),(38,'민소희','2019-12-18','경기도',0,'없으면 경비실에 맡겨주세요','01044444444',118,'개굴군 에어팟 케이스',NULL,NULL,NULL,'2019-12-30','msh',79,2),(39,'장금이','2019-12-18','서울시 우리집',0,'없으면 경비실에 맡겨주세요','01099999999',125,'로마의 휴일',NULL,NULL,NULL,'2019-12-21','jke',78,1),(40,'이수만','2019-12-18','용인시 우리집',0,'없으면 경비실에 맡겨주세요','01088888888',121,'크리쑤마쑤마카롱',NULL,NULL,NULL,'2019-12-21','lsm',76,1),(41,'가천샵','2019-12-18','수원시 우리집',1,'없으면 경비실에 맡겨주세요','01066665555',120,'바이올렛 파우치',NULL,41,'한진','2019-12-28','hyunji980',24,1),(42,'윤길동','0000-00-00','성남시 수정구',2,'없으면 경비실에 맡겨주세요','01055555555',82,'한플향기 고체향수',NULL,42,'','0000-00-00','ykd',74,1),(43,'bts','2019-12-18','성남시 분당구',0,'없으면 경비실에 맡겨주세요','01000000000',85,'트윙클 슬라임',NULL,NULL,NULL,'2019-12-27','bts',51,1),(44,'아이유','2019-12-18','서울시',0,'없으면 경비실에 맡겨주세요','01033333333',84,'펜 케이스+만년필',NULL,NULL,NULL,'2019-12-29','iu',72,1),(45,'KHJSHOP','2019-12-18','경기도',0,'없으면 경비실에 맡겨주세요','01012345678',125,'로마의 휴일',NULL,NULL,NULL,'2019-12-30','khjshop',47,1),(46,'이병건','2019-12-18','서울시',0,'없으면 경비실에 맡겨주세요','01066666666',91,'지갑',NULL,NULL,NULL,'2019-12-28','lbk',25,1),(47,'박진영','2019-12-18','서울시',0,'없으면 경비실에 맡겨주세요','01099999999',123,'눈의꽃 세트',NULL,NULL,NULL,'2019-12-30','pjy',75,1),(48,'문의맨','0000-00-00','수정구 태평동',2,'당일 연락주세요','11111111',125,'로마의 휴일',NULL,48,'','0000-00-00','test003',73,1);
/*!40000 ALTER TABLE `t3_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_product`
--

DROP TABLE IF EXISTS `t3_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_product` (
  `productNum` int(11) NOT NULL AUTO_INCREMENT,
  `productName` varchar(45) NOT NULL,
  `price` int(11) DEFAULT NULL,
  `shopName` varchar(45) DEFAULT NULL,
  `shopNum` int(11) NOT NULL,
  `bigCate` varchar(45) DEFAULT NULL,
  `midCate` varchar(45) DEFAULT NULL,
  `smallCate` varchar(45) DEFAULT NULL,
  `productMent` text,
  `optSetNum` int(11) DEFAULT NULL,
  `minPrice` int(11) DEFAULT NULL,
  `proOptNum` varchar(45) DEFAULT NULL,
  `productImg` text,
  `detailImg` text,
  PRIMARY KEY (`productNum`,`productName`),
  KEY `shopNum` (`shopNum`),
  KEY `optSetNum` (`optSetNum`),
  CONSTRAINT `optSetNum` FOREIGN KEY (`optSetNum`) REFERENCES `t3_optSet` (`optSetNum`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shopNum` FOREIGN KEY (`shopNum`) REFERENCES `t3_shop` (`shopNum`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t3_product_ibfk_1` FOREIGN KEY (`shopNum`) REFERENCES `t3_shop` (`shopNum`),
  CONSTRAINT `t3_product_ibfk_2` FOREIGN KEY (`optSetNum`) REFERENCES `t3_optSet` (`optSetNum`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_product`
--

LOCK TABLES `t3_product` WRITE;
/*!40000 ALTER TABLE `t3_product` DISABLE KEYS */;
INSERT INTO `t3_product` VALUES (4,'테스트용4번상품',29800,'아이유',1,'전자제품','선풍기','냉풍기','테스트용4번상품~',NULL,NULL,NULL,NULL,NULL),(51,'커스텀폰케이스',20000,'아이유',1,'폰케이스','아이폰','20','아이폰',NULL,15000,'47,46','/images/uploads/products/e4132cf64b62b0c8cc1d58760699ab8e','/images/uploads/products/1af76fd94d378c4c8abf89fe94e25e9b'),(52,'아이폰케이스',20000,'아이유',1,'전자기기','핸드폰 케이스',NULL,'아이폰 케이스',NULL,17000,'49,48','/images/uploads/products/dfe8b56e265674deb1657363be86d350.png','/images/uploads/products/e0f1d43abe5ae6b7f8c43b6dfd881dbf.png'),(54,'블랙&레드벨벳 초커',8000,'아이유',1,'',NULL,NULL,'부드러운 벨벳으로 만든심플한 초커입니다.고급 벨벳으로 만들어피부에 닿는 쪽도 부드럽게 처리되어 있어요.',NULL,5000,'58,57,56,55,54,53,52','/images/uploads/products/2c87ce729bad64d8eb824f3007c4a4c0.png','/images/uploads/products/63ba5a54b5e604801aa1b8e57e44c054.png'),(55,'루돌프귀걸이',10000,'아이유',1,'',NULL,NULL,'크리스마스 시즌 기념 귀걸이입니당',NULL,7000,'64,63,62,61,60,59','/images/uploads/products/b1d145143685d3b36a064eb72723c3ea.png','/images/uploads/products/b1bb66f7af14adec55b925831c17ca5b.png'),(57,'오션블루바다디퓨저',22000,'가천샵',12,'비누, 캔들','디퓨저',NULL,'푸르른 바다의 느낌을 그대로 담아해초느낌의 드라이플라워와바닷속 자갈들로 향기롭게 구성된 바다디퓨져입니다.에메랄드빛 바다 속 싱그러운 초록빛 해초가 넘실거리는시원한 바다향 그대로를 느껴보세요.',NULL,19000,'76,75','/images/uploads/products/7b67ff4eb3e7046529960ec97124f8ff','/images/uploads/products/0e57a73d02efc69fbd6ab6b4b483eac3'),(65,'기본&발색립밤,수퍼립밤',8000,'가천샵',12,'뷰티','화장품',NULL,'보습력 좋고 발색도 자연스럽고 예쁜 립밤입니다',NULL,5000,'93','/images/uploads/products/206e1eef3f39a0275bb8c2881ad0b550','/images/uploads/products/7cffec6d24b37be1ae24d8a8348ad9b6'),(66,'얼티메이트 스킨토너',22000,'가천샵',12,'뷰티','화장품',NULL,'하이엔드급 유기농 원재료의 높은 함유량을 바탕으로 5가지 피부타입에 대응하며 천연 그대로의 특별한 향과 효능을 담은 프리미엄등급의 강화타입 궁극의 스킨토너 입니다.',NULL,19000,'97,96,95,94','/images/uploads/products/20ec58e7768bed1b6e34efed8c1ddf1a','/images/uploads/products/9e8ee70aa85c942ca904c5acf8fd7114'),(67,' 쌀콩쿠키 수제답례품',10000,'가천샵',12,'식품','디저트',NULL,'일반쿠키보다\r\n\r\n단백질 UP 영양 UP 당도 Down\r\n\r\n(NO밀가루,NO버터,NO백설탕,NO계란\r\n\r\n+ 無방부제,無색소)\r\n\r\n(치즈맛을 제외한 9가지맛은 비건식품입니다)',NULL,7000,'98','/images/uploads/products/71f80e2c4e8e1e269e2203e788f1eb7b','/images/uploads/products/e791ba627315e84e5e10a5edcf672116'),(68,'정성가득 수제 유자청',16000,'가천샵',12,'식품','커피/차',NULL,'마트에서 파는 유자처럼 방부제가 들어가지 않아\r\n수제청은 시즌에만 판매됩니다\r\n유자청 시즌 마감으로 12월중 생산된\r\n유자청 재고가 모두 소진시 내년 11월에\r\n다시 판매가 가능합니다\r\n자몽 레몬도 있어용\r\n12월중 판매중단 예정이므로 필요하신분들은\r\n미리 주문주세요^^',NULL,13000,'100,99','/images/uploads/products/3dcdeb607b45dc5ba20948e6c0dd77dd','/images/uploads/products/dccbeccf39d4fe1730be32578db9ff8a'),(69,'휴대용 토끼 인형',28000,'가천샵',12,'완구, 팬시','인형',NULL,'사랑하는 나의 아기와 오랫동안함께 할 수 있는 좋은 애착 인형.아기의 특별한 촉각친구를 소개합니다.촉각 인형은 애착 인형보다 작은 미니 사이즈의 애착 인형으로 아기의 오감 기능 발달을 더 해줄 기능성 인형입니다.',NULL,25000,'101','/images/uploads/products/1d3c904d9702ba9190d13b46f05923d1','/images/uploads/products/db7a56e81275b4c65e21d0225c78dcce'),(70,'코듀로이 복조리 손가방',20000,'가천샵',12,'잡화','가방',NULL,'사이즈\r\n몸통 : 10*20*30 cm\r\n가방끈 : 폭 10cm / 총길이 30cm\r\n\r\n부드럽고 따뜻한 느낌을 주는 골덴 원단을 ,\r\n안쪽은 톡톡한두께감의 옥스포드 원단 사용하였어요',NULL,17000,'103,102','/images/uploads/products/0d49fafa4002deaac273b463f1f7812d','/images/uploads/products/b2683dcc979052214925f73a9068aa66'),(71,'사리슈즈 사계절 블로퍼',40000,'가천샵',12,'잡화','신발',NULL,'사리슈즈 중 SARI의 최애 패턴이에요 ❣착화사진과 같이무난한 캐주얼룩에 포인트로 코디하기 좋아요톤다운된 컬러라 많이 튀는 색감이 아니어서데일리로도 추천해드립니다',NULL,37000,'106,105,104','/images/uploads/products/e458bbf6e19d14080baa2eb23b7d0d58','/images/uploads/products/5329ee6607148a93ea5a855fa38bb229'),(77,'쿠키 세트',25000,'KHJSHOP',11,'식품','디저트',NULL,'맛있는 쿠키 세트',NULL,20000,'116,115','/images/uploads/products/05540962377458332af7fe2decc2ff7a','/images/uploads/products/c1264efbafce36fd5b5afbf0f7d81091'),(78,'노트북 파우치',20000,'KHJSHOP',11,'전자기기','파우치',NULL,'노트북 파우치',NULL,17000,'117,116','/images/uploads/products/b7870cf8e29f789ecdda55080b5f7723','/images/uploads/products/a10f3d3a5b8ad9230f9cd273b9223c85'),(79,'제주 초콜릿',10000,'KHJSHOP',11,'식품','디저트',NULL,'제주 초콜릿',NULL,9000,'119,118','/images/uploads/products/c3726227f089682f9e98724e933156a9','/images/uploads/products/08ddffd1ec4dfd13f83236a729468b59'),(80,'목걸이',20000,'KHJSHOP',11,'액세서리','목걸이',NULL,'목걸이 ㅇㅇ',NULL,19000,'121,120','/images/uploads/products/1fbab114303bcdd9170b0b0d44a29b8c','/images/uploads/products/06bcd6d21f20a0f96bbe45102f3438c2'),(82,'한플향기 고체향수',12000,'가천샵',12,'뷰티','향수',NULL,'자연유래성분사용/높은 부향률로 인한 6~8시간 이상 향기 지속/간편한 휴대\r\n★2018 서울어워드 우수상품 선정\r\n★평창올림픽 참가 업체\r\n★천연 화장품 특허 및 다수의 특허 보유',NULL,9000,'123','/images/uploads/products/5316d6e3e776f3b46295118a9162f217','/images/uploads/products/db2ff520ecd8d7f959185ff6510dbaa3'),(83,'깐새우장+양념깐새우장',12000,'가천샵',12,'식품','수제반찬',NULL,'맛있는 새우장',NULL,9000,'124','/images/uploads/products/c1452aa9cb9995d379bb9b9d4478d52b','/images/uploads/products/de9ed4668ccbf282432f2aabde447dd3'),(84,'펜 케이스+만년필',80000,'가천샵',12,'완구, 팬시','문구/팬시',NULL,'• 무료 배송 •• 무료 각인 •• 이탈리안 소가죽 펜케이스 증정 •• 평생 무상 수리 •로즈우드를 깎아 만든 만년필입니다.조밀한 나무 결과 짙은 밤색이 아름다운 펜입니다.',NULL,77000,'125,124','/images/uploads/products/37d44526c86e4bdc7756addda0ac1f57','/images/uploads/products/ec825c451cd708c9a68ce8f41d408934'),(85,'트윙클 슬라임',10000,'가천샵',12,'완구, 팬시','장난감',NULL,'은하수를 닮은 컬러와 은은하게 빛나는 펄들이 매력적인 슬라임입니다',NULL,7000,'126','/images/uploads/products/b9fbd137fab1c9e94d0436414b481606','/images/uploads/products/0a787e2cd5e48988890bdf5bc0ed9669'),(86,'넝쿨원석팔찌',15000,'가천샵',12,'액세서리','팔찌,발찌',NULL,'☄원석을 지니고 있으면 좋은기운과 일을 불러오고,안좋은 것들은 막아준다고합니다.부디 제작품을 구입하시는 모든분들이더 좋은일이더더 즐거운 일이더더더 행복한 일들이가득하셨으면좋겠습니다',NULL,12000,'127,126','/images/uploads/products/c4e3d35f71f66153f3b735f42658118a','/images/uploads/products/0db6acd54e75669e15201c2d83cb49ed'),(91,'지갑',20000,'KHJSHOP',11,'잡화','지갑',NULL,'핸드메이드 지갑',NULL,17000,'134,133','/images/uploads/products/7574f44734d06ec4e152bef143d1cb84','/images/uploads/products/f3b37b02403216bb8b9216619746e0ed'),(116,'디코스 바디로션',15000,'C샵',23,'뷰티','화장품',NULL,' 건조한 요즘 촉촉하고 부드러운 피부를 유지시켜주는 순한 바디 로션이에요. 얼굴에만 신경쓰느라 몸이 건조해지는 걸 모르고 계셨던 분들을 위하여 대용량 바디로션을 준비했습니다.\r\n\r\n대나무수와 갈락토미세스 여과물도 들어가 있어 보습뿐만 아니라 피부에 청량감 및 광채까지 더하여 디자인 하였습니다.',NULL,12000,NULL,'/images/uploads/products/00e8c163f2e162d60922984fc2b5b394','/images/uploads/products/e8c943367911d2dc1dc772a18d0a1b87'),(117,'디코스 레티놀 앰플',16000,'C샵',23,'뷰티','화장품',NULL,'레티놀은 화장품으로 쓰일 수 있는 성분 중에서도 효과가 매우 뚜렷한 성분 중 하나입니다. 레티놀의 역할은 진피의 골라겐 생성과 더불어 콜라겐 분해 억제 및 표피의 정상화입니다.\r\n하지만 피부에 효과가 있는 만큼 자극적인 성분이기도 합니다. 레티놀 앰플의 경우 꼭 낮이 아닌 밤에 발라주시고, 초반에는 3~4일에 한 번씩만 사용 해 주세요. 그 후 3일, 2틀에 한 번씩 횟수를 늘려주시면 좋습니다.\r\n',NULL,13000,NULL,'/images/uploads/products/cbfc80d777d2975267b6f94d99ef89dd','/images/uploads/products/f0162fb910b40e15f33abd9b14ebc3d4'),(118,'개굴군 에어팟 케이스',28000,'B샵',22,'전자기기','에어팟/버즈 케이스',NULL,'귀욤귀욤한 디자인의 초록동자\r\n개굴군 에어팟케이스를 소개합니다.\r\n\r\n미카앤루시 핸드메이드 개굴군케이스는,\r\n동굴동굴한 눈과\r\n혹시 눈치채셨나요?\r\n손에 든 까만 벌레가 포인트인\r\n장난꾸러기 청개구리입니다.',NULL,25000,NULL,'/images/uploads/products/21e1e41ef25af4aa14421f4c39bdc57e','/images/uploads/products/99a1b4abd49ce994837fb1d032ff84df'),(119,'볼빵빵 다람쥐 케이스',25000,'B샵',22,'전자기기','에어팟/버즈 케이스',NULL,'빵빵한 두볼이 사랑스러운 다람쥐 케이스에요.\r\n 쉽게 벗겨지지 않도록\r\n제품에 미끄럼 방지 처리가 되어있어요.',NULL,22000,NULL,'/images/uploads/products/3846b35efe27cad8aa54d796925b2360','/images/uploads/products/84be3e33494d3e2127145fe4e69d7e19'),(120,'바이올렛 파우치',28000,'B샵',22,'전자기기','파우치',NULL,'바이올렛 체크 아이패드파우치 입니다',NULL,25000,NULL,'/images/uploads/products/3d760ba3176e179ed348d5be7797cee5','/images/uploads/products/de485f2a42abb419a81d6a18236db855'),(121,'크리쑤마쑤마카롱',16000,'A샵',21,'식품','디저트',NULL,'❤100% 아몬드가루로 만드는 쫀득하고 통통한 꼬끄와\r\n비정제원당과 유기농버터로 만드는 담백하고 부드러운 필링의 프리미엄 수제마카롱입니다❤\r\n\r\n시중의 설탕과 방부제 범벅인 퓨레와 잼을 넣지 않습니다.\r\n비정제원당으로 직접 만들어 사용합니다.\r\n\r\n구름 - 순우유\r\n곰돌이 - 흑당피칸\r\n눈송이 - 더블베리\r\n눈사람 - 오레오\r\n눈내리는 트리 - 피넛버터\r\n루돌프 - 초코우유',NULL,13000,NULL,'/images/uploads/products/d24cacee3964e7b7d6e882646cad7aa5','/images/uploads/products/920429858ff5ffb05df0019536a76379'),(122,'소주 생일선물 케이크',43000,'A샵',21,'식품','디저트',NULL,'소주인줄 알았지? 케이크지롱',NULL,40000,NULL,'/images/uploads/products/e8e965952dfdddaedc5a0747eac1f90d','/images/uploads/products/2ababd576baf007162b03d1400e3a3c0'),(123,'눈의꽃 세트',19000,'D샵',24,'액세서리','귀걸이',NULL,'하얀눈꽃,\r\n영롱한 얼음조각등\r\n겨울을 상징하는 눈꽃을 모티브로\r\n세트상품으로 제작했습니다\r\n\r\n얼굴이 화사하고 예뻐보여요\r\n적당히 포인트 되면서 가볍고 달랑거리는\r\n착용감이 부담스럽지않고\r\n돋보이게 해줍니다\r\n\r\n•귀걸이침소재: 은침+무니켈도금\r\n•목걸이: 신주+백금도금/길이 38cm',NULL,16000,NULL,'/images/uploads/products/aa999b783c7f3cb0fd6a6578a2d53d43','/images/uploads/products/cf49faf2f225926bd2ce28251e6eae68'),(124,'엘사 얼음성 귀걸이',15000,'D샵',24,'액세서리','귀걸이',NULL,'겨울왕국2개봉을 기념으로\r\n엘사를 모티브로 제작한 얼음성 귀걸이입니다\r\n가운데 동그란 구슬은\r\n마법을 걸어놓은 마법구슬이에요\r\n각도에따라 파란구슬이 보라빛으로 변신합니다❄️\r\n\r\n얼음성으로 놀러오세요 여러분(´▽`ʃƪ)♡',NULL,12000,NULL,'/images/uploads/products/231ba7c2e8d3f8a35ec0758958cedf6c','/images/uploads/products/658aff5151b011c277132c1a06ec3747'),(125,'로마의 휴일',20000,'D샵',24,'액세서리','목걸이',NULL,'로마의 휴일 속 Aodrey Hepburn의\r\n고급스러운 목걸이를 모티브하여\r\n현대적으로 재해석한 작품이에요\r\n\r\n일상에서도 데일리하게 착용할 수 있도록\r\n부담스럽지 않은 디자인으로 제작했고\r\n넥 라인을 화려하고 돋보이게 만들어주는 작품이랍니다\r\n\r\n롱 드롭으로 내려오는 물방울 팬던트가\r\n포인트인 초커라인 목걸이로 진주와 함께 디자인하여\r\n엔틱하면서 우아한 무드가 가득하답니다',NULL,17000,NULL,'/images/uploads/products/eeb11c8387b8711b029295408efe5870','/images/uploads/products/813d0ac34365c8a2dba0b6f0ae435329'),(126,'수제 케이크',20000,'KHJSHOP',11,'식품','디저트',NULL,'맛있는 케이크입니다.',NULL,17000,NULL,'/images/uploads/products/9d4185f90bb1e632c461b9bea77db643','/images/uploads/products/e0763269a03b7e21de9894169533856a'),(127,'천연가죽팔찌',16000,'D샵',24,'액세서리','팔찌,발찌',NULL,'정교한 꼬임작업이 된 천연가죽 팔찌로\r\n고급스러운 디자인입니다.\r\n\r\n천연가죽 특성상 착용하면서 ⏳시간이 지남에 따라\r\n자연스럽게 태닝되는 가죽의 느낌이\r\n분위기 있는 연출이 가능한 팔찌입니다.\r\n\r\n평범한 일상을 특별한 날을 만들어줄\r\n',NULL,13000,NULL,'/images/uploads/products/b6a79ba3d59815480f8fb4be692fddda','/images/uploads/products/664d6bc8356cde1f2a10e7700be373a3'),(128,'액운 방지 비휴 반지',22000,'D샵',24,'액세서리','반지',NULL,'액운은 막아주고 재물을 불러오는\r\n\"경면 주사 비휴\" 실버 반지\r\n\r\n\r\n소재, 크기: 비휴(silver 925), 오닉스4mm,\r\n경면주사 약6mm(여의주문양)\r\n\r\n\r\n\r\n나쁜기운은 싹~ 막아주고\r\n\r\n재물을 불러들이는 신비한 동물 \'비휴\'와\r\n\r\n소원을 이루어주는 여의주 문양의 경면주사로\r\n\r\n제작된 비휴 반지입니다. ~~',NULL,19000,NULL,'/images/uploads/products/9e20af59d26e452126be6ee1c6e79c50','/images/uploads/products/2d68a5785eb4459483cd01f83dc8f401'),(129,'군고구마 비누',10000,'가천샵',12,'비누, 캔들','비누',NULL,'###먹는거 아닙니다 비누입니다###\r\n완전 감쪽같은 군고구마 비누입니다.\r\n손씻을 때마다 달달한 고구마 향을 느껴보아요~\r\n진짜 고구마 같다고 한 입 베어 물면 큰일납니다!',NULL,7000,NULL,'/images/uploads/products/2faa4640995f6bb75bccbe338a84deb6','/images/uploads/products/993b7148cc72e54fa19f42ca958ca447'),(130,'귀요미 골덴모자',12000,'가천샵',12,'잡화','모자',NULL,'귀욤귀욤 어디에서나 우리아이가 주인공이 될거에요^^ ',NULL,9000,NULL,'/images/uploads/products/77116c6eecdcd9fabf8f693f5460b70f','/images/uploads/products/5e014ee9c8773bcd6af5cbab551ba2b7');
/*!40000 ALTER TABLE `t3_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_review`
--

DROP TABLE IF EXISTS `t3_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_review` (
  `reviewNum` int(11) NOT NULL AUTO_INCREMENT,
  `writer` varchar(45) DEFAULT NULL,
  `writerNum` int(11) DEFAULT NULL,
  `shopName` varchar(45) DEFAULT NULL,
  `shopNum` int(11) DEFAULT NULL,
  `reviewMent` varchar(45) DEFAULT NULL,
  `reviewImg` text,
  `productName` varchar(45) DEFAULT NULL,
  `productNum` int(11) DEFAULT NULL,
  `reviewDATE` date DEFAULT NULL,
  `assessment` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`reviewNum`),
  KEY `productNum` (`productNum`),
  KEY `writerNum` (`writerNum`),
  KEY `shopNum` (`shopNum`),
  CONSTRAINT `t3_review_ibfk_1` FOREIGN KEY (`productNum`) REFERENCES `t3_product` (`productNum`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t3_review_ibfk_2` FOREIGN KEY (`writerNum`) REFERENCES `t3_member` (`memberNum`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t3_review_ibfk_3` FOREIGN KEY (`shopNum`) REFERENCES `t3_shop` (`shopNum`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_review`
--

LOCK TABLES `t3_review` WRITE;
/*!40000 ALTER TABLE `t3_review` DISABLE KEYS */;
INSERT INTO `t3_review` VALUES (1,'감스트',49,'가천샵',12,'좋은 상품입니다','review.jpg','상품1',86,'2019-12-17','좋아요'),(3,'감스트',49,'가천샵',12,'좋은 상품입니다','review.jpg','상품1',86,'2019-12-17','좋아요'),(4,'감스트',49,'가천샵',12,'좋은 상품입니다','','상품1',86,'2019-12-17','좋아요'),(5,'상점',27,'잡화점',1,'배송이빨라요','airpod.jpg','6번이였던것',51,'2019-12-18','최고에요'),(6,'문의맨',73,'B샵',22,'괜찮은 상품인거같아요 배송은 별로..','review2.jpg','개굴군 에어팟 케이스',118,'2019-12-18','별로에요'),(7,'윤길동',74,'가천샵',12,'별로였어요','review.jpg','한플향기 고체향수',82,'2019-12-18','별로에요'),(8,'문의맨',73,'D샵',24,'좋은 상품입니다 만족해요','review3.jpg','로마의 휴일',125,'2019-12-18','최고에요'),(9,'문의맨',73,'D샵',24,'만족해버립니다','review4.jpg','로마의 휴일',125,'2019-12-18','최고에요'),(10,'문의맨',73,'D샵',24,'퀄리티가 좋군요','review5.jpg','로마의 휴일',125,'2019-12-18','최고에요'),(11,'문의맨',73,'D샵',24,'만족합니다!!','review6.jpg','로마의 휴일',125,'2019-12-18','최고에요'),(12,'문의맨',73,'B샵',22,'귀여워요~~','review8.jpg','개굴군 에어팟 케이스',118,'2019-12-18','최고에요'),(13,'문의맨',73,'B샵',22,'귀여워요~~123','review8.jpg','개굴군 에어팟 케이스',118,'2019-12-18','최고에요'),(14,'문의맨',73,'B샵',22,'사랑스러워요~~','review9.jpg','개굴군 에어팟 케이스',118,'2019-12-18','최고에요'),(15,'문의맨',73,'B샵',22,'너무좋아요','review3.jpg','개굴군 에어팟 케이스',118,'2019-12-18','최고에요'),(16,'문의맨',73,'B샵',22,'very good!!','review4.jpg','개굴군 에어팟 케이스',118,'2019-12-18','괜찮아요'),(17,'문의맨',73,'B샵',22,'good!!','review6.jpg','개굴군 에어팟 케이스',118,'2019-12-18','좋아요'),(18,'문의맨',73,'B샵',22,'good!!','airpod.jpg','개굴군 에어팟 케이스',118,'2019-12-18','최고에요'),(19,'문의맨',73,'B샵',22,'good!!','airpod.jpg','개굴군 에어팟 케이스',118,'2019-12-18','괜찮아요'),(20,'문의맨',73,'B샵',22,'nice item','review2.jpg','개굴군 에어팟 케이스',118,'2019-12-18','괜찮아요'),(21,'문의맨',73,'B샵',22,'nice item~~','review3.jpg','개굴군 에어팟 케이스',118,'2019-12-18','괜찮아요');
/*!40000 ALTER TABLE `t3_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_shop`
--

DROP TABLE IF EXISTS `t3_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_shop` (
  `shopNum` int(11) NOT NULL AUTO_INCREMENT,
  `shopName` varchar(45) NOT NULL,
  `shopMent` text,
  `openshopNum` int(11) DEFAULT NULL,
  `masterEmail` varchar(45) DEFAULT NULL,
  `shopAddr` varchar(45) DEFAULT NULL,
  `shopStatus` int(11) DEFAULT NULL,
  `masternum` int(11) DEFAULT NULL,
  `master` varchar(45) DEFAULT NULL,
  `masterTel` varchar(45) DEFAULT NULL,
  `shopImg` text,
  PRIMARY KEY (`shopNum`,`shopName`),
  KEY `masternum` (`masternum`),
  CONSTRAINT `t3_shop_ibfk_1` FOREIGN KEY (`masternum`) REFERENCES `t3_member` (`memberNum`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_shop`
--

LOCK TABLES `t3_shop` WRITE;
/*!40000 ALTER TABLE `t3_shop` DISABLE KEYS */;
INSERT INTO `t3_shop` VALUES (1,'아이유','아이유 상점',NULL,'iu@iuiu','경기도 용인시',1,1,'아이유','01088888888','/images/uploads/products/acee9d208a9a3affb4d558fd6f117b65'),(3,'업체1','좋은 상품이야',NULL,'qwer@naver.com','수정구 태평동',0,NULL,'믹밈믹','010-1111-1111',NULL),(7,'KAIVA','좋은 상품이야',NULL,'qwer@naver.com','수정구 태평동',0,NULL,'Santa','010-1111-1111',NULL),(8,'수제품','ㅁㄴㅇㄹ',NULL,'han@han.com','서울 마천동',0,NULL,'가람','02-888-8888',NULL),(10,'업체1','좋은 상품이야',NULL,'qwer@naver.com','수정구 태평동',0,NULL,'KKJ','010-1111-1111',NULL),(11,'KHJSHOP','다양한 핸드메이드 제품을 판매합니다...',NULL,'khj@khjkhj','경기도 용인시 기흥구',1,47,'KHJSHOP','01043214321','/images/uploads/products/f0a5b7c5758fddd5d50a06b52e6e025a'),(12,'가천샵','영업중입니다',NULL,'gc@gcgc','성남시 수정구',1,24,'가천샵','01012345678','/images/uploads/products/e873c9730af5f1e9d9461aa1a1331280'),(18,'업체1','좋은 상품이야',NULL,'qwer@naver.com','수정구 태평동',0,49,'KKJ','010-1111-1111','event.png'),(19,'업체테스트','상점테스트',NULL,'qwer@naver.com','수정구 태평동',0,49,'김기정','010-1111-1111','30.jpg'),(21,'A샵','맛있는 먹거리를 팝니다',NULL,'aaa@aaa.aaa','경기도 성남시 수정구',1,68,'A샵','0311111111','/images/uploads/products/d0775761db22bc14da7b74dc905d1e41'),(22,'B샵','전자기기 관련 물건을 팝니다',NULL,'bbbb@bbbb.bbb','서울특별시 송파구',1,69,'B샵','01011111111','/images/uploads/products/1d7f00c971f256a86266694a30e69191'),(23,'C샵','수제 천연 화장품 순하고 정말 좋은 제품들입니다.  좋은 재료들만 사용합니다 ٩(๑`ɞ ´๑)۶',NULL,'ccc@ccc.ccc','경기도 성남시 수정구',1,70,'C샵','01099999999','/images/uploads/products/79795b21efca5fa138b2ad1682868be2'),(24,'D샵','예쁜 귀걸이 반지 목걸이 팔아요 (◞ꈍ 8ꈍ)◞⋆**♥',NULL,'ddd@ddd.ddd','경기도 수원시 영통구',1,71,'D샵','01022222222','/images/uploads/products/1ad05b2834434e2af8b40b67475d4fbf');
/*!40000 ALTER TABLE `t3_shop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t3_stock`
--

DROP TABLE IF EXISTS `t3_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t3_stock` (
  `stockIdx` int(11) NOT NULL AUTO_INCREMENT,
  `stockProduct` int(11) NOT NULL,
  `stockDATE` date DEFAULT NULL,
  `stockAmount` int(11) DEFAULT NULL,
  `shopNum` int(11) DEFAULT NULL,
  `stockProdName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`stockIdx`),
  KEY `stockProduct` (`stockProduct`),
  KEY `shopNum` (`shopNum`),
  CONSTRAINT `t3_stock_ibfk_1` FOREIGN KEY (`stockProduct`) REFERENCES `t3_product` (`productNum`),
  CONSTRAINT `t3_stock_ibfk_2` FOREIGN KEY (`shopNum`) REFERENCES `t3_shop` (`shopNum`)
) ENGINE=InnoDB AUTO_INCREMENT=578 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t3_stock`
--

LOCK TABLES `t3_stock` WRITE;
/*!40000 ALTER TABLE `t3_stock` DISABLE KEYS */;
INSERT INTO `t3_stock` VALUES (13,70,'2019-12-30',5,12,'코듀로이 복조리 손가방'),(14,70,'2019-12-31',4,12,'코듀로이 복조리 손가방'),(15,70,'2019-12-21',5,12,'코듀로이 복조리 손가방'),(16,70,'2019-12-22',5,12,'코듀로이 복조리 손가방'),(17,70,'2019-12-23',5,12,'코듀로이 복조리 손가방'),(18,70,'2019-12-24',5,12,'코듀로이 복조리 손가방'),(19,70,'2019-12-25',5,12,'코듀로이 복조리 손가방'),(20,71,'2019-12-14',3,12,'사리슈즈 사계절 블로퍼(러블리)'),(21,71,'2019-12-15',3,12,'사리슈즈 사계절 블로퍼(러블리)'),(22,71,'2019-12-16',3,12,'사리슈즈 사계절 블로퍼(러블리)'),(23,71,'2019-12-17',3,12,'사리슈즈 사계절 블로퍼(러블리)'),(24,71,'2019-12-18',3,12,'사리슈즈 사계절 블로퍼(러블리)'),(25,71,'2019-12-19',3,12,'사리슈즈 사계절 블로퍼(러블리)'),(26,71,'2019-12-20',5,12,'사리슈즈 사계절 블로퍼(러블리)'),(27,71,'2019-12-21',2,12,'사리슈즈 사계절 블로퍼(러블리)'),(28,71,'2019-12-22',5,12,'사리슈즈 사계절 블로퍼(러블리)'),(29,71,'2019-12-23',5,12,'사리슈즈 사계절 블로퍼(러블리)'),(30,71,'2019-12-24',5,12,'사리슈즈 사계절 블로퍼(러블리)'),(31,71,'2019-12-25',5,12,'사리슈즈 사계절 블로퍼(러블리)'),(37,79,'2019-12-19',1,11,'제주 초콜릿'),(38,79,'2019-12-21',4,11,'제주 초콜릿'),(39,79,'2019-12-28',5,11,'제주 초콜릿'),(40,80,'2019-12-14',5,11,'목걸이'),(41,80,'2019-12-23',5,11,'목걸이'),(42,80,'2019-12-27',4,11,'목걸이'),(61,85,'2019-12-14',5,12,'오로라 트윙클 클리어 슬라임'),(62,85,'2019-12-15',5,12,'오로라 트윙클 클리어 슬라임'),(63,85,'2019-12-16',5,12,'오로라 트윙클 클리어 슬라임'),(64,85,'2019-12-17',5,12,'오로라 트윙클 클리어 슬라임'),(65,85,'2019-12-18',5,12,'오로라 트윙클 클리어 슬라임'),(66,85,'2019-12-19',5,12,'오로라 트윙클 클리어 슬라임'),(67,85,'2019-12-20',5,12,'오로라 트윙클 클리어 슬라임'),(78,85,'2019-12-21',5,12,'오로라 트윙클 클리어 슬라임'),(79,85,'2019-12-22',5,12,'오로라 트윙클 클리어 슬라임'),(80,85,'2019-12-23',5,12,'오로라 트윙클 클리어 슬라임'),(81,85,'2019-12-24',5,12,'오로라 트윙클 클리어 슬라임'),(82,85,'2019-12-25',5,12,'오로라 트윙클 클리어 슬라임'),(83,85,'2019-12-26',5,12,'오로라 트윙클 클리어 슬라임'),(84,85,'2019-12-27',4,12,'오로라 트윙클 클리어 슬라임'),(85,85,'2019-12-28',4,12,'오로라 트윙클 클리어 슬라임'),(86,85,'2019-12-29',5,12,'오로라 트윙클 클리어 슬라임'),(87,85,'2019-12-30',3,12,'오로라 트윙클 클리어 슬라임'),(88,86,'2019-12-14',1,12,'동백꽃필무렵 넝쿨원석팔찌'),(89,86,'2019-12-14',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(90,86,'2019-12-15',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(91,86,'2019-12-16',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(92,86,'2019-12-17',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(93,86,'2019-12-18',4,12,'동백꽃필무렵 넝쿨원석팔찌'),(94,86,'2019-12-19',2,12,'동백꽃필무렵 넝쿨원석팔찌'),(96,86,'2019-12-21',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(97,86,'2019-12-22',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(98,86,'2019-12-23',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(99,86,'2019-12-24',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(100,86,'2019-12-25',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(101,86,'2019-12-26',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(104,86,'2019-12-29',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(105,86,'2019-12-30',5,12,'동백꽃필무렵 넝쿨원석팔찌'),(106,84,'2019-12-14',5,12,'가죽 펜 케이스+로즈우드 만년필'),(107,84,'2019-12-14',5,12,'가죽 펜 케이스+로즈우드 만년필'),(108,84,'2019-12-15',2,12,'가죽 펜 케이스+로즈우드 만년필'),(109,84,'2019-12-16',5,12,'가죽 펜 케이스+로즈우드 만년필'),(110,84,'2019-12-17',5,12,'가죽 펜 케이스+로즈우드 만년필'),(111,84,'2019-12-18',5,12,'가죽 펜 케이스+로즈우드 만년필'),(112,84,'2019-12-19',5,12,'가죽 펜 케이스+로즈우드 만년필'),(113,84,'2019-12-20',4,12,'가죽 펜 케이스+로즈우드 만년필'),(114,84,'2019-12-21',5,12,'가죽 펜 케이스+로즈우드 만년필'),(115,84,'2019-12-22',5,12,'가죽 펜 케이스+로즈우드 만년필'),(116,84,'2019-12-23',5,12,'가죽 펜 케이스+로즈우드 만년필'),(117,84,'2019-12-24',5,12,'가죽 펜 케이스+로즈우드 만년필'),(118,84,'2019-12-25',5,12,'가죽 펜 케이스+로즈우드 만년필'),(119,84,'2019-12-26',4,12,'가죽 펜 케이스+로즈우드 만년필'),(120,84,'2019-12-27',5,12,'가죽 펜 케이스+로즈우드 만년필'),(121,84,'2019-12-28',5,12,'가죽 펜 케이스+로즈우드 만년필'),(122,84,'2019-12-29',4,12,'가죽 펜 케이스+로즈우드 만년필'),(123,84,'2019-12-30',5,12,'가죽 펜 케이스+로즈우드 만년필'),(124,83,'2019-12-14',5,12,'깐새우장+양념깐새우장'),(125,83,'2019-12-14',5,12,'깐새우장+양념깐새우장'),(126,83,'2019-12-15',5,12,'깐새우장+양념깐새우장'),(127,83,'2019-12-16',5,12,'깐새우장+양념깐새우장'),(128,83,'2019-12-17',4,12,'깐새우장+양념깐새우장'),(129,83,'2019-12-18',5,12,'깐새우장+양념깐새우장'),(130,83,'2019-12-19',5,12,'깐새우장+양념깐새우장'),(131,83,'2019-12-20',5,12,'깐새우장+양념깐새우장'),(132,83,'2019-12-21',5,12,'깐새우장+양념깐새우장'),(133,83,'2019-12-22',5,12,'깐새우장+양념깐새우장'),(134,83,'2019-12-23',5,12,'깐새우장+양념깐새우장'),(135,83,'2019-12-24',5,12,'깐새우장+양념깐새우장'),(136,83,'2019-12-25',5,12,'깐새우장+양념깐새우장'),(137,83,'2019-12-26',5,12,'깐새우장+양념깐새우장'),(138,83,'2019-12-27',5,12,'깐새우장+양념깐새우장'),(139,83,'2019-12-28',5,12,'깐새우장+양념깐새우장'),(140,83,'2019-12-29',5,12,'깐새우장+양념깐새우장'),(141,83,'2019-12-30',5,12,'깐새우장+양념깐새우장'),(142,82,'2019-12-14',5,12,'한플향기 고체향수'),(143,82,'2019-12-14',5,12,'한플향기 고체향수'),(144,82,'2019-12-15',5,12,'한플향기 고체향수'),(145,82,'2019-12-16',5,12,'한플향기 고체향수'),(146,82,'2019-12-17',5,12,'한플향기 고체향수'),(147,82,'2019-12-18',5,12,'한플향기 고체향수'),(148,82,'2019-12-19',5,12,'한플향기 고체향수'),(149,82,'2019-12-20',5,12,'한플향기 고체향수'),(150,82,'2019-12-21',5,12,'한플향기 고체향수'),(151,82,'2019-12-22',5,12,'한플향기 고체향수'),(152,82,'2019-12-23',5,12,'한플향기 고체향수'),(153,82,'2019-12-24',5,12,'한플향기 고체향수'),(154,82,'2019-12-25',5,12,'한플향기 고체향수'),(155,82,'2019-12-26',5,12,'한플향기 고체향수'),(156,82,'2019-12-27',5,12,'한플향기 고체향수'),(157,82,'2019-12-28',4,12,'한플향기 고체향수'),(158,82,'2019-12-29',5,12,'한플향기 고체향수'),(159,82,'2019-12-30',5,12,'한플향기 고체향수'),(160,77,'2019-12-20',5,11,'쿠키 세트'),(161,77,'2019-12-24',2,11,'쿠키 세트'),(162,77,'2019-12-28',3,11,'쿠키 세트'),(163,77,'2019-12-31',4,11,'쿠키 세트'),(164,78,'2019-12-18',4,11,'노트북 파우치'),(165,78,'2019-12-25',5,11,'노트북 파우치'),(166,78,'2019-12-30',3,11,'노트북 파우치'),(167,79,'2019-12-20',10,11,'제주 초콜릿'),(168,79,'2019-12-30',10,11,'제주 초콜릿'),(169,80,'2019-12-20',5,11,'목걸이'),(170,80,'2019-12-30',2,11,'목걸이'),(171,77,'2019-12-11',5,11,'쿠키 세트'),(172,91,'2019-12-28',5,11,'지갑'),(173,77,'2019-12-18',5,11,'쿠키 세트'),(174,77,'2019-12-28',7,11,'쿠키 세트'),(175,77,'2019-12-26',5,11,'쿠키 세트'),(176,78,'2019-12-18',4,11,'노트북 파우치'),(299,80,'2019-12-20',3,11,'목걸이'),(300,121,'2019-12-19',5,21,'크리쑤마쑤마카롱'),(301,121,'2019-12-20',2,21,'크리쑤마쑤마카롱'),(302,121,'2019-12-21',0,21,'크리쑤마쑤마카롱'),(303,121,'2019-12-23',2,21,'크리쑤마쑤마카롱'),(304,121,'2019-12-24',2,21,'크리쑤마쑤마카롱'),(305,121,'2019-12-25',3,21,'크리쑤마쑤마카롱'),(306,121,'2019-12-26',4,21,'크리쑤마쑤마카롱'),(307,121,'2019-12-27',5,21,'크리쑤마쑤마카롱'),(308,121,'2019-12-28',2,21,'크리쑤마쑤마카롱'),(309,121,'2019-12-29',6,21,'크리쑤마쑤마카롱'),(310,121,'2019-12-30',2,21,'크리쑤마쑤마카롱'),(311,121,'2020-01-03',4,21,'크리쑤마쑤마카롱'),(312,121,'2020-01-04',3,21,'크리쑤마쑤마카롱'),(329,122,'2019-12-19',5,22,'소주 생일선물 케이크'),(330,122,'2019-12-20',2,22,'소주 생일선물 케이크'),(331,122,'2019-12-21',1,22,'소주 생일선물 케이크'),(332,122,'2019-12-22',1,22,'소주 생일선물 케이크'),(333,122,'2019-12-23',2,22,'소주 생일선물 케이크'),(334,122,'2019-12-24',2,22,'소주 생일선물 케이크'),(335,122,'2019-12-25',3,22,'소주 생일선물 케이크'),(336,122,'2019-12-26',4,22,'소주 생일선물 케이크'),(337,122,'2019-12-27',5,22,'소주 생일선물 케이크'),(338,122,'2019-12-28',2,22,'소주 생일선물 케이크'),(339,122,'2019-12-29',6,22,'소주 생일선물 케이크'),(340,122,'2019-12-30',2,22,'소주 생일선물 케이크'),(341,122,'2020-01-01',4,22,'소주 생일선물 케이크'),(342,122,'2020-01-02',4,22,'소주 생일선물 케이크'),(343,122,'2020-01-03',4,22,'소주 생일선물 케이크'),(344,122,'2020-01-04',3,22,'소주 생일선물 케이크'),(345,122,'2020-01-08',3,22,'소주 생일선물 케이크'),(346,122,'2020-01-09',3,22,'소주 생일선물 케이크'),(348,123,'2019-12-19',5,24,'눈의꽃 세트'),(349,123,'2019-12-20',2,24,'눈의꽃 세트'),(350,123,'2019-12-21',1,24,'눈의꽃 세트'),(351,123,'2019-12-22',1,24,'눈의꽃 세트'),(352,123,'2019-12-23',2,24,'눈의꽃 세트'),(353,123,'2019-12-24',2,24,'눈의꽃 세트'),(354,123,'2019-12-25',3,24,'눈의꽃 세트'),(355,123,'2019-12-26',4,24,'눈의꽃 세트'),(356,123,'2019-12-27',5,24,'눈의꽃 세트'),(357,123,'2019-12-28',2,24,'눈의꽃 세트'),(358,123,'2019-12-29',6,24,'눈의꽃 세트'),(359,123,'2019-12-30',1,24,'눈의꽃 세트'),(360,123,'2020-01-01',4,24,'눈의꽃 세트'),(361,123,'2020-01-02',4,24,'눈의꽃 세트'),(362,123,'2020-01-03',4,24,'눈의꽃 세트'),(363,123,'2020-01-04',3,24,'눈의꽃 세트'),(364,123,'2020-01-08',3,24,'눈의꽃 세트'),(365,123,'2020-01-09',3,24,'눈의꽃 세트'),(367,124,'2019-12-19',5,24,'엘사 얼음성 귀걸이'),(368,124,'2019-12-20',2,24,'엘사 얼음성 귀걸이'),(369,124,'2019-12-21',1,24,'엘사 얼음성 귀걸이'),(370,124,'2019-12-22',1,24,'엘사 얼음성 귀걸이'),(371,124,'2019-12-23',2,24,'엘사 얼음성 귀걸이'),(372,124,'2019-12-24',2,24,'엘사 얼음성 귀걸이'),(373,124,'2019-12-27',5,24,'엘사 얼음성 귀걸이'),(374,124,'2019-12-28',2,24,'엘사 얼음성 귀걸이'),(375,124,'2019-12-29',6,24,'엘사 얼음성 귀걸이'),(376,124,'2019-12-30',2,24,'엘사 얼음성 귀걸이'),(377,124,'2020-01-01',4,24,'엘사 얼음성 귀걸이'),(378,124,'2020-01-02',4,24,'엘사 얼음성 귀걸이'),(379,124,'2020-01-03',4,24,'엘사 얼음성 귀걸이'),(380,124,'2020-01-04',3,24,'엘사 얼음성 귀걸이'),(381,124,'2020-01-08',3,24,'엘사 얼음성 귀걸이'),(382,124,'2020-01-09',3,24,'엘사 얼음성 귀걸이'),(383,125,'2019-12-19',5,24,'로마의 휴일'),(384,125,'2019-12-20',1,24,'로마의 휴일'),(385,125,'2019-12-21',0,24,'로마의 휴일'),(386,125,'2019-12-22',1,24,'로마의 휴일'),(387,125,'2019-12-23',2,24,'로마의 휴일'),(388,125,'2019-12-24',2,24,'로마의 휴일'),(389,125,'2019-12-25',3,24,'로마의 휴일'),(390,125,'2019-12-28',2,24,'로마의 휴일'),(391,125,'2019-12-29',6,24,'로마의 휴일'),(392,125,'2019-12-30',1,24,'로마의 휴일'),(393,125,'2020-01-01',4,24,'로마의 휴일'),(394,125,'2020-01-02',4,24,'로마의 휴일'),(395,125,'2020-01-03',4,24,'로마의 휴일'),(396,125,'2020-01-04',3,24,'로마의 휴일'),(397,125,'2020-01-08',3,24,'로마의 휴일'),(398,125,'2020-01-10',3,24,'로마의 휴일'),(399,125,'2020-01-11',3,24,'로마의 휴일'),(400,125,'2020-01-14',3,24,'로마의 휴일'),(401,120,'2019-12-19',5,22,'바이올렛 파우치'),(402,120,'2019-12-20',2,22,'바이올렛 파우치'),(403,120,'2019-12-21',0,22,'바이올렛 파우치'),(404,120,'2019-12-22',1,22,'바이올렛 파우치'),(405,120,'2019-12-23',2,22,'바이올렛 파우치'),(406,120,'2019-12-24',2,22,'바이올렛 파우치'),(407,120,'2019-12-25',3,22,'바이올렛 파우치'),(408,120,'2019-12-28',1,22,'바이올렛 파우치'),(409,120,'2019-12-29',6,22,'바이올렛 파우치'),(410,120,'2019-12-30',2,22,'바이올렛 파우치'),(411,120,'2020-01-01',4,22,'바이올렛 파우치'),(412,120,'2020-01-02',4,22,'바이올렛 파우치'),(413,120,'2020-01-03',4,22,'바이올렛 파우치'),(414,120,'2020-01-04',3,22,'바이올렛 파우치'),(415,120,'2020-01-08',3,22,'바이올렛 파우치'),(416,120,'2020-01-10',3,22,'바이올렛 파우치'),(417,120,'2020-01-11',3,22,'바이올렛 파우치'),(418,120,'2020-01-14',3,22,'바이올렛 파우치'),(419,119,'2019-12-19',5,22,'볼빵빵 다람쥐 케이스'),(420,119,'2019-12-20',2,22,'볼빵빵 다람쥐 케이스'),(421,119,'2019-12-21',1,22,'볼빵빵 다람쥐 케이스'),(422,119,'2019-12-22',1,22,'볼빵빵 다람쥐 케이스'),(423,119,'2019-12-23',2,22,'볼빵빵 다람쥐 케이스'),(424,119,'2019-12-24',2,22,'볼빵빵 다람쥐 케이스'),(425,119,'2019-12-25',3,22,'볼빵빵 다람쥐 케이스'),(426,119,'2019-12-28',0,22,'볼빵빵 다람쥐 케이스'),(427,119,'2019-12-29',6,22,'볼빵빵 다람쥐 케이스'),(428,119,'2019-12-30',0,22,'볼빵빵 다람쥐 케이스'),(429,119,'2020-01-01',4,22,'볼빵빵 다람쥐 케이스'),(430,119,'2020-01-02',4,22,'볼빵빵 다람쥐 케이스'),(431,119,'2020-01-03',4,22,'볼빵빵 다람쥐 케이스'),(432,119,'2020-01-04',3,22,'볼빵빵 다람쥐 케이스'),(433,119,'2020-01-08',3,22,'볼빵빵 다람쥐 케이스'),(434,119,'2020-01-10',3,22,'볼빵빵 다람쥐 케이스'),(435,119,'2020-01-11',3,22,'볼빵빵 다람쥐 케이스'),(436,119,'2020-01-14',3,22,'볼빵빵 다람쥐 케이스'),(437,118,'2019-12-19',5,22,'볼빵빵 다람쥐 케이스'),(438,118,'2019-12-20',2,22,'볼빵빵 다람쥐 케이스'),(439,118,'2019-12-21',1,22,'볼빵빵 다람쥐 케이스'),(440,118,'2019-12-22',1,22,'볼빵빵 다람쥐 케이스'),(441,118,'2019-12-23',2,22,'볼빵빵 다람쥐 케이스'),(442,118,'2019-12-24',2,22,'볼빵빵 다람쥐 케이스'),(443,118,'2019-12-25',5,22,'볼빵빵 다람쥐 케이스'),(444,118,'2019-12-28',0,22,'볼빵빵 다람쥐 케이스'),(445,118,'2019-12-29',6,22,'볼빵빵 다람쥐 케이스'),(446,118,'2019-12-30',0,22,'볼빵빵 다람쥐 케이스'),(447,118,'2020-01-01',4,22,'볼빵빵 다람쥐 케이스'),(448,118,'2020-01-02',3,22,'볼빵빵 다람쥐 케이스'),(449,118,'2020-01-03',4,22,'볼빵빵 다람쥐 케이스'),(450,118,'2020-01-04',4,22,'볼빵빵 다람쥐 케이스'),(451,118,'2020-01-08',4,22,'볼빵빵 다람쥐 케이스'),(452,118,'2020-01-10',4,22,'볼빵빵 다람쥐 케이스'),(453,118,'2020-01-11',4,22,'볼빵빵 다람쥐 케이스'),(454,118,'2020-01-14',3,22,'볼빵빵 다람쥐 케이스'),(455,118,'2020-01-15',3,22,'볼빵빵 다람쥐 케이스'),(456,118,'2020-01-16',3,22,'볼빵빵 다람쥐 케이스'),(457,51,'2019-12-19',5,1,'커스텀폰케이스'),(458,51,'2019-12-20',2,1,'커스텀폰케이스'),(459,51,'2019-12-21',1,1,'커스텀폰케이스'),(460,51,'2019-12-22',1,1,'커스텀폰케이스'),(461,51,'2019-12-23',2,1,'커스텀폰케이스'),(462,51,'2019-12-24',2,1,'커스텀폰케이스'),(463,51,'2019-12-25',5,1,'커스텀폰케이스'),(464,51,'2019-12-28',5,1,'커스텀폰케이스'),(465,51,'2019-12-29',6,1,'커스텀폰케이스'),(466,51,'2019-12-30',2,1,'커스텀폰케이스'),(467,51,'2020-01-01',4,1,'커스텀폰케이스'),(468,51,'2020-01-02',3,1,'커스텀폰케이스'),(469,51,'2020-01-03',4,1,'커스텀폰케이스'),(470,51,'2020-01-04',4,1,'커스텀폰케이스'),(471,51,'2020-01-08',4,1,'커스텀폰케이스'),(472,51,'2020-01-10',4,1,'커스텀폰케이스'),(473,51,'2020-01-11',4,1,'커스텀폰케이스'),(474,51,'2020-01-14',3,1,'커스텀폰케이스'),(475,51,'2020-01-15',3,1,'커스텀폰케이스'),(476,51,'2020-01-16',3,1,'커스텀폰케이스'),(478,129,'2019-12-19',5,12,'군고구마 비누'),(479,129,'2019-12-20',2,12,'군고구마 비누'),(480,129,'2019-12-21',1,12,'군고구마 비누'),(481,129,'2019-12-22',1,12,'군고구마 비누'),(482,129,'2019-12-23',2,12,'군고구마 비누'),(483,129,'2019-12-24',2,12,'군고구마 비누'),(484,129,'2019-12-25',5,12,'군고구마 비누'),(485,129,'2019-12-28',5,12,'군고구마 비누'),(486,129,'2019-12-29',6,12,'군고구마 비누'),(487,129,'2019-12-30',2,12,'군고구마 비누'),(488,129,'2020-01-01',4,12,'군고구마 비누'),(489,129,'2020-01-02',3,12,'군고구마 비누'),(490,129,'2020-01-03',4,12,'군고구마 비누'),(491,129,'2020-01-04',4,12,'군고구마 비누'),(492,129,'2020-01-08',4,12,'군고구마 비누'),(493,129,'2020-01-10',4,12,'군고구마 비누'),(494,129,'2020-01-11',4,12,'군고구마 비누'),(495,129,'2020-01-14',3,12,'군고구마 비누'),(496,129,'2020-01-15',3,12,'군고구마 비누'),(497,129,'2020-01-16',3,12,'군고구마 비누'),(498,130,'2019-12-19',5,12,'귀요미 골덴모자'),(499,130,'2019-12-20',2,12,'귀요미 골덴모자'),(500,130,'2019-12-21',1,12,'귀요미 골덴모자'),(501,130,'2019-12-22',1,12,'귀요미 골덴모자'),(502,130,'2019-12-23',2,12,'귀요미 골덴모자'),(503,130,'2019-12-24',2,12,'귀요미 골덴모자'),(504,130,'2019-12-25',5,12,'귀요미 골덴모자'),(505,130,'2019-12-28',5,12,'귀요미 골덴모자'),(506,130,'2019-12-29',6,12,'귀요미 골덴모자'),(507,130,'2019-12-30',2,12,'귀요미 골덴모자'),(508,130,'2020-01-01',4,12,'귀요미 골덴모자'),(509,130,'2020-01-02',3,12,'귀요미 골덴모자'),(510,130,'2020-01-03',4,12,'귀요미 골덴모자'),(511,130,'2020-01-04',4,12,'귀요미 골덴모자'),(512,130,'2020-01-08',4,12,'귀요미 골덴모자'),(513,130,'2020-01-10',4,12,'귀요미 골덴모자'),(514,130,'2020-01-11',4,12,'귀요미 골덴모자'),(515,130,'2020-01-14',3,12,'귀요미 골덴모자'),(516,130,'2020-01-15',3,12,'귀요미 골덴모자'),(517,130,'2020-01-16',3,12,'귀요미 골덴모자'),(518,128,'2019-12-19',5,24,'액운 방지 비휴 반지'),(519,128,'2019-12-20',2,24,'액운 방지 비휴 반지'),(520,128,'2019-12-21',1,24,'액운 방지 비휴 반지'),(521,128,'2019-12-22',1,24,'액운 방지 비휴 반지'),(522,128,'2019-12-23',2,24,'액운 방지 비휴 반지'),(523,128,'2019-12-24',2,24,'액운 방지 비휴 반지'),(524,128,'2019-12-25',5,24,'액운 방지 비휴 반지'),(525,128,'2019-12-28',5,24,'액운 방지 비휴 반지'),(526,128,'2019-12-29',6,24,'액운 방지 비휴 반지'),(527,128,'2019-12-30',2,24,'액운 방지 비휴 반지'),(528,128,'2020-01-01',4,24,'액운 방지 비휴 반지'),(529,128,'2020-01-02',3,24,'액운 방지 비휴 반지'),(530,128,'2020-01-03',4,24,'액운 방지 비휴 반지'),(531,128,'2020-01-04',4,24,'액운 방지 비휴 반지'),(532,128,'2020-01-08',4,24,'액운 방지 비휴 반지'),(533,128,'2020-01-10',4,24,'액운 방지 비휴 반지'),(534,128,'2020-01-11',4,24,'액운 방지 비휴 반지'),(535,128,'2020-01-14',3,24,'액운 방지 비휴 반지'),(536,128,'2020-01-15',3,24,'액운 방지 비휴 반지'),(537,128,'2020-01-16',3,24,'액운 방지 비휴 반지'),(538,127,'2019-12-19',5,24,'천연가죽팔찌'),(539,127,'2019-12-20',2,24,'천연가죽팔찌'),(540,127,'2019-12-21',1,24,'천연가죽팔찌'),(541,127,'2019-12-22',1,24,'천연가죽팔찌'),(542,127,'2019-12-23',2,24,'천연가죽팔찌'),(543,127,'2019-12-24',2,24,'천연가죽팔찌'),(544,127,'2019-12-25',5,24,'천연가죽팔찌'),(545,127,'2019-12-28',5,24,'천연가죽팔찌'),(546,127,'2019-12-29',6,24,'천연가죽팔찌'),(547,127,'2019-12-30',2,24,'천연가죽팔찌'),(548,127,'2020-01-01',4,24,'천연가죽팔찌'),(549,127,'2020-01-02',3,24,'천연가죽팔찌'),(550,127,'2020-01-03',4,24,'천연가죽팔찌'),(551,127,'2020-01-04',4,24,'천연가죽팔찌'),(552,127,'2020-01-08',4,24,'천연가죽팔찌'),(553,127,'2020-01-10',4,24,'천연가죽팔찌'),(554,127,'2020-01-11',4,24,'천연가죽팔찌'),(555,127,'2020-01-14',3,24,'천연가죽팔찌'),(556,127,'2020-01-15',3,24,'천연가죽팔찌'),(557,127,'2020-01-16',3,24,'천연가죽팔찌'),(558,126,'2019-12-19',5,24,'수제 케이크'),(559,126,'2019-12-20',2,24,'수제 케이크'),(560,126,'2019-12-21',1,24,'수제 케이크'),(561,126,'2019-12-22',1,24,'수제 케이크'),(562,126,'2019-12-23',2,24,'수제 케이크'),(563,126,'2019-12-24',2,24,'수제 케이크'),(564,126,'2019-12-25',5,24,'수제 케이크'),(565,126,'2019-12-28',5,24,'수제 케이크'),(566,126,'2019-12-29',6,24,'수제 케이크'),(567,126,'2019-12-30',2,24,'수제 케이크'),(568,126,'2020-01-01',4,24,'수제 케이크'),(569,126,'2020-01-02',3,24,'수제 케이크'),(570,126,'2020-01-03',4,24,'수제 케이크'),(571,126,'2020-01-04',4,24,'수제 케이크'),(572,126,'2020-01-08',4,24,'수제 케이크'),(573,126,'2020-01-10',4,24,'수제 케이크'),(574,126,'2020-01-11',4,24,'수제 케이크'),(575,126,'2020-01-14',3,24,'수제 케이크'),(576,126,'2020-01-15',3,24,'수제 케이크'),(577,126,'2020-01-16',3,24,'수제 케이크');
/*!40000 ALTER TABLE `t3_stock` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-18 21:32:48
