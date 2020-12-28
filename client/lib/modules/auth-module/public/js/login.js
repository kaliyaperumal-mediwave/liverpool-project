//const apiUrl = "/user/eligibility"
var API_URI = "/modules/auth-module";
$(document).ready(function () {

    Vue.component('date-picker', VueBootstrapDatetimePicker);
    var _self = this;
    var app = new Vue({
        el: '#user-login',

        data: {
            loginObject: {
                email: "",
                password: ""
            },
            isFormSubmitted: false,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
        },

        mounted: function () {
        },

        methods: {
            submitLogin: function () {
                let formData = this.loginObject;
                this.isFormSubmitted = true
                if ((formData.email && formData.password && this.emailRegex.test(formData.email))) {
                    console.log('payload', formData);
                    var successData = apiCallPost('post', '/doLogin', formData);
                    if (Object.keys(successData)) {
                        console.log(successData);
                        location.href = redirectUrl(location.href, "dashboard", successData.data.sendReferralResult.loginId, "child");
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