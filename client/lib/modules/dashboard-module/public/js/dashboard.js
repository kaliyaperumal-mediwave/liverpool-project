var API_URI = "/modules/dashboard-module";
$(document).ready(function () {
    new Vue({
        el: '#dashboard-page',
        data: {
            location: window.location,
            paramValues:'',
            loginId:''
        },
        mounted: function () {
            
            this.paramValues = getParameter(location.href)
            console.log( this.paramValues);
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
                        app.setValues(data);
                    },
                    error: function (error) {
                        console.log(error.responseJSON.message)
                    }
                });

                var payload = {};
              //  var successData = apiCallGet('get', '/getIncompleteReferral/login_id='+this.loginId+"&userRole="+ this.userRole,API_URI);
            //   var successData = apiCallGet('get', '/getIncompleteReferral/login_id='+this.loginId,API_URI);
            //     if (successData && Object.keys(successData)) {
            //         this.patchValue(successData);
            //     } else {
            //         console.error('error')
            //     }
            },

            navigatePage: function (route) {
                this.location.href = this.location.origin + route;
            },
            newReferral: function () {

            }
        }

    })

})