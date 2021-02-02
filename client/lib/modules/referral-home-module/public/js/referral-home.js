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
                //console.log("32323232")
                $.ajax({
                    url: API_URI + "/setSessionRefHome/y",
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
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