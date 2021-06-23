
      var prodImg;
      $(document).ready(function(){

        $("#productImg").on("change",handleImgFileSelect);
        $("#product_detail").on("change",handleImgFileSelect2);
        $("#shopImg").on("change",handleImgFileSelect3);

        $("#update_productImg").on("change",handleImgFileSelect4);
        $("#update_product_detail").on("change",handleImgFileSelect5);
        $("#shop_product").on("change",handleImgFileSelect6);
        $("#shop_detail").on("change",handleImgFileSelect7);
      });
      function handleImgFileSelect(e){
        // $("#imgFlag").val("1");
        var files=e.target.files;
        var fileArr=Array.prototype.slice.call(files);
        fileArr.forEach(function(f){
          if(!f.type.match("image.*")){
            alert("이미지 형식이 안맞음");
            return;
          }
          prodImg=f;
          var reader=new FileReader();
          reader.onload=function(e){
              $("#productImage").attr("src",e.target.result);
          }
          reader.readAsDataURL(f);
        });
      }
      function handleImgFileSelect2(e){
          // $("#imgFlag").val("1");
        var files=e.target.files;
        var fileArr=Array.prototype.slice.call(files);
        fileArr.forEach(function(f){
          if(!f.type.match("image.*")){
            alert("이미지 형식이 안맞음");
            return;
          }
          prodImg=f;
          var reader=new FileReader();
          reader.onload=function(e){
              $("#detailImage").attr("src",e.target.result);
          }
          reader.readAsDataURL(f);
        });
      }
      function handleImgFileSelect3(e){
        $("#imgFlag").val("1");
        var files=e.target.files;
        var fileArr=Array.prototype.slice.call(files);
        fileArr.forEach(function(f){
          if(!f.type.match("image.*")){
            alert("이미지 형식이 안맞음");
            return;
          }
          prodImg=f;
          var reader=new FileReader();
          reader.onload=function(e){
              $("#shopImgView").attr("src",e.target.result);
          }
          reader.readAsDataURL(f);
        });
      }
      function handleImgFileSelect4(e){
        $("#imgFlag").val("1");
        var files=e.target.files;
        var fileArr=Array.prototype.slice.call(files);
        fileArr.forEach(function(f){
          if(!f.type.match("image.*")){
            alert("이미지 형식이 안맞음");
            return;
          }
          prodImg=f;
          var reader=new FileReader();
          reader.onload=function(e){
              $("#productImage").attr("src",e.target.result);
          }
          reader.readAsDataURL(f);
        });
      }
      function handleImgFileSelect5(e){
          $("#imgFlag").val("1");
        var files=e.target.files;
        var fileArr=Array.prototype.slice.call(files);
        fileArr.forEach(function(f){
          if(!f.type.match("image.*")){
            alert("이미지 형식이 안맞음");
            return;
          }
          prodImg=f;
          var reader=new FileReader();
          reader.onload=function(e){
              $("#detailImage").attr("src",e.target.result);
          }
          reader.readAsDataURL(f);
        });
      }
      function handleImgFileSelect6(e){
          $("#imgFlag").val("1");
      }
      function handleImgFileSelect7(e){
          $("#imgFlag").val("1");
      }
