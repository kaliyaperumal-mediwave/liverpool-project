var API_URI = "/modules/auth-module";
$(document).ready(function () {
    new Vue({
        el: '#forgotPassword',

        data: {
            forgetPasswordData: {
                email: "",
            },
            responseMessage: "You will recieve a mail if you are registered at Liverpool CAMHS.",
            isFormSubmitted: false,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var _self = this;
            setTimeout(function () {
                _self.resetForm();
                $('#loader').hide();
            }, 700);
        },

        methods: {

            sendForgotPassword: function () {
                var formData = this.forgetPasswordData;
                this.isFormSubmitted = true;
                if (formData.email && this.emailRegex.test(formData.email)) {
                    $('#loader').show();
                    var successData = apiCallPost('post', '/forgotPassword', formData);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        this.resetForm();
                        this.responseMessage = successData.message;
                        $('#forgotPasswordSuccess').modal('show');
                        setTimeout(function () {
                            $('#forgotPasswordSuccess').modal('hide');
                        }, 2000)

                    } else {
                        $('#loader').hide();
                    }

                } else {
                    return false;
                }
            },

            mailSubmit: function (e) {
                if (e) {
                    e.preventDefault();
                }
            },

            resetForm: function () {
                this.isFormSubmitted = false;
                this.forgetPasswordData.email = '';
            }

        }
    })

});