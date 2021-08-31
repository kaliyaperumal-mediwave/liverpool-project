var API_URI = "/modules/admin-module";
$(document).ready(function () {
    new Vue({
        el: '#changePassword',
        data: {
            passwordTointegrate: '',
            integrationData: '',
            visibleOldPassword: false,
            visibleNewPassword: false,
            isFormSubmitted: false,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{7,}.$/
        },

        beforeMount: function () {
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
                formData.password = this.passwordTointegrate;
                this.isFormSubmitted = true;
                console.log(formData)
                if (formData.password) {
                    // console.log('payload', formData);
                    $('#loader').show();
                    var successData = apiCallPost('post', '/validateIntegration', formData);
                    console.log(successData)
                    if (successData.statusCode == 200) {
                        console.log("password matched")
                        $('#loader').hide();
                    }
                    else {
                        console.log("password not matched")
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
                let result = apiCallGet('get', '/getApiService', API_URI);
                this.integrationData = (result.data.flagValue === 'true');
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
                this.passwordTointegrate = '';
            },

            gotoLogin: function () {
                $('#changePasswordSuccess').modal('hide');
                logOut();
            }

        }
    })

});