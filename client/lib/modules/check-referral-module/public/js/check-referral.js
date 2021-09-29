var API_URI = "/modules/check-referral-module";
$(document).ready(function () {

    var app = new Vue({
        el: '#check-referral',
        data: {
            viewReferralObj: {
                email: "",
                loginId: "",
                referralType: "completed",
                searchTxt: ""
            },
            searchReferrals: [],
            displayReferrals: [],
            savedReferrals: [],
            isFormSubmitted: false,
            showVisibility: false,
            displayReferrals: [],
            referralDateArray: [],
            viewReferralArray: [],
            iterateReferralArray: [],
            activeState: false
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href);
            if (this.paramValues != undefined && this.paramValues[0] != undefined) {
                this.searchReferalByCode(this.paramValues[0])
            }
            this.viewReferralObj.loginId = document.getElementById('logId').innerHTML; // hide in layout.html
            this.viewReferralObj.userRole = document.getElementById('uRole').innerHTML;// hide in layout.html
            this.viewReferralObj.loginUserFlag = document.getElementById('loginUserFlag').innerHTML; // hide in layout.html
            this.viewReferralObj.loginFlg = document.getElementById('loginUserFlag').innerHTML;// hide in layout.html
            //CALL FETCH METHOD ONLY FOR LOGGED USER
            if (this.viewReferralObj.loginFlg == 'true') {
                this.getUserReferral(this.viewReferralObj.referralType);
            }
            $('#loader').hide();
        },

        methods: {

            toggleArrow: function (e) {
                var ele = e.target;
                var elemId = e.target.id;
                var allToggleIcons = Array.from(document.getElementsByClassName('arrowClass'));
                allToggleIcons.filter(function (i) {
                    if (i.id == elemId) {
                        if (Array.from(ele.classList).indexOf('fa-chevron-circle-up') > -0) {
                            $(ele).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                        } else {
                            $(ele).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                        }
                    } else {
                        $(i).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                    }
                });

            },



            getUserReferral: function (referralType) {
                //console.log("erer")
                $('#loader').show();
                var _self = this;
                $.ajax({
                    url: API_URI + "/getUserReferral/" + referralType,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                        $('#loader').hide();
                        let setObj = {};
                        ////console.log(data)
                        _self.displayReferrals = data;
                        _self.viewReferralArray = [];
                        _self.referralDateArray = [];
                        for (var i = 0; i < _self.displayReferrals.length; i++) {
                            if (referralType == 'completed') {
                                console.log((_self.displayReferrals[i].referral_status).substring(0, 8))

                                if (_self.displayReferrals[i].referral_status == 'Accepted - Alder Hey') //2
                                {
                                    var refStatus = _self.displayReferrals[i].referral_status
                                    refStatus = "Alder Hey have accepted your referral and they will be in contact"
                                    _self.displayReferrals[i].referral_status = refStatus
                                }
                                else if (_self.displayReferrals[i].referral_status == "Nothing") // 1
                                {
                                    var refStatus = _self.displayReferrals[i].referral_status
                                    refStatus = "Your referral has been sent successfully and will be reviewed shortly"
                                    _self.displayReferrals[i].referral_status = refStatus
                                }
                                else if (_self.displayReferrals[i].referral_status == "Duplicate referral") //4
                                {
                                    var refStatus = _self.displayReferrals[i].referral_status
                                    refStatus = "We have already had a referral which has been accepted. Thank you for this extra information."
                                    _self.displayReferrals[i].referral_status = refStatus
                                }
                                else if (_self.displayReferrals[i].referral_status == "Rejected referral") // 5
                                {
                                    var refStatus = _self.displayReferrals[i].referral_status
                                    refStatus = "Thank you for contacting us - at this time we do not feel that you require our support but please use this platform to access some useful resources"
                                    _self.displayReferrals[i].referral_status = refStatus
                                }
                                else if (_self.displayReferrals[i].referral_status == "Referral to Community Paeds required instead") // 6
                                {
                                    var refStatus = _self.displayReferrals[i].referral_status
                                    refStatus = "Thank you for your referral. At this time we feel the Community Paediatrics team can support you more appropriately."
                                    _self.displayReferrals[i].referral_status = refStatus
                                }
                                else if (_self.displayReferrals[i].referral_status == "Referral to other team") // 7
                                {
                                    var refStatus = _self.displayReferrals[i].referral_status
                                    refStatus = "Your referral has been passed on to " + _self.displayReferrals[i].referral_provider_other
                                    _self.displayReferrals[i].referral_status = refStatus
                                }
                                else if ((_self.displayReferrals[i].referral_status).substring(0, 8) === 'Accepted' ) // 8
                                {
                                    var refStatus = _self.displayReferrals[i].referral_status
                                    refStatus = _self.displayReferrals[i].referral_provider_other + " have accepted your referral and will be in contact.";
                                    _self.displayReferrals[i].referral_status = refStatus
                                }
                                else //3
                                {
                                    var refStatus = _self.displayReferrals[i].referral_status
                                    refStatus = "Your referral has been forwarded to " + refStatus + " they will be in contact"
                                    _self.displayReferrals[i].referral_status = refStatus
                                }
                            }
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
                        if (error) {
                            $('#loader').hide();
                            ////console.log(error)
                            showError(error.responseJSON.message, error.status);
                        }
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
            contineReferral: function (refObj) {
                $.ajax({
                    url: API_URI + "/continueIncompleteReferral/" + refObj.uuid + "/" + refObj.user_role + "/" + refObj.referral_progress,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {

                        if(refObj.referral_type=="young")
                        {
                            if (refObj.referral_progress == "20") {
                                location.href = "/young-referral/youngAbout";
                            }
                            else if (refObj.referral_progress == "40") {
                                location.href = "/young-referral/education";
                            }
                            else if (refObj.referral_progress == "60") {
                                location.href = "/young-referral/referral";
    
                            }
                            else if (refObj.referral_progress == "80") {
                                location.href = "/young-referral/review";
    
                            }
                        }
                        else
                        {
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
                        }


                    },
                    error: function (error) {
                        if (error) {
                            ////console.log(error)
                            showError(error.responseJSON.message, error.status);
                        }
                    }
                });
            },
            fetchReferrals: function (referralType) {

                this.viewReferralObj.referralType = referralType;
                this.getUserReferral(referralType)
                if (referralType == "incomplete") {
                    this.activeState = true
                }
                else {
                    this.activeState = false
                }
            },
            formatCompat: function (date) {
                var dateFmt = new Date(date)
                var ms = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return dateFmt.getDate() + ' ' + ms[dateFmt.getMonth()] + ' ' + dateFmt.getFullYear();
            },

            getReferalByCode: function (e) {
                var _self = this;
                // //console.log(e.target.value)
                var searchKey = e.target.value
                if (searchKey.length > 0) {
                    $.ajax({
                        url: API_URI + "/getReferalByCode/" + searchKey,
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json',
                        cache: false,
                        success: function (data) {
                            _self.searchReferrals = data

                            if (_self.searchReferrals[0].referral_status == 'Accepted - Alder Hey') //2
                            {
                                var refStatus = _self.searchReferrals[0].referral_status
                                refStatus = "Alder Hey have accepted your referral they will be in contact."
                                _self.searchReferrals[0].referral_status = refStatus
                            }
                            else if (_self.searchReferrals[0].referral_status == "Nothing") // 1
                            {
                                var refStatus = _self.searchReferrals[0].referral_status
                                refStatus = "Your referral has been sent successfully and will be reviewed shortly."
                                _self.searchReferrals[0].referral_status = refStatus
                            }
                            else if (_self.searchReferrals[0].referral_status == "Duplicate referral") //4
                            {
                                var refStatus = _self.searchReferrals[0].referral_status
                                refStatus = "We have already had a referral which has been accepted. Thank you for this extra information."
                                _self.searchReferrals[0].referral_status = refStatus
                            }
                            else if (_self.searchReferrals[0].referral_status == "Rejected referral") // 5
                            {
                                var refStatus = _self.searchReferrals[0].referral_status
                                refStatus = "Thank you for contacting us - at this time we do not feel that you require our support but please use this platform to access some useful resources."
                                _self.searchReferrals[0].referral_status = refStatus
                            }
                            else if (_self.searchReferrals[0].referral_status == "Referral to Community Paeds required instead") // 6
                            {
                                var refStatus = _self.searchReferrals[0].referral_status
                                refStatus = "Thank you for your referral. At this time we feel the Community Paediatrics team can support you more appropriately."
                                _self.searchReferrals[0].referral_status = refStatus
                            }
                            else if (_self.searchReferrals[0].referral_status == "Referral to other team") // 7
                            {
                                var refStatus = _self.searchReferrals[0].referral_status
                                refStatus = "Your referral has been passed on to " + _self.searchReferrals[0].referral_provider_other
                                _self.searchReferrals[0].referral_status = refStatus
                            }
                            else if ((_self.searchReferrals[0].referral_status).substring(0, 8) === 'Accepted' ) // 8
                            {
                                var refStatus = _self.searchReferrals[0].referral_status
                                refStatus = _self.searchReferrals[0].referral_provider_other + " have accepted your referral and will be in contact.";
                                _self.searchReferrals[0].referral_status = refStatus
                            }
                            else //3
                            {
                                var refStatus = _self.searchReferrals[0].referral_status
                                refStatus = "Your referral has been forwarded to " + refStatus + " they will be in contact"
                                _self.searchReferrals[0].referral_status = refStatus
                            }


                            //console.log(data)
                        },
                        error: function (error) {
                            if (error) {
                                //console.log(error)
                                showError(error.responseJSON.message, error.status);
                            }
                        }
                    });
                }
            },


            searchReferalByCode: function (searchCode) {
                var _self = this;
                console.log(searchCode)
                $('#loader').show();
                var searchCodeUpperCase = searchCode.toUpperCase()
                $.ajax({
                    url: API_URI + "/searchReferalByCode/" + searchCode,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                        $('#loader').hide();
                        _self.searchReferrals = data
                        console.log(_self.searchReferrals[0].referral_status);
                        if (_self.searchReferrals[0].referral_status == 'Accepted - Alder Hey') //2
                        {
                            var refStatus = _self.searchReferrals[0].referral_status
                            refStatus = "Alder Hey have accepted your referral they will be in contact."
                            _self.searchReferrals[0].referral_status = refStatus
                        }
                        else if (_self.searchReferrals[0].referral_status == "Nothing") // 1
                        {
                            var refStatus = _self.searchReferrals[0].referral_status
                            refStatus = "Your referral has been sent successfully and will be reviewed shortly."
                            _self.searchReferrals[0].referral_status = refStatus
                        }
                        else if (_self.searchReferrals[0].referral_status == "Duplicate referral") //4
                        {
                            var refStatus = _self.searchReferrals[0].referral_status
                            refStatus = "We have already had a referral which has been accepted. Thank you for this extra information."
                            _self.searchReferrals[0].referral_status = refStatus
                        }
                        else if (_self.searchReferrals[0].referral_status == "Rejected referral") // 5
                        {
                            var refStatus = _self.searchReferrals[0].referral_status
                            refStatus = "Thank you for contacting us - at this time we do not feel that you require our support but please use this platform to access some useful resources."
                            _self.searchReferrals[0].referral_status = refStatus
                        }
                        else if (_self.searchReferrals[0].referral_status == "Referral to Community Paeds required instead") // 6
                        {
                            var refStatus = _self.searchReferrals[0].referral_status
                            refStatus = "Thank you for your referral. At this time we feel the Community Paediatrics team can support you more appropriately."
                            _self.searchReferrals[0].referral_status = refStatus
                        }
                        else if (_self.searchReferrals[0].referral_status == "Referral to other team") // 7
                        {
                            var refStatus = _self.searchReferrals[0].referral_status
                            refStatus = "Your referral has been passed on to " + _self.searchReferrals[0].referral_provider_other
                            _self.searchReferrals[0].referral_status = refStatus
                        }
                        else if ((_self.searchReferrals[0].referral_status).substring(0, 8) === 'Accepted' ) // 8
                        {
                            var refStatus = _self.searchReferrals[0].referral_status
                            refStatus = _self.searchReferrals[0].referral_provider_other + " have accepted your referral and will be in contact.";
                            _self.searchReferrals[0].referral_status = refStatus
                        }
                        else //3
                        {
                            var refStatus = _self.searchReferrals[0].referral_status
                            refStatus = "Your referral has been forwarded to " + refStatus + " they will be in contact"
                            _self.searchReferrals[0].referral_status = refStatus
                        }

                        _self.viewReferralObj.searchTxt = searchCode;
                        //   //console.log(data)
                    },
                    error: function (error) {
                        if (error) {
                            //  //console.log(error);
                            $('#loader').hide();
                            showError(error.responseJSON.message, error.status);
                        }
                    }
                });
            },
            getStringLength: function (str) {
                return str.length;
            },

            changeDateFormat: function (date) {
                return moment(date).format('DD/MM/YYYY');
            },
        }
    })
});
