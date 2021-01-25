var API_URI = "/modules/account-settings-module";
$(document).ready(function () {
    new Vue({
        el: '#changePassword',
        data: {
            changePasswordData: {
                oldPassword: "",
                newPassword: "",
            },
            visibleOldPassword: false,
            visibleNewPassword: false,
            isFormSubmitted: false,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{7,}.$/
        },

        beforeMount: function () {
            // $('#loader').show();
        },

        mounted: function () {
            var _self = this;
            // setTimeout(function () {
            //     _self.resetForm();
            //     $('#loader').hide();
            // }, 700);
        },

        methods: {

            changePassword: function () {
                var formData = this.changePasswordData;
                this.isFormSubmitted = true;
                if ((formData.oldPassword && this.passwordRegex.test(formData.oldPassword)) && (formData.newPassword && this.passwordRegex.test(formData.newPassword))) {
                    console.log('payload', formData);
                    $('#loader').show();
                    var successData = apiCallPost('post', '/changePassword', formData);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        if (successData && Object.keys(successData)) {
                            $('#loader').removeClass('d-block').addClass('d-none');
                            $('#changePasswordSuccess').modal('show');

                        } else {
                            $('#loader').removeClass('d-block').addClass('d-none');
                        }

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
                this.changePasswordData.oldPassword = '';
                this.changePasswordData.newPassword = '';
            },

            gotoDashboard: function (token) {
                $('#changePasswordSuccess').modal('hide');
                location.href = "/dashboard";
            }

        }
    })

});