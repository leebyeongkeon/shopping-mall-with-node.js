$(document).ready(function(){
	$('[data-toggle="tooltip"]').tooltip();

  var pageNation='';
	var listcount = $("#hiddenListCount").val();

	var currentPage=$("#currentView").val();
	// var current = Math.floor(listcount/16);
  if(listcount>16){
    for(var p=0;p<=listcount/16;){
      p++;
			if(currentPage==p){
				pageNation+='<li class="page-item active" aria-current="page">'
	                      +'<form method="post" action="/product/all">'
	                          +'<input type="hidden" name="hiddenCurrent" value="'+p+'"/>'
	                          +'<input type="submit" class="page-link" value="'+p+'" style="background: #EF9F5B; border-color: #EF9F5B;"/>'
	                      +'</form>'
	                  +'</li>';
			}
			else{
					pageNation+='<li class="page-item active" aria-current="page">'
	                      +'<form method="post" action="/product/all">'
	                          +'<input type="hidden" name="hiddenCurrent" value="'+p+'"/>'
	                          +'<input type="submit" class="page-link" value="'+p+'" style="background: #FFFFFF; color: #000000; border-color: #dcdcdc;"/>'
	                      +'</form>'
	                   +'</li>';
	    }
		}
  }
	if(listcount<6){
			pageNation+='<li class="page-item"><a class="page-link" href="#">Next</a></li>';
	}

	else {
		pageNation+='<li class="page-item disabled">'
      				 +'<a class="page-link" href="#" tabindex="-1" aria-disabled="true">Next</a>'
    			 		 +'</li>';
	}
  $('#mypgnation').append(pageNation);
  // $('.pagination .page-item').click(function(){
  //   var getValue=$('.pagination .page-item').val();
  //   alert(this.tabinex);
  // });
});
