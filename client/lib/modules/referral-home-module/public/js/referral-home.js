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
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
        },

        methods: {
          
            goToRole: function () {
                var _self = this;
                $.ajax({
                    url: API_URI + "/setSessionRefHome/y",
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                        //console.log("-------------------------------success block");
                       location.href = "/role";
                      // window.top.location= "/role";
                       // parent.location.href = "/role";
                       if (window != window.top) { 
                        // the page is inside an iframe
                       // window.location.href = "/role"
                    }
                    },
                    error: function (error) {
                        //console.log(error)
                        showError(error.responseJSON.message, error.status);
                    }
                })
            }
        }

    })

})