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
            var isLoggedInUser = $('#loginUserFlag').text();
            if (isLoggedInUser == 'false') {
                $('#8b91a47a-018a-4916-8804-0c2b197fdaa1').removeClass().addClass('py-2 d-block');
                $('#fcf6cdd9-aded-48ad-8476-406d46f3f007').removeClass().addClass('option-font px-3 text-left m-0 d-block');;
            }
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
                        //location.href = "/young-referral";
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