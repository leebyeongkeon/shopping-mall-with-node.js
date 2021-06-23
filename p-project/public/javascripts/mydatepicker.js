$(document).ready(function(){
  $('#datepicker').focus(
    function(){
      var dates=$('#hiddendate').val();
      dates=dates.substr(0,dates.length-1);
      var dateArray=dates.split(',');
      var days="";
      for(var i=0;i<dateArray.length;i++){
        var date=new Date(dateArray[i]);
        var month=date.getMonth()+1;//getMonth는 0부터 11까지의 값을 가진다
        var day=date.getDate();
        var year=date.getFullYear();
        days+=year+"-"+month+"-"+day+",";
      }
      days=days.substr(0,days.length-1);
      // alert(days);
      dayList=days.split(",");//날짜가 yyyy-mm-dd 형식으로 표현된 배열
      //ejs에 저장해둔 날짜값들을 받아와 파싱했음

      $('#datepicker').datepicker({
        prevText: '이전 달',
        nextText: '다음 달',
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        dayNames: ['일','월','화','수','목','금','토'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        dayNamesMin: ['일','월','화','수','목','금','토'],
        ShowMonthAfterYear: true,
        changeMonth: true,
        changeYear: true,
        yearSuffix: '년',
        beforeShowDay: disableSomeDay
      });
      function disableSomeDay(date){
        var month=date.getMonth()+1;
        var dates=date.getDate();
        var year=date.getFullYear();

        for(var i=0;i<dayList.length;i++){
          if($.inArray(year+'-'+month+'-'+dates,dayList)==-1){
            return [false];
          }
          else{
            return [true];
          }
          
        }
      }
    }
  );
  $('#datepicker').change(
    function(){
      var selected = $('#datepicker').val();
      var temp = selected.split("/");
      var selToString=temp[2]+"-"+temp[0]+"-"+temp[1];
      var index = dayList.indexOf(selToString);
      //재고 날짜 배열로부터 선택된 날짜의 인덱스 값을 반환받고, 인덱스 값으로 재고 최대 수량을 setting하도록 함
      var selectedDay = new Date(selToString);

      var getToday = new Date();
      var today = getToday.getFullYear()+"-"+(getToday.getMonth()+1)+"-"+getToday.getDate();//
      // alert(today);
      var currentDay = new Date(today);
      var diff = (selectedDay.getTime() - currentDay.getTime())/1000/60/60/24;
      // alert(diff);
      var sale=0;
      diff=Math.floor(diff/7);
      // alert(diff);
      switch(diff){
        case 1:
          sale+=1000;
          break;
        case 2:
          sale+=2000;
          break;
        case 3:
          sale+=3000;
          break;
      }

      $('#salePrice').val(sale);
      $('#stockAmount').empty();
      var total = $('#hiddenamount').val();

      total = total.substr(0,total.length-1);
      var amountList = total.split(',');
      // alert(dayList[0]);
      // alert(dayList[1]);
      // alert(index);
      // alert(amountList[index]);
      for(var i=1;i<=amountList[index];i++){
        var str='$("#stockAmount").append("<option value='+i+'>'+i+'</option>")';
        // alert(str);
        eval(str);
      }
    }
  );
});
