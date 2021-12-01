
var API_URI = "/modules/referral-complete-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#completed-form',
        data: {
            ackObj: { refCode: '123', role: '', professional_email: '', refPdfCode: "", referralCode: "" },
            refSignUpData: {
                first_name: '',
                last_name: '',
                email: '',
                role: '',
                password: '',
                confirm_password: '',
                reference_code: '',
            },
            refFeedbackData: {
                comments: '',
                ratings: '',
            },
            feedbackMessage: '',
            paramValues: [],
            reference_code: '',
            loginFlag: '',
            mailId: '',
            isFeedBackFormSubmitted: false,
            isFormSubmitted: false,
            showVisibilityPassword: false,
            showVisibilityConfirmPassword: false,
            sendObj: {},
            showSignUpForm: true,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&?*-])\S{7,}.$/,
            recResList:[]
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.loginFlag = document.getElementById('loginUserFlag').innerHTML; // hide in layout.html
            //this.resetForm();
            this.getRefNo();
        },

        methods: {

            getSignUpData: function () {
                var isLoggedInUser = document.getElementById('loginUserFlag').innerHTML; // hide in layout.html
                if (isLoggedInUser == 'false') {
                    this.showSignUpForm = true;
                    var successData = apiCallGet('get', '/getReferalByCode/' + this.reference_code, API_URI);
                    console.log(successData);
                    if (successData && successData.length) {
                        if (successData[0].referral_type != "young") {
                            Vue.set(this.refSignUpData, "role", successData[0].user_role);
                            Vue.set(this.refSignUpData, "email", successData[0][this.refSignUpData.role + '_email']);
                            Vue.set(this.refSignUpData, "first_name", successData[0][this.refSignUpData.role + '_firstname']);
                            Vue.set(this.refSignUpData, "last_name", successData[0][this.refSignUpData.role + '_lastname']);
                        }
                        else {
                            if (successData[0].user_role == "family") {
                                Vue.set(this.refSignUpData, "role", "Family/Friend");
                                Vue.set(this.refSignUpData, "email", successData[0].parent_email);
                                Vue.set(this.refSignUpData, "first_name", successData[0].parent_firstname);
                                Vue.set(this.refSignUpData, "last_name", successData[0].parent_lastname);
                            }
                            else if (successData[0].user_role == "young") {
                                Vue.set(this.refSignUpData, "role", "Young Person");
                                Vue.set(this.refSignUpData, "email", successData[0].child_email);
                                Vue.set(this.refSignUpData, "first_name", successData[0].child_firstname);
                                Vue.set(this.refSignUpData, "last_name", successData[0].child_lastname);
                            }
                            else if (successData[0].user_role == "professional") {
                                console.log("-------------")
                                Vue.set(this.refSignUpData, "role", successData[0].user_role);
                                Vue.set(this.refSignUpData, "email", successData[0].professional_email);
                                Vue.set(this.refSignUpData, "first_name", successData[0].professional_firstname);
                                Vue.set(this.refSignUpData, "last_name", successData[0].professional_lastname);
                            }

                        }

                        $('#loader').hide();
                    } else {
                        $('#loader').hide();
                    }
                } else {
                    this.showSignUpForm = false;
                }
                console.log(this.refSignUpData)
            },

            //Function to send feedback for referral form
            sendReferralFeedback: function () {
                this.isFeedBackFormSubmitted = true;
                if (this.refFeedbackData.ratings) {
                    $('#aa6a4e36-a655-4ebe-b072-2cb4d1a1f642').modal('hide');
                    $('#loader').show();
                    var feedbackObj = JSON.parse(JSON.stringify(this.refFeedbackData));
                    var successData = apiCallPost('post', '/feedback', feedbackObj);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        this.feedbackMessage = successData.message;
                        $('#refFeedbackSuccess').modal('show');
                        this.resetForm();

                    } else {
                        $('#loader').hide();
                        this.feedbackMessage = 'something went wrong pleasse try again';
                    }
                } else {
                    scrollToInvalidInput();
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
            getRecRes:function(){
                var _self = this;
                $.ajax({
                    url: API_URI + "/getSavedRes/" + document.getElementById('uUid').innerHTML,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                         
                          _self.recResList = data
                          console.log(_self.recResList)
                        
                        $('#loader').hide();
                    },
                    error: function (error) {
                        $('#loader').hide();
                        showError(error.responseJSON.message, error.status);
                    }
                });
            },

            getRefNo: function () {
                var _self = this;
                $.ajax({
                    url: API_URI + "/getRefNo/" + document.getElementById('uUid').innerHTML,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        //  console.log(data)
                        _self.reference_code = data.reference_code;
                        _self.sendObj.ref_code = data.reference_code;
                        _self.ackObj.role = data.user_role;
                        _self.ackObj.professional_email = data.professional_email;
                        _self.ackObj.refPdfCode = data.uuid;
                        _self.ackObj.referralCode = data.reference_code;
                        //console.log("logi flag ", _self.loginFlag)
                        _self.getRecRes();
                        _self.getSignUpData();
                        $('#loader').hide();
                    },
                    error: function (error) {
                        $('#loader').hide();
                        showError(error.responseJSON.message, error.status);
                    }
                });
            },

            sendReferralToMe: function () {
                var _self = this;
                console.log("working")
                $('#loader').show();
                $.ajax({
                    url: API_URI + "/sendReferralToMe/",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(_self.ackObj),
                    cache: false,
                    success: function (res) {
                        $('#loader').hide();
                        $('#referralSentSuccess').modal('show');
                    },
                    error: function (error) {
                        console.log(error)
                        $('#loader').hide();
                        showError(error.responseJSON.message, error.status);
                    }
                });
                // return;
                // $.ajax({
                //     url: API_URI + "/sendReferralToMe/" + _self.ackObj.role + "/" + _self.ackObj.professional_email + "/" + _self.ackObj.refPdfCode + "/" + _self.ackObj.referralCode,
                //     type: 'post',
                //     dataType: 'json',
                //     contentType: 'application/json',
                //     success: function (data) {
                //   //      console.log(data)
                //         $('#loader').hide();
                //         $('#referralSentSuccess').modal('show');
                //     },
                //     error: function (error) {
                //         $('#loader').hide();
                //         showError(error.responseJSON.message, error.status);
                //     }
                // });
            },

            noLoginSignUp: function () {
                let formData = this.refSignUpData;
                if(formData.role=="Young Person")
                {
                    formData.role = "young"
                }
                else if(formData.role=="Family/Friend")
                {
                    formData.role = "family"
                }
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

            closeModal: function () {
                this.resetForm();
            },

            resetForm: function () {
                this.isFeedBackFormSubmitted = "";
                this.refFeedbackData.comments = "";
                this.refFeedbackData.ratings = "";
            },

            gotoDashboard: function (token) {
                $('#signInSuccess').modal('hide');
                location.href = "/dashboard";
            },
            closeReferralSentSuccess: function () {
                $('#referralSentSuccess').modal('hide');
            },

        }
    })
});
