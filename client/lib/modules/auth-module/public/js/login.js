var API_URI = "/modules/auth-module";
$(document).ready(function () {
    new Vue({
        el: '#user-login',

        data: {
            loginObject: {
                email: "",
                password: ""
            },
            isFormSubmitted: false,
            showVisibility: false,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{7,}.$/,
            tokenVariable: ''
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

            submitLogin: function () {
                var formData = this.loginObject;
                this.isFormSubmitted = true;
                if ((formData.email && formData.password && this.emailRegex.test(formData.email) && this.passwordRegex.test(formData.password))) {
                    $('#loader').show();
                    var successData = apiCallPost('post', '/doLogin', formData);
                    if (successData && Object.keys(successData)) {
                        this.tokenVariable = successData;
                        $('#loader').hide();
                        $('#logInSuccess').modal('show');
                    } else {
                        $('#loader').hide();
                    }
                } else {
                    return false;
                }
            },

            toggleVisibility: function () {
                this.showVisibility = !this.showVisibility;
                if ($('#loginPassword').attr("type") == "text") {
                    $('#loginPassword').attr('type', 'password');
                } else if ($('#loginPassword').attr("type") == "password") {
                    $('#loginPassword').attr('type', 'text');
                }
            },

            navigatePage: function (route) {
                window.location.href = window.location.origin + route;
            },

            resetForm: function () {
                this.isFormSubmitted = false;
                this.loginObject.email = '';
                this.loginObject.password = '';
            },

            gotoDashboard: function (token) {
                $('#logInSuccess').modal('hide');
                location.href = redirectUrl(location.href, "dashboard", token.data.sendUserResult.loginId, token.data.sendUserResult.role);
            }

        }
    })

});