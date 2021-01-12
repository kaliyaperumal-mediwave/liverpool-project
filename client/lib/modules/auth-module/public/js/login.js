var API_URI = "/modules/auth-module";
$(document).ready(function () {
    if (false || !!document.documentMode) {
        // 
    }
    else {
        Vue.use(VueToast);
    }
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
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{8,}.$/
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
                formData.password = formData.password.trim();
                if ((formData.email && formData.password && this.emailRegex.test(formData.email) && this.passwordRegex.test(formData.password))) {
                    $('#loader').show();
                    var successData = apiCallPost('post', '/doLogin', formData);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        if (false || !!document.documentMode) {
                            alert("Login successful.")
                            location.href = redirectUrl(location.href, "dashboard", successData.data.sendUserResult.loginId, successData.data.sendUserResult.role);
                        } else {
                            Vue.$toast.success('Login successful.', {
                                position: 'top',
                                duration: 1000,
                                onDismiss: function () {
                                    location.href = redirectUrl(location.href, "dashboard", successData.data.sendUserResult.loginId, successData.data.sendUserResult.role);
                                }
                            });
                        }

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
            }

        }
    })

});