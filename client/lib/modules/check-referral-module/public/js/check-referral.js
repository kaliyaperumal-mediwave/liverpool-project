var API_URI = "/modules/check-referral-module";
$(document).ready(function () {

    var app = new Vue({
        el: '#viewReferral-page',
        data: {
            checkReferral: {
                email: "",
                password: ""
            },
            isFormSubmitted: false,
            showVisibility: false,
        },

        mounted: function () {
            this.name = "thiru"
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
        }
    })

});