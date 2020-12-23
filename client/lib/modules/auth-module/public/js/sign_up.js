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
                password: "",
                confirm_password:"",
                email:""
            },
            isFormSubmitted: false,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            samePass:true
        },

        mounted: function () {

        },

        methods: {
            submitSignIn: function () {
                let formData = this.signUpObject;
                this.isFormSubmitted = true
                
                if ((formData.first_name && formData.last_name && formData.password&&formData.confirm_password&&formData.email&&this.emailRegex.test(formData.email)&&(formData.password===formData.confirm_password))) {
                    console.log('payload', formData);
<<<<<<< HEAD
                    var successData = apiCallPost('post', '/doCreateAcc', formData);
                    if (Object.keys(successData)) {
                        console.log(successData);
                    } else {
                        console.log('empty response')
                    }

=======
                        var successData = apiCallPost('post', '/fetchProfession', formData);
                        if (Object.keys(successData)) {
                            console.log(successData);
                        } else {
                            console.log('empty response')
                        }
>>>>>>> origin/sprint3/fe
                } else {
                    scrollToInvalidInput();
                    return false;
                }
            },

        }
    })

});