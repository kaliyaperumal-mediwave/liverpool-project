
var API_URI = "/modules/referral-complete-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#completed-form',
        data: {
            ackObj: { refCode: '123' },
            refSignUpData: {
                first_name: '',
                last_name: '',
                email: '',
                role: '',
                password: '',
                confirm_password: '',
                reference_code: '',
            },
            paramValues: [],
            reference_code: '',
            loginFlag: '',
            mailId: '',
            isFormSubmitted: false,
            showVisibilityPassword: false,
            showVisibilityConfirmPassword: false,
            sendObj: {},
            showSignUpForm: true,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{7,}.$/,
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.loginFlag = document.getElementById('uRole').innerHTML; // hide in layout.html
            this.getRefNo();
        },

        methods: {

            getSignUpData: function () {
                var isLoggedInUser = document.getElementById('loginUserFlag').innerHTML; // hide in layout.html
                if (isLoggedInUser == 'false') {
                    this.showSignUpForm = true;
                    var successData = apiCallGet('get', '/getReferalByCode/' + this.reference_code, API_URI);
                    if (successData && successData.length) {
                        Vue.set(this.refSignUpData, "role", successData[0].user_role);
                        Vue.set(this.refSignUpData, "email", successData[0][this.refSignUpData.role + '_email']);
                        Vue.set(this.refSignUpData, "first_name", successData[0][this.refSignUpData.role + '_firstname']);
                        Vue.set(this.refSignUpData, "last_name", successData[0][this.refSignUpData.role + '_lastname']);
                        // if (successData[0][this.refSignUpData.role + '_email']) {
                        //     this.isEmailRequired = true;
                        // } else {
                        //     this.isEmailRequired = false;
                        // }
                        $('#loader').hide();
                    } else {
                        $('#loader').hide();
                    }
                } else {
                    this.showSignUpForm = false;
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
                        _self.getSignUpData();
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
                let formData = this.refSignUpData;
                this.isFormSubmitted = true;
                if ((formData.email && this.emailRegex.test(formData.email)) && formData.password && this.passwordRegex.test(formData.password) && formData.confirm_password && this.passwordRegex.test(formData.confirm_password) && (formData.password === formData.confirm_password)) {
                    $('#loader').show();
                    formData.reference_code = this.reference_code;
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
            },

            // sendMail: function (payLoadObj) {
            //     var _self = this;
            //     $.ajax({
            //         url: API_URI + "/sendConfirmationMail",
            //         type: 'post',
            //         dataType: 'json',
            //         contentType: 'application/json',
            //         data: JSON.stringify(payLoadObj),
            //         success: function (data) {
            //             console.log("EmailSent")
            //         },
            //         error: function (error) {
            //             console.log('Something went Wrong', error);
            //             showError(error.responseJSON.message, error.status);
            //         }
            //     });
            // },

            gotoDashboard: function (token) {
                $('#signInSuccess').modal('hide');
                location.href = "/dashboard";
            }
        }
    })
});