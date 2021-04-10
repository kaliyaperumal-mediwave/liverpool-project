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
            this.resetForm();
            $('#loader').show();
        },

        mounted: function () {
            //console.log(document.getElementById('sessionExp').innerHTML)
            var loginButton = document.getElementById('secondary');
            loginButton.removeAttribute('disabled');
            loginButton.style.opacity = 1;
            if (document.getElementById('sessionExp').innerHTML == "true") {
                $.ajax({
                    url: API_URI + "/setSessionExpFalse/false",
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                        showError('Session expired');
                    },
                    error: function (error) {
                       // console.log(error)
                        showError(error.responseJSON.message, error.status);
                    }
                })
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
                document.getElementById('secondary').setAttribute('disabled', true);
                document.getElementById('secondary').style.opacity = 0.5;
                var formData = this.loginObject;
                this.isFormSubmitted = true;
                if ((formData.email && formData.password && this.emailRegex.test(formData.email) && this.passwordRegex.test(formData.password))) {
                    $('#loader').show();
                    var successData = apiCallPost('post', '/doLogin', formData);

                    if (successData && Object.keys(successData)) {
                        // this.resetForm(this, "loginObject");
                        this.tokenVariable = successData;
                        $('#loader').hide();
                        if(successData.data.sendUserResult.role === 'admin' || successData.data.sendUserResult.role === 'service_admin') { 
                            localStorage.setItem('theme', 'light');
                            if(successData.data.sendUserResult.role === 'admin'){
                                location.href = "/admin";
                            } else {
                                location.href = "/admin/serviceAdmin";
                            }
                            return false; 
                        }
                        if(successData.data.sendUserResult.role === 'service_admin') { 
                            localStorage.setItem('theme', 'light');
                            console.log('Logging in as admin...........'); 
                            location.href = "/admin";
                             return false; 
                        }
                        location.href = "/dashboard";
                        // $('#logInSuccess').modal('show');
                    } else {
                        document.getElementById('secondary').style.opacity = 1;
                        document.getElementById('secondary').removeAttribute('disabled');
                        $('#loader').hide();
                    }
                } else {
                    document.getElementById('secondary').style.opacity = 1;
                    document.getElementById('secondary').removeAttribute('disabled');
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

            // gotoDashboard: function (token) {
            //     $('#logInSuccess').modal('hide');
            //     location.href = "/dashboard";
            // }

        }
    })

});