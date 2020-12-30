var API_URI = "/modules/check-referral-module";
$(document).ready(function () {

    new Vue({
        el: '#check-referral',

        data: {
            viewReferralObj: {
                loginId: "",
                referralType: "completed"
            },
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.viewReferralObj.loginId = this.paramValues[0];
            this.getUserReferral(this.viewReferralObj.loginId, this.viewReferralObj.referralType)
        },

        methods: {

            getUserReferral: function (loginId, referralType) {
                $.ajax({
                    url: API_URI + "/getUserReferral/" + loginId + "/" + referralType,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.log(data)
                    },
                    error: function (error) {
                        console.log(error.responseJSON.message)
                    }
                });
            }



        }
    })

});