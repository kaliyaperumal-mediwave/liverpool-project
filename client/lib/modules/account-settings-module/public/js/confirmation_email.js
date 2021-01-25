var API_URI = "/modules/account-settings-module";
$(document).ready(function () {
    new Vue({
        el: '#confirmationEmail',
        data: {

        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var formData = [];
            // var _self = this;
            // setTimeout(function () {
            //     $('#loader').hide();
            // }, 700);
            $('#loader').show();
            formData.token = getQueryStringValue("token");
            console.log(formData.token, formData.token);
            if (!formData.token) {
                // show error block
                return;
            }
            console.log(formData);
            var successData = apiCallPost('post', '/resetEmail', formData);
            if (successData && Object.keys(successData)) {
                console.log(successData, "successData");
                $('#loader').hide();
                if (false || !!document.documentMode) {
                    // show success block
                    alert(successData.message);
                } else {
                    // show success block
                    alert(successData.message);
                }

            } else {
                // show error block

                $('#loader').hide();
            }
        },

        methods: {

            navigatePage: function (route) {
                window.location.href = window.location.origin + route;
            },

        }
    })

});