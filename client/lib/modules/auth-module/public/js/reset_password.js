var API_URI = "/modules/auth-module";
$(document).ready(function () {
    new Vue({
        el: '#resetPassword',

        data: {
            resetPasswordData: {
                new_password: "",
                confirm_password: "",
            },
            message: "",
            responseMessage: "",
            visibleNewPassword: false,
            visibleConfirmPassword: false,
            isFormSubmitted: false,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{7,}.$/
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var _self = this;
            this.verifyToken();
            setTimeout(function () {
                _self.resetForm();
                // $('#loader').hide();
            }, 700);
        },

        methods: {

            verifyToken: function() {
                const token = getQueryStringValue("token");
                if(token) {
                    var successData = apiCallGet('get', '/resetPassword/verifyToken?token=' + token, API_URI);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        if(!successData.data && successData.message) {
                            this.message = successData.message;
                        }
                    } else {
                        $('#loader').hide();
                    }
                } else {
                    $('#loader').hide();
                }
            },

            resetPassword: function () {
                var formData = this.resetPasswordData;
                this.isFormSubmitted = true;
                if ((formData.new_password && this.passwordRegex.test(formData.new_password)) && (formData.confirm_password && this.passwordRegex.test(formData.confirm_password)) && (formData.new_password === formData.confirm_password)) {
                    console.log('payload', formData);
                    formData.token = getQueryStringValue("token");
                    console.log('payload', formData);
                    $('#loader').show();
                    var successData = apiCallPost('post', '/resetPassword', formData);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        this.responseMessage = successData.message;
                        $('#resetPasswordSuccess').modal('show');

                    } else {
                        $('#loader').hide();
                    }
                } else {
                    return false;
                }
            },

            toggleVisibility: function (elem, toggleFlag) {
                this[toggleFlag] = !this[toggleFlag];
                if ($(elem).attr("type") == "text") {
                    $(elem).attr('type', 'password');
                } else if ($(elem).attr("type") == "password") {
                    $(elem).attr('type', 'text');
                }
            },

            resetForm: function () {
                this.isFormSubmitted = false;
                this.resetPasswordData.new_password = '';
                this.resetPasswordData.confirm_password = '';
            },

            gotoLogin: function () {
                $('#resetPasswordSuccess').modal('hide');
                this.resetForm();
                window.location.href = window.location.origin + '/users/login';
            },

            logOut: function () {
                window.location.href = "/logout";
            }

        }
    })

});