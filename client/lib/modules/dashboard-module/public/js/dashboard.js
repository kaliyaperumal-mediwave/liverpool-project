var API_URI = "/modules/dashboard-module";
$(document).ready(function () {
    new Vue({
        el: '#dashboardPage',
        data: {
            location: window.location,
            paramValues: '',
            loginId: '',
            incompleteReferral: [],
            searchRefObj: {},
            displayReferrals: [],
            referralDateArray: [],
            viewReferralArray: [],
            iterateReferralArray: []
        },


        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            // this.paramValues = getParameter(location.href)
            //    this.loginId = document.getElementById('logId').innerHTML; // hide in layout.html
            this.userRole = document.getElementById('uRole').innerHTML; // hide in layout.html
            this.fetchSavedData();
            $('#loader').hide();
        },

        methods: {

            //Fetch Api service Logic
            fetchSavedData: function () {
                var _self = this;
                var referralType = "incomplete";
                $.ajax({
                    url: API_URI + "/getUserIncompleteReferral/" + referralType,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        console.table(data)
                        _self.incompleteReferral = data;
                        _self.viewReferralArray = [];
                        _self.referralDateArray = [];
                        for (var i = 0; i < _self.displayReferrals.length; i++) {
                            var date = _self.convertDate(_self.displayReferrals[i].createdAt);
                            // var date = _self.displayReferrals[i].createdAt;
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
                    },
                    error: function (error) {
                        console.log(error)
                    }
                });
                // $.ajax({
                //     //  url: API_URI + "/fetchEligibility",
                //     url: API_URI + "/getIncompleteReferral/",
                //     type: 'get',
                //     dataType: 'json',
                //     contentType: 'application/json',
                //     // data: JSON.stringify(this.sendObj),
                //     success: function (data) {
                //         _self.incompleteReferral = data.data
                //         console.table(_self.incompleteReferral);
                //         $('#loader').hide();
                //     },
                //     error: function (error) {
                //         $('#loader').hide();
                //         console.log(error.responseJSON.message)
                //     }
                // });
            },

            navigatePage: function (route) {
                var url = location.href
                this.location.href = this.location.origin + route + "?" + url.substring(url.indexOf("?") + 1);
            },

            checkReferral: function (refObj) {
                $.ajax({
                    url: API_URI + "/continueIncompleteReferral/" + refObj.uuid + "/" + this.userRole + "/" + refObj.referral_progress,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        if (refObj.referral_progress == "20") {
                            location.href = "/about";
                        }
                        else if (refObj.referral_progress == "40") {
                            location.href = "/education";
                        }
                        else if (refObj.referral_progress == "60") {
                            location.href = "/referral";

                        }
                        else if (refObj.referral_progress == "80") {
                            location.href = "/review";

                        }
                    },
                    error: function (error) {
                        console.log(error)
                    }
                });
            },

            searchReferral: function () {
                var _self = this;
                console.log(this.searchRefObj.refCode)
                $.ajax({
                    //  url: API_URI + "/fetchEligibility",
                    url: API_URI + "/searchReferalByCode/" + this.searchRefObj.refCode,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    // data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        if(data.length!=0)
                        {
                            location.href = "/viewreferals?"+ btoa(_self.searchRefObj.refCode);
                        }
                        else
                        {
                            console.log("No record found for "+ _self.searchRefObj.refCode)
                        }
                        $('#loader').hide();
                    },
                    error: function (error) {
                        $('#loader').hide();
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
                var ms = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return moment(date).format('dddd, MMMM D, YYYY');
                return date.getDate() + ' ' + ms[date.getMonth()] + ' ' + date.getFullYear();
                //return (ddChars[1] ? dd : "0" + ddChars[0]) + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + yyyy;
            },
        }

    })

})