var API_URI = "/modules/check-referral-module";
$(document).ready(function () {

    var app = new Vue({
        el: '#viewReferral-page',
        data: {
            viewReferralObj: {
                email: "",
                loginId: "",
            },
            isFormSubmitted: false,
            showVisibility: false,
            displayReferrals:[]
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.viewReferralObj.loginId = this.paramValues[0];
            this.getUserReferral(this.viewReferralObj.loginId, this.viewReferralObj.referralType)
        },

        methods: {
            toggleArrow: function (e) {
                var ele = e.target;
                var classList = Array.from(e.target.classList)
                if (classList.indexOf('fa-chevron-circle-up') > -1) {
                    $(ele).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                } else {
                    $(ele).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                }
            },
            getUserReferral: function (loginId, referralType) {
                var _self = this;
                $.ajax({
                    url: API_URI + "/getUserReferral/" + loginId + "/" + referralType,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        let setObj={};
                        _self.displayReferrals = data;
                        console.log(_self.displayReferrals)
                    },
                    error: function (error) {
                        console.log(error.responseJSON.message)
                    }
                });
            }
        }
    })

});