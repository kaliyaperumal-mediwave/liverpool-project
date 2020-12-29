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
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-]).{8,}$/,
        },

        mounted: function () {
        },

        methods: {
            submitLogin: function () {
                let formData = this.loginObject;
                this.isFormSubmitted = true
                if ((formData.email && formData.password && this.emailRegex.test(formData.email) && this.passwordRegex.test(formData.password))) {
                    console.log('payload', formData);
                    var successData = apiCallPost('post', '/doLogin', formData);
                    if (Object.keys(successData)) {
                        console.log(successData);
                    } else {
                        console.log('empty response')
                    }

                } else {
                    scrollToInvalidInput();
                    return false;
                }
            },

        }
    })

});