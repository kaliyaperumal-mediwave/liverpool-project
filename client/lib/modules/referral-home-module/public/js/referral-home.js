var API_URI = "/modules/referral-home-module";
$(document).ready(function () {
    new Vue({
        el: '#referralHomePage',
        data: {
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            console.log(document.getElementById('sessionExp').innerHTML)
            if(document.getElementById('sessionExp').innerHTML)
            {
                $('#loader').hide();
               // document.getElementById(sessionExp).innerHTML="false";
                showError("Searcn Expired", 401);
                return;
            }
            else
            {
                setTimeout(function () {
                    $('#loader').hide();
                }, 1000);
            }
        },

        methods: {
            goToRole: function () {
                $.ajax({
                    url: API_URI + "/setSessionRefHome/y",
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                        console.log("-------------------------------success block");
                        location.href = "/role";
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            }
        }

    })

})