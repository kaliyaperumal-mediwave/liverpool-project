var API_URI = "/modules/account-settings-module";
$(document).ready(function () {
    new Vue({
        el: '#confirmationEmail',
        data: {
            message: '',
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var formData = {};
            $('#loader').show();
            formData.token = getQueryStringValue("token");
            if (!formData.token) {
                return;
            }
            var successData = apiCallPost('post', '/resetEmail', formData);
            if (successData && Object.keys(successData)) {
                console.log(successData, "successData");
                $('#loader').hide();
                this.message = successData.message;

            } else {
                $('#loader').hide();
            }
        },

        methods: {

            logOut: function () {
                window.location.href = window.location.origin + '/users/login';
                //window.location.href = "/logout";
            }

        }
    })

});