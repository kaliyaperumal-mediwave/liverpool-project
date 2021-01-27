var API_URI = "/modules/auth-module";
$(document).ready(function () {
    new Vue({
        el: '#resetPassword',

        data: {
            resetPasswordData: {
                new_password: "",
                confirm_password: "",
            },
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
            setTimeout(function () {
                _self.resetForm();
                $('#loader').hide();
            }, 700);
        },

        methods: {

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
            }

        }
    })

});