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
                designedfor: "",
                subCategory: "",
                platform: "",
                cost: "",
                country: ""
            },
            searchQuery: null,
            selectedCapabilitiesList: []
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            $('#loader').hide();
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


            getSearchData: function (event) {
                $('#loader').show();
                let filter = {};
                let selectedCapabilitiesList = [];
                let selectedDesignedForList = [];
                let selectedCostList = [];
                var filterType = event.target.name;

                $.each($("input[name='capabilities']:checked"), function () {
                    selectedCapabilitiesList.push($(this).val());
                });
                if (selectedCapabilitiesList && selectedCapabilitiesList.length > 0) {
                    filter.capabilities = selectedCapabilitiesList;
                }

                $.each($("input[name='designedFor']:checked"), function () {
                    selectedDesignedForList.push($(this).val());
                });
                if (selectedDesignedForList && selectedDesignedForList.length > 0) {
                    filter.designedFor = selectedDesignedForList;
                }

                $.each($("input[name='cost']:checked"), function () {
                    selectedCostList.push($(this).val());
                });
                if (selectedCostList && selectedCostList.length > 0) {
                    filter.cost = selectedCostList;
                }

                if ($("#countrySelect").val()) {
                    filter.countryOfOrigin = $("#countrySelect").val();
                }
                if ($("#category_list").val()) {
                    filter.categories = $("#category_list").val();
                }
                if ($("#platformSelect").val()) {
                    filter.platform = $("#platformSelect").val();
                }
                var successData = apiCallPost('post', '/getSearchData/', filter);
                $('#loader').hide();
                console.log(successData)
            }
        }
    })
});
