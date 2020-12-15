var API_URI = "/modules/review-module";
$(document).ready(function () {

    var app = new Vue({
        el: '#review-form',
        data: {
            isToggled: true,
            userId: '',
            userMode: '',
            userRole: '',
            yourInfo: '',
            allSectionData: {},
            section5Labels: {
                aboutLabel: "",
                referralLabel: ""
            },
            section1Data: {},
            section2Data: {},
            section3Data: {},
            section4Data: {},
            payloadData: {},
            contactPref: [],
            isFormSubmitted: false,
            showSec1: false,
            prevVal: '',
            curVal: '',
            digArray: []
        },
        mounted: function () {
            var _self = this;
            this.curVal = $("[contenteditable='true']").text();
            $("[contenteditable='true']").on("blur", function (event) {
                if (_self.prevVal != _self.curVal) {
                    _self.showSec1 = true;
                } else {
                    _self.showSec1 = false;
                }
            });

            $("[contenteditable='true']").on("input", function (e) {
                _self.prevVal = e.target.textContent;

            });
            this.paramValues = getParameter(location.href)
            this.section5Labels = section5Labels;
            this.userRole = this.paramValues[1];
            if (this.userRole === 'child') {
                this.yourInfo = 'Child / Young Person';
                this.section5Labels.aboutLabel = "About You";
                this.section5Labels.referralLabel = "Your reason for referral";

            } else if (this.userRole === 'parent') {
                this.yourInfo = 'Parent / Carer';
                this.section5Labels.aboutLabel = "About Your Child";
                this.section5Labels.referralLabel = "Your child's reason for referral";

            } else if (this.userRole === 'professional') {
                this.yourInfo = 'Professional';
                this.section5Labels.aboutLabel = "About The Child";
                this.section5Labels.referralLabel = "The child's reason for referral";

            }
            this.userId = this.paramValues[0];
            this.payloadData.userid = this.userId;
            this.payloadData.role = this.userRole;
            console.log(this.payloadData)
            this.getAllSectionData(this.payloadData);
        },
        methods: {

            //Get Request to get all section's data
            getAllSectionData: function (payloadData) {
                var _self = this;
                $.ajax({
                    url: API_URI + "/fetchReview/" + payloadData.userid + "&role=" + payloadData.role,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    // data: JSON.stringify(payloadData),
                    success: function (data) {
                        _self.section1Data = data.section1;
                        _self.section2Data = data.section2;
                        _self.section3Data = data.section3;
                        _self.section4Data = data.section4;
                        //  console.log(_self.section4Data)
                        _self.section1Data.child_dob = convertDate(data.section1.child_dob);
                        if (_self.section4Data.diagnosis_other != "")
                            _self.section4Data.diagnosis.push(_self.section4Data.diagnosis_other)
                        if (_self.section4Data.symptoms_other != "")
                            _self.section4Data.symptoms.push(_self.section4Data.symptoms_other)
                        _self.section4Data.diagnosis = _self.section4Data.diagnosis.toString();
                        _self.section4Data.symptoms = _self.section4Data.symptoms.toString();
                        _self.section4Data.local_services = _self.section4Data.local_services.toString();
                        //self.section4Data.local_services =  _self.section4Data.local_services
                        //  Vue.set(this.section1Data,data);
                    },
                    error: function (error) {
                        console.log('Something went Wrong', error)
                    }
                });
            },

            save: function () {
                var _self = this;
                this.isFormSubmitted = true;
                this.payloadData.contactPreference = this.contactPref;
                if (this.contactPref.length) {
                    var successData = apiCallPost('post', '/saveReview', this.payloadData);
                    console.log(successData);
                    if (Object.keys(successData)) {
                        location.href = redirectUrl(location.href, "acknowledge", this.paramValues[0], this.paramValues[1]);
                        this.isFormSubmitted = false;
                    } else {
                        console.log('empty response')
                    }
                } else {
                    //scrollToInvalidInput();
                    return false;
                }
            },

            editAllSection: function (page) {
                this.userId = this.paramValues[0];
                this.userRole = this.paramValues[1];
                var parameter = this.userId + "&" + this.userRole + "&" + "sec5back"
                var enCodeParameter = btoa(parameter)
                location.href = "/" + page + "?" + enCodeParameter
            },

            toggleArrow: function (e) {
                console.log(e);
                var ele = e.target;
                var classList = Array.from(e.target.classList)
                if (classList.indexOf('fa-chevron-circle-up') > -1) {
                    $(ele).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                } else {
                    $(ele).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                }
            },

            getUrlVars: function () {
                var vars = {};
                var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                    function (m, key, value) {
                        vars[key] = value;
                    });
                return vars;
            },

            backToReferral: function () {
                var uid = this.getUrlVars()['userid'];
                var role = this.getUrlVars()['role'];
                location.href = "/referral?userid=" + uid + "&role=" + role + "&edt=1";
            },

            convertDate: function (dbDate) {
                var date = new Date(dbDate)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();

                var mmChars = mm.split('');
                var ddChars = dd.split('');

                return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
            },

            updateEligibility: function (updateObj) {
                $.ajax({
                    url: API_URI + "/updateReview",
                    type: 'put',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(updateObj),
                    success: function (data) {
                        alert("Your Reference Number" + data.refNo);
                        console.log(data);
                    },
                });


            },

            updateInfo: function (toUpdateObj, endpoint) {
                toUpdateObj.endPoint = endpoint
                $.ajax({
                    url: API_URI + "/updateInfo",
                    type: 'put',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(toUpdateObj),
                    success: function (data) {
                        // data: [1]
                        // message: "Updated successfully"
                        // status: "success"
                        // __proto__: Object
                        console.log(data);
                    },
                });
            },
        }
    })

})