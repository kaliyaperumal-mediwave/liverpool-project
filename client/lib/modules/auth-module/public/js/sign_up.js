var API_URI = "/modules/auth-module";
$(document).ready(function () {
    Vue.use(VueToast);
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
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-]).{8,}$/,
            samePass: true,
            loginPath: '/users/login'
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
                this.isFormSubmitted = true
                if ((formData.first_name && formData.last_name && formData.password && this.passwordRegex.test(formData.password) && formData.confirm_password && this.passwordRegex.test(formData.confirm_password) && formData.email && this.emailRegex.test(formData.email) && (formData.password === formData.confirm_password) && formData.role)) {
                    $('#loader').show();
                    var successData = apiCallPost('post', '/doCreateAcc', formData);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        Vue.$toast.success('Account created.', {
                            position: 'top',
                            duration: 1000,
                            onDismiss: function () {
                                window.location.href = window.location.origin + '/users/login';
                            }
                        });

                    } else {
                        $('#loader').hide();
                    }
                } else {
                    scrollToInvalidInput();
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
                this.signUpObject.first_name = '';
                this.signUpObject.last_name = '';
                this.signUpObject.password = '';
                this.signUpObject.confirm_password = '';
                this.signUpObject.role = '';
            }


        }
    })

});