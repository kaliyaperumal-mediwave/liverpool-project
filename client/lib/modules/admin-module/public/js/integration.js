var API_URI = "/modules/admin-module";
$(document).ready(function () {
    new Vue({
        el: '#changePassword',
        data: {
            passwordToIntegrate: '',
            integrationData: '',
            visibleIntPassword: false,
            visibleNewPassword: false,
            isFormSubmitted: false,
            responseText: '',
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{7,}.$/
        },

        beforeMount: function () {
            debugger
            document.getElementById('hideBurgerMenu').style.visibility = 'hidden';
            $('#loader').show();
        },

        mounted: function () {
            var _self = this;
            this.getToggleValue();
            setTimeout(function () {
                _self.resetForm();
                $('#loader').hide();
            }, 700);
        },

        methods: {

            validatePassword: function () {
                console.log("btn clickec")
                var formData = {};
                var integrationElem = document.getElementById('toggleIntDisable');
                formData.password = this.passwordToIntegrate;
                this.isFormSubmitted = true;
                console.log(formData)
                if (formData.password) {
                    // console.log('payload', formData);
                    $('#loader').show();
                    var successData = apiCallPost('post', '/validateIntegration', formData);
                    console.log(successData)
                    if (successData.statusCode == 200) {
                        this.isFormSubmitted = false;
                        console.log("password matched")
                        this.responseText = "Password matched";
                        integrationElem.style.opacity = 1;
                        integrationElem.style.pointerEvents = 'auto';
                        $('#integrationPasswordSucess').modal('show')
                        $('#loader').hide();
                    }
                    else {
                        this.isFormSubmitted = false;
                        console.log("password not matched")
                        this.responseText = "Password not matched";
                        integrationElem.style.opacity = 0.7;
                        integrationElem.style.pointerEvents = 'none';
                        $('#integrationPasswordSucess').modal('show');
                        $('#loader').hide();
                    }
                } else {
                    return false;
                }
            },

            setIntegration: function (e) {
                console.log(e.target.checked)
                var postData = {};
                postData.updateValue = e.target.checked;
                if (e.target.checked) {
                    var successData = apiCallPut('put', '/updateApiValue', postData);
                    //localStorage.setItem('integration', 'true');
                }
                else {
                    var successData = apiCallPut('put', '/updateApiValue', postData);
                }
            },


            getToggleValue: function (e) {
                var integrationElem = document.getElementById('toggleIntDisable');
                let result = apiCallGet('get', '/getApiService', API_URI);
                if (result.data.flagValue === 'true') {
                    integrationElem.style.opacity = 1;
                    integrationElem.style.pointerEvents = 'auto'
                    this.integrationData = (result.data.flagValue === 'true');
                } else {
                    integrationElem.style.opacity = 0.7;
                    integrationElem.style.pointerEvents = 'none'
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
                this.passwordToIntegrate = '';
            },

            gotoLogin: function () {
                $('#changePasswordSuccess').modal('hide');
                logOut();
            }

        }
    })

});