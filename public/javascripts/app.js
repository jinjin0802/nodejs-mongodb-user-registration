
$(function(){

    $(".register").on('click', function(event){
        event.preventDefault();
        var fullname   = $("#fullname").val();
        var email      = $("#email").val();
        var password   = $("#password").val();
        var cpassword  = $("#cpassword").val();
        //var dob        = $("#dob").val();
        // var country    = $("#country").val();
        // var gender     = $('input[name="gender"]:checked').val(); 
        // var calorie    = $('input[name="calorie"]:checked').val(); 
        // var salt       = $('input[name="salt"]:checked').val();
        // var terms      = $('input[name="terms"]:checked').val();

        if(!fullname || !email || !password || !cpassword ){ 
            $("#msgDiv").show().html("All fields are required.");
        } else if(cpassword != password){
            $("#msgDiv").show().html("Passowrds should match.");
        } 
        else{ 
            //sending request to the database
            $.ajax({
                url: "/register",
                method: "POST",
                data: { fullname: fullname, email: email, password: password, cpassword: cpassword}
            }).done(function( data ) {

                if ( data ) {
                    if(data.status == 'error'){

                        var errors = '<ul>';
                        $.each( data.message, function( key, value ) {
                            errors = errors +'<li>'+value.msg+'</li>';
                        });

                        errors = errors+ '</ul>';
                        $("#msgDiv").html(errors).show();
                    }else{
                        $("#msgDiv").removeClass('alert-danger').addClass('alert-success').html(data.message).show(); 
                    }
                }
            });
        }
    });
});