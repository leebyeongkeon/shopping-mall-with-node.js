$(document).ready(function(){
   var bigCate;
   var midCate;
  $("#bigCate").change(function(){
     bigCate=$("#bigCate option").index($("#bigCate option:selected"));
     $("#midCate").empty();
     switch(bigCate){

       case 1:
          $("#midCate").append("<option value='목걸이'>목걸이</option>");
          $("#midCate").append("<option value='귀걸이'>귀걸이</option>");
          $("#midCate").append("<option value='반지'>반지</option>");
          $("#midCate").append("<option value='팔찌,발찌'>팔찌,발찌</option>");
          $("#midCate").append("<option value='기타'>기타</option>");
          break;
       case 2:
          $("#midCate").append("<option value='비누'>비누</option>");
          $("#midCate").append("<option value='캔들'>캔들</option>");
          $("#midCate").append("<option value='디퓨저'>디퓨저</option>");
          break;
       case 3:
          $("#midCate").append("<option value='화장품'>화장품</option>");
          $("#midCate").append("<option value='향수'>향수</option>");
         break;
       case 4:
          $("#midCate").append("<option value='가방'>가방</option>");
          $("#midCate").append("<option value='신발'>신발</option>");
          $("#midCate").append("<option value='모자'>모자</option>");
          $("#midCate").append("<option value='지갑'>지갑</option>");
          break;
       case 5:
          $("#midCate").append("<option value='핸드폰 케이스'>핸드폰 케이스</option>");
          $("#midCate").append("<option value='에어팟/버즈 케이스'>에어팟/버즈 케이스</option>");
          $("#midCate").append("<option value='파우치'>파우치</option>");
          break;
       case 6:
          $("#midCate").append("<option value='인형'>인형</option>");
          $("#midCate").append("<option value='문구/팬시'>문구/팬시</option>");
          $("#midCate").append("<option value='장난감'>장난감</option>");
          break;
       case 7:
          $("#midCate").append("<option value='디저트'>디저트</option>");
          $("#midCate").append("<option value='커피/차'>커피/차</option>");
          $("#midCate").append("<option value='수제반찬'>수제반찬</option>");
          break;
      }
   });
   // $("#midCate").change(function(){
   //    midCate=$("#midCate option").index($("#midCate option:selected"));
   //    midCate+=3*(bigCate-1);
   //    console.log(bigCate);
   //    switch(midCate){
   //      case 1:
   //         $("#smallCate option:eq(1)").replaceWith("<option value='1'>1</option>");
   //         $("#smallCate option:eq(2)").replaceWith("<option value='2'>2</option>");
   //         $("#smallCate option:eq(3)").replaceWith("<option value='3'>3</option>");
   //         break;
   //
   //      case 2:
   //         $("#smallCate option:eq(1)").replaceWith("<option value='4'>4</option>");
   //         $("#smallCate option:eq(2)").replaceWith("<option value='5'>5</option>");
   //         $("#smallCate option:eq(3)").replaceWith("<option value='6'>6</option>");
   //         break;
   //      case 3:
   //        $("#smallCate option:eq(1)").replaceWith("<option value='7'>7</option>");
   //        $("#smallCate option:eq(2)").replaceWith("<option value='8'>8</option>");
   //        $("#smallCate option:eq(3)").replaceWith("<option value='9'>9</option>");
   //        break;
   //        //bigCate1인 경우
   //      case 4:
   //        $("#smallCate option:eq(1)").replaceWith("<option value='10'>10</option>");
   //        $("#smallCate option:eq(2)").replaceWith("<option value='11'>11</option>");
   //        $("#smallCate option:eq(3)").replaceWith("<option value='12'>12</option>");
   //        break;
   //      case 5:
   //        $("#smallCate option:eq(1)").replaceWith("<option value='13'>13</option>");
   //        $("#smallCate option:eq(2)").replaceWith("<option value='14'>14</option>");
   //        $("#smallCate option:eq(3)").replaceWith("<option value='15'>15</option>");
   //        break;
   //      case 6:
   //        $("#smallCate option:eq(1)").replaceWith("<option value='16'>16</option>");
   //        $("#smallCate option:eq(2)").replaceWith("<option value='17'>17</option>");
   //        $("#smallCate option:eq(3)").replaceWith("<option value='18'>18</option>");
   //        break;
   //        //bigCate2인 경우
   //      case 7:
   //        $("#smallCate option:eq(1)").replaceWith("<option value='19'>19</option>");
   //        $("#smallCate option:eq(2)").replaceWith("<option value='20'>20</option>");
   //        $("#smallCate option:eq(3)").replaceWith("<option value='21'>21</option>");
   //        break;
   //      case 8:
   //        $("#smallCate option:eq(1)").replaceWith("<option value='22'>22</option>");
   //        $("#smallCate option:eq(2)").replaceWith("<option value='23'>23</option>");
   //        $("#smallCate option:eq(3)").replaceWith("<option value='24'>24</option>");
   //        break;
   //      case 9:
   //        $("#smallCate option:eq(1)").replaceWith("<option value='25'>25</option>");
   //        $("#smallCate option:eq(2)").replaceWith("<option value='26'>26</option>");
   //        $("#smallCate option:eq(3)").replaceWith("<option value='27'>27</option>");
   //        break;
   //        //bigCate3인 경우
   //      }
   //  });
});
