var API_URI = "/modules/review-module";
$(document).ready(function () {

    $("[data-cid]").prop({ tabindex: 1, contenteditable: true }).on({

        focusin() {
            this.__html = $(this).html(); // Store current HTML content
        },

        focusout() {

            const data = {
                cid: this.dataset.cid,
                html: this.innerHTML,
            };

            if (this.__html === data.html) return;  // Nothing has changed.

            console.log(data); // Something changed, send data to server.
        }

    });

    var app = new Vue({
        el: '#review-form',
        data: {
            isToggled: true,
            userId: '',
            userMode: '',
            userRole: '',
            yourInfo: '',
            allLabelsValue: {},
            parentLabelsValue: {},
            childLabelsValue: {},
            professionalLabelsValue: {},
            section4LabelValues: {},
            payloadData: {},
            contactPref: [],
            section1Obj:{}
        },
        mounted: function () {
            this.userMode = this.getQueryStringValue('mode');
            this.userRole = this.getQueryStringValue('role');
            if (this.userRole === 'child') {
                this.yourInfo = 'Child / Young Person';

            } else if (this.userRole === 'parent') {
                this.yourInfo = 'Parent / Carer';

            } else if (this.userRole === 'professional') {
                this.yourInfo = 'Professional';

            }
            this.userId = this.getQueryStringValue('userId');
            this.payloadData.userid = this.userId;
            this.payloadData.role = this.userRole;
            this.getAllSectionData(this.payloadData);
        },
        methods: {
            getAllSectionData(payloadData) {
                console.log(payloadData);
                var _self = this;
                $.ajax({
                    url: API_URI + "/fetchReview/"+payloadData.userid+"&role="+payloadData.role,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                   // data: JSON.stringify(payloadData),
                    success: function (data) {
                        console.log(data);
                        _self.section1Obj = data.section1;
                        // _self.allLabelsValue = data;
                        // _self.parentLabelsValue = data.parentData;
                        // _self.childLabelsValue = data.childData[0];
                        // _self.section4LabelValues = data.referralData;
                        // console.log(_self.parentLabelsValue, _self.childLabelsValue);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });

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

            // Get Query Params value
            getQueryStringValue(key) {
                return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
            },

            save: function () {
                this.payloadData.contactPreference = this.contactPref;
                $.ajax({
                    url: API_URI + "/saveReview",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.payloadData),
                    success: function (data) {
                        alert("Your Reference Number" + data.refNo);
                        console.log(data);
                    },
                });
            },

            editAllSection: function () {
                var uid = this.getUrlVars()['userid'];
                var role = this.getUrlVars()['role'];
                location.href = "/role?userid=" + uid + "&role=" + role + "&edt=1";
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

            updateEligibility :function(updateObj) {
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