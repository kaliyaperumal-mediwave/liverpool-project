var API_URI = "/modules/orcha-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#orchaNewHomePage',
        components: {
            Multiselect: window.VueMultiselect.default,
            //paginate: VuejsPaginate
        },
        data: {
            searchText: '',
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
                platform: '',
                pageNum: undefined
            },
            paginationData: {
                currentPage: null,
                perPage: null,
                totalItems: null,
            }

        },

        beforeMount: function () {
            $('#orchaLoader').show();
        },
        mounted: function () {
            this.getAllDataForDropdown();
            $('#orchaLoader').hide();
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
                    var emptyPayload = {};
                    this.getOrchaAppsData(emptyPayload);

                } else {
                    $('#orchaLoader').hide();
                }
            },

            resetFilters: function () {
                $('#orchaLoader').show();
                this.searchText = '';
                this.categoryValue = null;
                this.countryValue = null;
                this.capabilityValue = null;
                this.designedForValue = null;
                this.costValue = null;
                this.platformValue = null;
                this.checkBoxTest = null;
                var emptyPayload = {};
                this.getOrchaAppsData(emptyPayload);
            },

            selectOptions: function (e, type) {
                $('#orchaLoader').show();
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
                console.log('capabilities', this.payloadData);
                this.getOrchaAppsData(this.payloadData)
            },

            getOrchaAppsData: function (payload) {
                var successData = apiCallPost('post', '/getSearchData/', payload);
                if (successData && Object.keys(successData)) {
                    console.log(successData);
                    if (successData.data.result.items.length) {
                        this.filteredAppsList = successData.data.result.items;
                    } else {
                        this.filteredAppsList = [];
                    }
                    if (successData.data.result.pagingInfo) {
                        this.paginationData.currentPage = successData.data.result.pagingInfo.currentPage;
                        this.paginationData.perPage = successData.data.result.pagingInfo.itemsPerPage;
                        this.paginationData.totalItems = successData.data.result.pagingInfo.totalItems;
                    } else {
                        this.paginationData.currentPage = null;
                        this.paginationData.perPage = null;
                        this.paginationData.totalItems = null;
                    }

                    $('#orchaLoader').hide();

                } else {
                    $('#orchaLoader').hide();
                }

            },

            removeOptions: function (option, type) {
                $('#orchaLoader').show();
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
                this.getOrchaAppsData(this.payloadData)

            },

            handleError: function (e) {
                console.log(e.target);
                e.target.src = "/modules/my-apostrophe-assets/img/noimg.svg";
                e.target.style.height = 50;
                e.target.style.width = 50;
            },

            searchOrchPage: function () {
                if (this.searchText) {
                    $('#orchaLoader').show();
                    var searchPayload = {
                        keyword: this.searchText
                    }
                    this.getOrchaAppsData(searchPayload);
                } else {
                    document.getElementById("searchTxt").focus();
                    document.getElementById("searchTxt").select();

                }

            },

            updatePage: function (page) {
                $('#orchaLoader').show();
                var pagePayload = {
                    pageNum: page
                }
                //this.payloadData.pageNum = page;
                //this.getOrchaAppsData(this.payloadData);
                this.getOrchaAppsData(pagePayload);
            },
        }
    })
});
