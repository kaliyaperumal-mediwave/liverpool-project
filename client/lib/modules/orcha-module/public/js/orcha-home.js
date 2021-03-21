var API_URI = "/modules/orcha-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#orchaNewHomePage',
        components: {
            Multiselect: window.VueMultiselect.default,
            paginate: VuejsPaginate
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
            platformList: [],
            filteredAppsList: [],
            payloadData: {
                subCategory: '',
                country: [],
                capabilities: [],
                designedFor: [],
                cost: [],
                platform: ''
            },
            currentPage: 0,
            perPage: 10,
            totalItems: 50
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

            selectOptions: function (e, type) {
                console.log(e);
                if (type == 'category') {
                    this.payloadData.subCategory = e.id;
                }
                if (type == 'country') {
                    this.payloadData.country = [e.id];
                }
                if (type == 'capability') {
                    this.payloadData.capabilities.push(e.id);
                }
                if (type == 'designedFor') {
                    this.payloadData.designedFor.push(e.id);
                }
                if (type == 'cost') {
                    this.payloadData.cost.push(e.id);
                }
                if (type == 'platform') {
                    this.payloadData.platform = e.id;
                }
                console.log('capabilities', this.payloadData)
            },

            getOrchaAppsData: function (payload) {
                var successData = apiCallPost('post', '/getSearchData/', payload);
                console.log(successData);
                this.filteredAppsList = successData.data.result.items
            },

            removeOptions: function (option, type) {
                debugger
                console.log("Removed", option);
                if (type == 'category') {
                    this.payloadData.subCategory = '';
                }
                if (type == 'country') {
                    this.payloadData.country = [];
                }
                if (type == 'capability') {
                    if (this.payloadData.capabilities.indexOf(option.id) != 1) {
                        var index = this.payloadData.capabilities.indexOf(option.id);
                        this.payloadData.capabilities.splice(index, 1);
                    }
                }
                if (type == 'designedFor') {
                    if (this.payloadData.designedFor.indexOf(option.id) != 1) {
                        var index = this.payloadData.designedFor.indexOf(option.id);
                        this.payloadData.designedFor.splice(index, 1);
                    }
                }
                if (type == 'cost') {
                    if (this.payloadData.cost.indexOf(option.id) != 1) {
                        var index = this.payloadData.cost.indexOf(option.id);
                        this.payloadData.cost.splice(index, 1);
                    }
                }
                if (type == 'platform') {
                    this.payloadData.platform = '';
                }

                console.log(this.payloadData);

            },

            prev: function (e) {
                console.log(e);
            },

            next: function (e) {
                console.log(e);
            },

            clickCallback: function (e) {
                console.log(e);
            }
        }
    })
});
