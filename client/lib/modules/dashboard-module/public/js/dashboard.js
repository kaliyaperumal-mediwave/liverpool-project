var API_URI = "/modules/dashboard-module";
$(document).ready(function () {
    new Vue({
        el: '#dashboardPage',
        data: {
            location: window.location,
            paramValues: '',
            loginId: '',
            incompleteReferral: [],
            searchRefObj: { errMsg: false, validateErrMsg: false },
            displayReferrals: [],
            referralDateArray: [],
            viewReferralArray: [],
            iterateReferralArray: [],
            searchQuery: null,
            filteredData: [],
            showSearchResults: false,
            resources: [],
            searchQueryToLower:null,
        },


        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            try {
                if(document.getElementById('resources') && document.getElementById('resources').value) {
                    this.resources = JSON.parse(document.getElementById('resources').value);
                } else {
                    this.resources = [];
                }
            } catch (error) {
                ////console.log(error);
                $('#loader').hide();
            }
            
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
                    cache: false,
                    success: function (data) {
                      console.log(data)
                        _self.incompleteReferral = data;
                    },
                    error: function (error) {
                        $('#loader').removeClass('d-block').addClass('d-none');
                        if (error) {
                            showError(error.responseJSON.message, error.status);
                        }
                    }
                });
            },

            filterPieces: function () {
                // //console.log(this.searchQuery, "this.searchQuerythis.searchQuery");
                this.searchQueryToLower = this.searchQuery.toLowerCase();
                if (this.searchQueryToLower) {
                    this.filteredData = [];
                    this.showSearchResults = true;
                    let self = this;
                    return self.resources.filter(function (item) {
                        // TODO: add description and other content after CMS
                        if (!!~item.title.toLowerCase().indexOf(self.searchQueryToLower)) {
                            self.filteredData.push(item);
                        }
                        return self.filteredData
                    })
                } else {
                    this.showSearchResults = false;
                    return this.filteredData = [];
                }
            },

            checkReferral: function (refObj) {
                var _self = this;
                $.ajax({
                    url: API_URI + "/continueIncompleteReferral/" + refObj.uuid + "/" + this.userRole + "/" + refObj.referral_progress,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
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
                        $('#loader').removeClass('d-block').addClass('d-none');
                        if (error) {
                            showError(error.responseJSON.message, error.status);
                        }
                    }
                });
            },

            searchReferral: function () {
                var _self = this;
                if (this.searchRefObj.refCode != "" && this.searchRefObj.refCode != undefined && (this.searchRefObj.refCode).trim() != "") {
                    $.ajax({
                        //  url: API_URI + "/fetchEligibility",
                        url: API_URI + "/searchReferalByCode/" + this.searchRefObj.refCode,
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json',
                        // data: JSON.stringify(this.sendObj),
                        success: function (data) {
                            if (data.length != 0) {
                                location.href = "/viewreferals?" + btoa(_self.searchRefObj.refCode);
                                _self.searchRefObj.errMsg = false;
                            }
                            else {
                                _self.searchRefObj.errMsg = true;
                            }
                            $('#loader').hide();
                        },
                        error: function (error) {
                            $('#loader').hide();
                            if (error) {
                                showError(error.responseJSON.message, error.status);
                            }
                        }
                    });
                }
                else {
                    this.searchRefObj.validateErrMsg = true;
                }
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
            getStringLength: function (str) {
                return str.length;
            },
            getRefCode: function (e) {
                //set errmsg false to clear from view
                var searchTxt = e.target.value;
                if (searchTxt.length > 0) {
                    this.searchRefObj.errMsg = false;
                    this.searchRefObj.validateErrMsg = false;
                }
            }

        }

    })

})