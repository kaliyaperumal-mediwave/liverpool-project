var API_URI = "/modules/orcha-module";
$(document).ready(function () {

    var app = new Vue({
        el: '#orchaHomePage',
        data: {
            capabilityList: [],
            designedForList: [],
            subCategoryList: [],
            platformList: [],
            costList: [],
            countryList: [],
            fitlerObj: {
                capability: "",
                designedfor:"",
                subCategory:"",
                platform:"",
                cost:"",
                country:""
            }
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            console.log("orchaHomePage vue loaded")
            this.getFilterDataDropdown();
        },

        methods: {
            getFilterDataDropdown: function (appId) {
                //console.log(appId)
                var _self = this;
                var successData = apiCallGet('get', '/getFilterData/', API_URI);
                console.log(successData)
                if (successData && Object.keys(successData)) {
                    _self.capabilityList = successData.data.capability_payload;
                    _self.designedForList = successData.data.designedFor_payload;
                    _self.subCategoryList = successData.data.subCategory_payload;
                    _self.platformList = successData.data.platform_payload;
                    _self.costList = successData.data.cost_payload;
                    _self.countryList = successData.data.country_payload;
                }
                else {

                }
            },


            getSearchData: function () {
                console.log(this.fitlerObj)
                $('#loader').show();
                var successData = apiCallPost('post', '/getSearchData/', this.fitlerObj);
                $('#loader').hide();
                console.log(successData)
            }
        }
    })
});
