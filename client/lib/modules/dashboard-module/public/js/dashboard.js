var API_URI = "/modules/dashboard-module";
$(document).ready(function () {
    new Vue({
        el: '#dashboardPage',
        data: {
            location: window.location,
            paramValues:'',
            loginId:''
        },
        mounted: function () {
            
            this.paramValues = getParameter(location.href)
            this.loginId = this.paramValues[0];
            this.userRole = this.paramValues[1];
            this.fetchSavedData();
        },

        methods: {
            //Ftech Api service Logic
            fetchSavedData: function () {
                $.ajax({
                    //  url: API_URI + "/fetchEligibility",
                    url: API_URI + "/getIncompleteReferral/" + this.loginId + "/" + this.userRole,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    // data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        console.log(data)
                    },
                    error: function (error) {
                        console.log(error.responseJSON.message)
                    }
                });
            },

            navigatePage: function (route) {
                this.location.href = this.location.origin + route;
            },
            newReferral: function () {

            },
            checkReferral: function () {
                $.ajax({
                    //  url: API_URI + "/fetchEligibility",
                    url: API_URI + "/getUserReferral/" + this.loginId,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    // data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        console.log(data)
                    },
                    error: function (error) {
                        console.log(error.responseJSON.message)
                    }
                });
            },
        }

    })

})