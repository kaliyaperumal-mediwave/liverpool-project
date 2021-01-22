var API_URI = "/modules/dashboard-module";
$(document).ready(function () {
    new Vue({
        el: '#dashboardPage',
        data: {
            location: window.location,
            paramValues: '',
            loginId: '',
            incompleteReferral: [],
            searchRefObj: {}
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
                $.ajax({
                    //  url: API_URI + "/fetchEligibility",
                    url: API_URI + "/getIncompleteReferral/",
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    // data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        _self.incompleteReferral = data.data
                        console.table(_self.incompleteReferral);
                        $('#loader').hide();
                    },
                    error: function (error) {
                        $('#loader').hide();
                        console.log(error.responseJSON.message)
                    }
                });
            },

            navigatePage: function (route) {
                var url = location.href
                this.location.href = this.location.origin + route + "?" + url.substring(url.indexOf("?") + 1);
            },

            checkReferral: function () {
                location.href = decryptUrl("viewreferals", this.loginId, this.userRole);
            },

            searchReferral: function () {
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
                            location.href = "/viewreferals";
                        }
                        else
                        {
                            console.log("No record found for "+ this.searchRefObj.refCode)
                        }
                        $('#loader').hide();
                    },
                    error: function (error) {
                        $('#loader').hide();
                        console.log(error.responseJSON.message)
                    }
                });
            }
        }

    })

})