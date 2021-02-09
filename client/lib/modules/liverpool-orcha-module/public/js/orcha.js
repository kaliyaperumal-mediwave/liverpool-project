var API_URI = "/modules/liverpool-orcha-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#orchaPage',
        data: {
            paramValues: {},
            appObj:{}
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getUrlVars(location.href);
            //console.log(getUrlVars(location.href))
            this.getAppsDetail(this.paramValues.app_id);
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
        },

        methods: {
            getAppsDetail: function (appId) {
                //console.log(appId)
                var successData = apiCallGet('get', '/getApp/'+appId, API_URI);
                //console.log(successData)
                this.appObj = successData.data.result.smallAppCardInfo;
                console.log(this.appObj)
            }
        }

    })

})