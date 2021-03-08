
var API_URI = "/modules/referral-complete-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#completed-form',
        data: {
            ackObj: { refCode: '123' },
            refSignUpData: {
                email: '',
                role: '',
                password: '',
                confirmPassword: ''
            },
            paramValues: [],
            reference_code: '',
            loginFlag: '',
            mailId: '',
            isFormSubmitted: false,
            showVisibilityPassword: false,
            showVisibilityConfirmPassword: false,
            sendObj: {},
            showSignUpForm: false,
            isEmailRequired: false,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{7,}.$/,
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var isLoggedInUser = document.getElementById('logId').innerHTML; // hide in layout.html
            if (!isLoggedInUser) {
                this.showSignUpForm = true;
                //this.getSignUpData();
            } else {
                this.showSignUpForm = false;
            }
            this.paramValues = getParameter(location.href)
            this.loginFlag = document.getElementById('uRole').innerHTML; // hide in layout.html
            this.getRefNo();
        },

        methods: {

            getSignUpData: function () {
                var successData = apiCallGet('get', '/your api call', API_URI);
                if (successData && Object.keys(successData)) {
                    Vue.set(this.refSignUpData, "role", successData.data.role);
                    if (successData.data.email) {
                        Vue.set(this.refSignUpData, "email", successData.data.email);
                        document.getElementById('refEmail').setAttribute('readonly', true);
                        this.isEmailRequired = true;
                    } else {
                        document.getElementById('refEmail').setAttribute('readonly', false);
                        this.isEmailRequired = false;
                    }
                    $('#loader').hide();
                } else {
                    $('#loader').hide();
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

            getRefNo: function () {
                var _self = this;
                $.ajax({
                    url: API_URI + "/getRefNo/" + document.getElementById('uUid').innerHTML,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        _self.reference_code = data.reference_code;
                        _self.sendObj.ref_code = data.reference_code;
                        console.log("logi flag ", _self.loginFlag)
                        _self.sendMail(_self.sendObj);
                        $('#loader').hide();
                    },
                    error: function (error) {
                        console.log('Something went Wrong', error);
                        $('#loader').hide();
                        showError(error.responseJSON.message, error.status);
                    }
                });
            },

            noLoginSignUp: function () {
                console.log('clicked');
                let formData = this.refSignUpData;
                this.isFormSubmitted = true;
                if (this.isEmailRequired) {
                    if ((formData.password && this.passwordRegex.test(formData.password) && formData.confirmPassword && this.passwordRegex.test(formData.confirmPassword) && (formData.password === formData.confirm_password))) {
                        $('#loader').show();
                        var successData = apiCallPost('post', '/doCreateAcc', formData);
                        if (successData && Object.keys(successData)) {
                            this.tokenVariable = successData;
                            $('#loader').hide();
                            $('#signInSuccess').modal('show');

                        } else {
                            $('#loader').hide();
                        }
                    } else {
                        scrollToInvalidInput();
                        return false;
                    }
                } else {
                    if ((formData.email && this.emailRegex.test(formData.email) && formData.password && this.passwordRegex.test(formData.password) && formData.confirmPassword && this.passwordRegex.test(formData.confirmPassword) && (formData.password === formData.confirm_password))) {
                        $('#loader').show();
                        var successData = apiCallPost('post', '/doCreateAcc', formData);
                        if (successData && Object.keys(successData)) {
                            this.tokenVariable = successData;
                            $('#loader').hide();
                            $('#signInSuccess').modal('show');

                        } else {
                            $('#loader').hide();
                        }
                    } else {
                        scrollToInvalidInput();
                        return false;
                    }
                }

            },

            sendMail: function (payLoadObj) {
                var _self = this;
                $.ajax({
                    url: API_URI + "/sendConfirmationMail",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(payLoadObj),
                    success: function (data) {
                        console.log("EmailSent")
                    },
                    error: function (error) {
                        console.log('Something went Wrong', error);
                        showError(error.responseJSON.message, error.status);
                    }
                });
            },
        }
    })
});