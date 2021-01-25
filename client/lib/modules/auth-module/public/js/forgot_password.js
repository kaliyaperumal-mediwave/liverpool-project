var API_URI = "/modules/auth-module";
$(document).ready(function () {
    if (false || !!document.documentMode) {
        // 
    }
    else {
        // Vue.use(VueToast);
    }
    new Vue({
        el: '#forgotPassword',

        data: {
            forgetPasswordData: {
                email: "",
            },
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
                    console.log('payload', formData);
                    $('#loader').show();
                    var successData = apiCallPost('post', '/forgotPassword', formData);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        this.resetForm();
                        $('#forgotPasswordSuccess').modal('show');
                        setTimeout(function () {
                            $('#forgotPasswordSuccess').modal('hide');
                        }, 1000)

                    } else {
                        $('#loader').hide();
                    }

                } else {
                    return false;
                }
            },

            // navigatePage: function (route) {
            //     window.location.href = window.location.origin + route;
            // },

            resetForm: function () {
                this.isFormSubmitted = false;
                this.forgetPasswordData.email = '';
            }

        }
    })

});