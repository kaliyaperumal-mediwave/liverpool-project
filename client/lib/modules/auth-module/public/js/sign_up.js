//const apiUrl = "/user/eligibility"
var API_URI = "/modules/auth-module";
$(document).ready(function () {

    Vue.component('date-picker', VueBootstrapDatetimePicker);
    var _self = this;
    var app = new Vue({
        el: '#user_sign_up',

        data: {
            signUpObject: {
                first_name: "",
                last_name: "",
                password: ""
            },
            isFormSubmitted: false,
        },

        mounted: function () {

        },

        methods: {
            submitSignIn: function () {
                let formData = this.signUpObject;
                this.isFormSubmitted = true
                if ((formData.first_name && formData.last_name && formData.password)) {
                    console.log('payload', formData);
                    var successData = apiCallPost('post', '/fetchProfession', formData);
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