var API_URI = "/modules/auth-module";
$(document).ready(function () {

    new Vue({
        el: '#user_sign_up',

        data: {
            signUpObject: {
                first_name: "",
                last_name: "",
                password: "",
                confirm_password: "",
                email: "",
                role: ""
            },
            isFormSubmitted: false,
            showVisibilityPassword: false,
            showVisibilityConfirmPassword: false,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{7,}.$/,
            samePass: true,
            loginPath: '/users/login',
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

            submitSignIn: function () {
                let formData = this.signUpObject;
                this.isFormSubmitted = true;
                if ((formData.first_name && formData.last_name && formData.password && this.passwordRegex.test(formData.password) && formData.confirm_password && this.passwordRegex.test(formData.confirm_password) && formData.email && this.emailRegex.test(formData.email) && (formData.password === formData.confirm_password) && formData.role)) {
                    $('#loader').show();
                    var successData = apiCallPost('post', '/doCreateAcc', formData);
                    if (successData && Object.keys(successData)) {
                        this.tokenVariable = successData;
                        $('#loader').hide();
                        $('#signInSuccess').modal('show');

                    } else {
                        $('#loader').hide();
                        showError(successData);
                    }
                } else {
                    scrollToInvalidInput();
                    return false;
                }
            },

            //Function to trim space entered
            trimWhiteSpace: function (event, obj, key) {
                preventWhiteSpaces(event, this, obj, key)
            },

            //Function to toggle password's show,hide icon
            toggleVisibility: function (elem, visibility) {
                commonToggleVisibility(this, elem, visibility);
            },

            resetForm: function () {
                this.isFormSubmitted = false;
                this.signUpObject.first_name = '';
                this.signUpObject.last_name = '';
                this.signUpObject.password = '';
                this.signUpObject.confirm_password = '';
                this.signUpObject.role = '';
            },

            gotoDashboard: function (token) {
                $('#signInSuccess').modal('hide');
                location.href = "/dashboard";
            }

        }
    })

});