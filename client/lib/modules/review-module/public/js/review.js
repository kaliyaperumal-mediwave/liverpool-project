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
            section1Obj: {}
        },
        mounted: function () {
            this.userMode = getQueryStringValue('mode');
            this.section5Labels = section5Labels;
            this.userRole = getQueryStringValue('role');
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
            this.userId = getQueryStringValue('userId');
            this.payloadData.userid = this.userId;
            this.payloadData.role = this.userRole;
            this.getAllSectionData(this.payloadData);
        },
        methods: {

            //Get Request to get all section's data
            getAllSectionData(payloadData) {
                var params = payloadData.userid + "&role=" + payloadData.role;
                var responseData = apiCallGet('get', '/fetchReview', params);
                // if (Object.keys(responseData)) {
                //     this.allSectionData = responseData;
                //     this.section1Data = responseData.section1;
                //     this.section2Data = responseData.section1;
                //     this.section3Data = responseData.section1;
                //     this.section4Data = responseData.section1;
                // } else {
                //     console.log('empty response')
                // }

            },

            save: function () {
                this.payloadData.contactPreference = this.contactPref;
                if (contactPref) {
                    var successData = apiCallPost('post', '/saveReview', this.payloadData);
                    if (Object.keys(res)) {
                        alert("Your Reference Number" + res.refNo);
                        console.log(res);
                    } else {
                        console.log('empty response')
                    }
                } else {
                    return false;
                }

            },

            editAllSection: function () {
                var uid = this.getUrlVars()['userid'];
                var role = this.getUrlVars()['role'];
                location.href = "/role?userid=" + uid + "&role=" + role + "&edt=1";
            },

            toggleArrow(e) {
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


            }

        }
    })

})