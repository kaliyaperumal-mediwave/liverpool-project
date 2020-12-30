var API_URI = "/modules/check-referral-module";
$(document).ready(function () {

    var app = new Vue({
        el: '#viewReferral-page',
        data: {
            viewReferralObj: {
                loginId: "123",
                referralType: "completed"
            },
            name:"prasath",
            displayReferrals:[],
            savedReferrals:[],

        },

        mounted: function () {
            this.name = "thiru"
            this.paramValues = getParameter(location.href)
            this.viewReferralObj.loginId = this.paramValues[0];
            this.getUserReferral(this.viewReferralObj.loginId, this.viewReferralObj.referralType)
        },

        methods: {

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

                        for (var i = 0; i < _self.displayReferrals.length; i++) {
                            setObj.date=_self.displayReferrals[0]
                        }
                    },
                    error: function (error) {
                        console.log(error.responseJSON.message)
                    }
                });
            }

        }
    })

});