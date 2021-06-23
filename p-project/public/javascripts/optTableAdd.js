//옵션 테이블
  $(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    var actions = $("table td:last-child").html();
    // Append table with add row form on add new button click
      $(".add-new").click(function(){
      // $(this).attr("disabled", "disabled");
      var count=$("#optCount").val();
      $("#optCount").val(count+1);
      var index = $("table tbody tr:last-child").index();
          var row = '<tr>' +
              '<td><input type="text" class="form-control" name="optName" id="optName"></td>' +
              '<td><input type="text" class="form-control" name="optVal1" id="optVal1"></td>' +
              '<td><input type="text" class="form-control" name="optVal2" id="optVal2"></td>' +
              '<td><input type="text" class="form-control" name="optVal3" id="optVal3"></td>' +
              '<td><input type="text" class="form-control" name="optVal4" id="optVal4"></td>' +
              '<td><input type="text" class="form-control" name="optVal5" id="optVal5"></td>' +
        '<td>' + actions + '</td>' +
          '</tr>';
        $("table").append(row);
      $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
          $('[data-toggle="tooltip"]').tooltip();
      });
    // Add row on add button click
    $(document).on("click", ".add", function(){
      var empty = false;
      var input = $(this).parents("tr").find('input[type="text"]');
          input.each(function(){
        if(!$(this).val()){
          $(this).addClass("error");
          empty = true;
        } else{
                  $(this).removeClass("error");
              }
      });
      $(this).parents("tr").find(".error").first().focus();
      if(!empty){
        input.each(function(){
          $(this).parent("td").html($(this).val());
        });
        $(this).parents("tr").find(".add, .edit").toggle();
        $(".add-new").removeAttr("disabled");
      }
      });
    // Edit row on edit button click
    $(document).on("click", ".edit", function(){
          $(this).parents("tr").find("td:not(:last-child)").each(function(){
        $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
      });
      $(this).parents("tr").find(".add, .edit").toggle();
      $(".add-new").attr("disabled", "disabled");
      });
    // Delete row on delete button click
    $(document).on("click", ".delete", function(){
      var count=$("#optCount").val();
      $("#optCount").val(count-1);
          $(this).parents("tr").remove();
      $(".add-new").removeAttr("disabled");
      });
  });
