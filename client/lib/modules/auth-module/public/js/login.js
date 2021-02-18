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
            console.log(document.getElementById('sessionExp').innerHTML)
            if(document.getElementById('sessionExp').innerHTML=="true")
            {
                showError('Session expired');
            }
            var _self = this;
            setTimeout(function () {
                // _self.resetForm(_self, "loginObject");
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
                        // this.resetForm(this, "loginObject");
                        this.resetForm();
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

            //Function to trim space entered
            trimWhiteSpace: function (event, obj, key) {
                preventWhiteSpaces(event, this, obj, key)
            },

            //Function to toggle password's show,hide icon
            toggleVisibility: function (elem, visibility) {
                commonToggleVisibility(this, elem, visibility);
            },

            navigatePage: function (route) {
                window.location.href = window.location.origin + route;
            },

            //Function to reset form
            resetForm: function () {
                //dynamicFormReset(context, obj);
                this.isFormSubmitted = false;
                this.loginObject.email = '';
                this.loginObject.password = '';
            },

            gotoDashboard: function (token) {
                $('#logInSuccess').modal('hide');
                location.href = "/dashboard";
            }

        }
    })

});