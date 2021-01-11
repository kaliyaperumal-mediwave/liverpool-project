var API_URI = "/modules/dashboard-module";
$(document).ready(function () {
    new Vue({
        el: '#dashboardPage',
        data: {
            location: window.location,
            paramValues: '',
            loginId: '',
            incompleteReferral: []
        },


        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            // this.paramValues = getParameter(location.href)
            this.loginId = document.getElementById('logId').innerHTML; // hide in layout.html
            this.userRole = document.getElementById('uRole').innerHTML; // hide in layout.html
            this.fetchSavedData();
            console.log(document.getElementById('logId').innerHTML);
            $('#loader').hide();
        },

        methods: {

            //Fetch Api service Logic
            fetchSavedData: function () {
                var _self = this;
                $.ajax({
                    //  url: API_URI + "/fetchEligibility",
                    url: API_URI + "/getIncompleteReferral/" + this.loginId + "/" + this.userRole,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    // data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        _self.incompleteReferral = data.data
                        console.log( _self.incompleteReferral);
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
        }

    })

})