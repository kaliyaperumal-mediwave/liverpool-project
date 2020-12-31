var API_URI = "/modules/auth-module";
$(document).ready(function () {
    // Vue.use(VueToast);
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
            samePass: true
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);

            // Vue.$toast.open({
            //     message: 'Something went wrong!',
            //     type: 'success',
            //     position: 'top-right'
            //     // all of other options may go here
            // });

        },

        methods: {

            submitSignIn: function () {
                let formData = this.signUpObject;
                this.isFormSubmitted = true
                if ((formData.first_name && formData.last_name && formData.password && this.passwordRegex.test(formData.password) && formData.confirm_password && this.passwordRegex.test(formData.confirm_password) && formData.email && this.emailRegex.test(formData.email) && (formData.password === formData.confirm_password) && formData.role)) {
                    console.log('payload', formData);
                    $('#loader').show();
                    var successData = apiCallPost('post', '/doCreateAcc', formData);
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

            toggleVisibility: function (elem, toggleFlag) {
                this[toggleFlag] = !this[toggleFlag];
                if ($(elem).attr("type") == "text") {
                    $(elem).attr('type', 'password');
                } else if ($(elem).attr("type") == "password") {
                    $(elem).attr('type', 'text');
                }
            },

        }
    })

});