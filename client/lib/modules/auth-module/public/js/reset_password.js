// var API_URI = "/modules/auth-module";
$(document).ready(function () {
    new Vue({
        el: '#resetPassword',

        data: {
            resetPasswordData: {
                newPassword: "",
                confirmPassword: "",
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
                if ((formData.newPassword && this.passwordRegex.test(formData.newPassword)) && (formData.confirmPassword && this.passwordRegex.test(formData.confirmPassword))) {
                    console.log('payload', formData);

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
                this.resetPasswordData.newPassword = '';
                this.resetPasswordData.confirmPassword = '';
            }

        }
    })

});