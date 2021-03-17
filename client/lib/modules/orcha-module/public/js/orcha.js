var API_URI = "/modules/liverpool-orcha-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#orchaDetailPage',
        data: {
            paramValues: {},
            appObj:{},
            searchQuery: null,
            filteredData: [],
            showSearchResults: false,
            resources: [],
            searchQueryToLower:null,
        },
        beforeMount: function () {
           // $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getUrlVars(location.href);
            console.log(getUrlVars(location.href))
            this.getAppsDetail(this.paramValues.app_id);
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
            try {
                if(document.getElementById('resources') && document.getElementById('resources').value) {
                    this.resources = JSON.parse(document.getElementById('resources').value);
                } else {
                    this.resources = [];
                }
            } catch (error) {
                console.log(error);
                $('#loader').hide();
            }
        },

        methods: {
            getAppsDetail: function (appId) {
                //console.log(appId)
                var successData = apiCallGet('get', '/getApp/'+appId, API_URI);
                console.log(successData)
                this.appObj = successData.data.result.smallAppCardInfo;
                console.log(this.appObj)
            },
            filterApps: function () {
                // console.log(this.searchQuery, "this.searchQuerythis.searchQuery");
                this.searchQueryToLower = this.searchQuery.toLowerCase();
                if (this.searchQueryToLower) {
                    this.filteredData = [];
                    this.showSearchResults = true;
                    let self = this;
                   // console.log(self.resources)
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
        }

    })

})