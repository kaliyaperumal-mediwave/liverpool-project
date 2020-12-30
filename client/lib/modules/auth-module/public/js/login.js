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
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-]).{8,}$/,
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
        },

        methods: {

            submitLogin: function () {
                let formData = this.loginObject;
                this.isFormSubmitted = true
                if ((formData.email && formData.password && this.emailRegex.test(formData.email) && this.passwordRegex.test(formData.password))) {
                    console.log('payload', formData);
                    $('#loader').show();
                    var successData = apiCallPost('post', '/doLogin', formData);
                    if (Object.keys(successData)) {
                        console.log(successData);
                    } else {
                        $('#loader').hide();
                        console.log('empty response')
                    }

                } else {
                    scrollToInvalidInput();
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

        }
    })

});