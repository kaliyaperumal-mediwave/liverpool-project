var API_URI = "/modules/orcha-module";
$(document).ready(function () {

    var app = new Vue({
        el: '#orchaNewHomePage',
        components: {
            Multiselect: window.VueMultiselect.default
        },
        data: {
            categoryValue: null,
            countryValue: null,
            capabilityValue: null,
            designedForValue: null,
            costValue: null,
            platformValue: null,
            checkBoxTest: null,
            categoryList: [],
            countryList: [],
            capabilityList: [],
            designedForList: [],
            costList: [],
            platformList: []
        },

        beforeMount: function () {
            $('#loader').show();
        },
        mounted: function () {
            this.getAllDataForDropdown();
            $('#loader').hide();
        },

        methods: {
            getAllDataForDropdown: function () {
                var successData = apiCallGet('get', '/getFilterData/', API_URI);
                if (successData && Object.keys(successData)) {
                    console.log(successData);
                    this.categoryList = successData.data.subCategory_payload;
                    this.countryList = successData.data.country_payload;
                    this.capabilityList = successData.data.capability_payload;
                    this.designedForList = successData.data.designedFor_payload;
                    this.costList = successData.data.cost_payload;
                    this.platformList = successData.data.platform_payload;
                } else {
                    $('#loader').hide();
                }
            },

            selectOptions: function (e) {
                debugger
                console.log(e);
            },

            removeOptions: function (option) {
                debugger
                console.log("Removed", option);

            }
        }
    })
});
