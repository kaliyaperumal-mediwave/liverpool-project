var API_URI = "/modules/check-referral-module";
$(document).ready(function () {
    Vue.use(VueToast);

    var app = new Vue({
        el: '#viewReferral-page',
        data: {
            viewReferralObj: {
                email: "",
                loginId: "",
                referralType: "completed"
            },
            viewReferralObj: {
                loginId: "123",
                referralType: "completed"
            },
            name: "prasath",
            displayReferrals: [],
            savedReferrals: [],
            isFormSubmitted: false,
            showVisibility: false,
            displayReferrals: [],
            referralDateArray: [],
            viewReferralArray: [],
            iterateReferralArray: []
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            console.log(this.paramValues)
            this.viewReferralObj.loginId = this.paramValues[0];
            this.viewReferralObj.userRole = this.paramValues[1]
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
                        let setObj = {};
                        _self.displayReferrals = data;
                        _self.viewReferralArray = [];
                        _self.referralDateArray = [];
                        for (var i = 0; i < _self.displayReferrals.length; i++) {
                            var date = _self.convertDate(_self.displayReferrals[i].createdAt);
                            obj = {
                                date: "",
                                data: []
                            };
                            if (_self.referralDateArray.length == 0) {
                                obj.date = date;
                                obj.data.push(_self.displayReferrals[i])
                                _self.referralDateArray.push(date)
                                _self.viewReferralArray.push(obj)
                            }
                            else if (_self.referralDateArray.indexOf(date) === -1) {
                                obj.date = date;
                                obj.data.push(_self.displayReferrals[i])
                                _self.referralDateArray.push(date)
                                _self.viewReferralArray.push(obj)
                            }
                            else {
                                for (var j = 0; j < _self.viewReferralArray.length; j++) {

                                    if (_self.viewReferralArray[j].date == date) {
                                        _self.viewReferralArray[j].data.push(_self.displayReferrals[i])
                                    }

                                }
                            }
                        }
                        console.log(_self.referralDateArray)
                        console.log(_self.viewReferralArray)
                    },
                    error: function (error) {
                        console.log(error.responseJSON.message)
                    }
                });
            },

            convertDate: function (dbDate) {
                var date = new Date(dbDate)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();

                var mmChars = mm.split('');
                var ddChars = dd.split('');
                return (ddChars[1] ? dd : "0" + ddChars[0]) + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + yyyy;
            },
            contineReferral: function (refObj) {
              // console.log(refObj.referral_progress)
               if(refObj.referral_progress=="20")
               {
                location.href = redirectUrl(location.href, "about", this.loginId, this.userRole);
               }
               else if(refObj.referral_progress=="40")
               {
                location.href = redirectUrl(location.href, "education", this.loginId, this.userRole);
               }
               else if(refObj.referral_progress=="60")
               {  
                   location.href = redirectUrl(location.href, "referral", this.loginId, this.userRole);
               }
               else if(refObj.referral_progress=="80")
               {
                location.href = redirectUrl(location.href, "review", this.loginId, this.userRole);
               }
            },
            fetchReferrals: function (referralType) {
                this.getUserReferral(this.viewReferralObj.loginId, referralType)
            }
        }
    })

});