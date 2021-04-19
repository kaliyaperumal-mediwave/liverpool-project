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
            },
            patchCategory: [],
            patchDesignedFor: [],
            patchCost: [],

        },

        beforeMount: function () {
            $('#orchaLoader').show();
        },
        mounted: function () {
            //console.log(JSON.parse(localStorage.getItem("orFilData")));
            this.getAllDataForDropdown();
            $('#orchaLoader').hide();
        },

        methods: {
            getAllDataForDropdown: function () {
                var successData = apiCallGet('get', '/getFilterData/', API_URI);
                if (successData && Object.keys(successData)) {
                    //console.log(successData);
                    this.categoryList = successData.data.subCategory_payload;
                    this.countryList = successData.data.country_payload;
                    this.capabilityList = successData.data.capability_payload;
                    this.designedForList = successData.data.designedFor_payload;
                    this.costList = successData.data.cost_payload;
                    this.platformList = successData.data.platform_payload;

                    this.paramValues = getParameter(location.href);
                    // var emptyPayload = {};

                    emptyPayload = JSON.parse(localStorage.getItem("orFilData"));
                   // console.log("isEmptyObj : "+ this.isEmptyObj(emptyPayload))
                    var isEmpty = this.isEmptyObj(emptyPayload)

                    if(!isEmpty)
                    {
                        emptyPayload = JSON.parse(localStorage.getItem("orFilData"));
                        if(emptyPayload.capabilities.length>0)
                        {
                            for (i = 0; i < emptyPayload.capabilities.length; i++) {
                                this.patchCategory.push(this.capabilityList.find(capabilityList => capabilityList.id === (emptyPayload.capabilities[i])));
                            }
                            this.capabilityValue = this.patchCategory;
                        }

                        if(emptyPayload.designedFor.length>0)
                        {
                            for (i = 0; i < emptyPayload.designedFor.length; i++) {
                                this.patchDesignedFor.push(this.designedForList.find(designedForList => designedForList.id === (emptyPayload.designedFor[i])));
                            }
                            this.designedForValue = this.patchDesignedFor;
                        }

                        if(emptyPayload.cost.length>0)
                        {
                            for (i = 0; i < emptyPayload.cost.length; i++) {
                                this.patchCost.push(this.costList.find(costList => costList.id === (emptyPayload.cost[i])));
                            }
                            this.costValue = this.patchCost;
                        }

                        this.categoryValue = this.categoryList.find(categoryList => categoryList.id === emptyPayload.subCategory);
                        this.platformValue = this.platformList.find(platformList => platformList.id === emptyPayload.platform);
                        document.getElementById('clearFilterButton').removeAttribute('disabled');
                    }
                    else
                    {
                        emptyPayload = {};
                    }
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
                // document.getElementById('clearFilterButton').setAttribute('disabled', true);
                var emptyPayload = {};
                var payloadData = {
                    subCategory: '',
                    country: [],
                    capabilities: [],
                    designedFor: [],
                    cost: [],
                    platform: '',
                    pageNum: undefined
                };
                document.getElementById('clearFilterButton').setAttribute('disabled', true);
                localStorage.removeItem("orFilData");
                this.payloadData = payloadData;
                this.getOrchaAppsData(emptyPayload);
            },

            // close: function(e) {
            //     console.log(e);
            //     var moreText = e.id + '+'
            //     var dynamicMoreText = $('.multiselect__strong');
            //     dynamicMoreText.text(moreText);
            // },

            selectOptions: function (e, type) {

                $('#orchaLoader').show();
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
                document.getElementById('clearFilterButton').removeAttribute('disabled');
                this.payloadData.pageNum = undefined;
                this.getOrchaAppsData(this.payloadData)
            },

            getOrchaAppsData: function (payload) {
                $('#orchaLoader').show();
                //console.log(payload)
                localStorage.setItem("orFilData", JSON.stringify(payload));
                var successData = apiCallPost('post', '/getSearchData/', payload);
                if (successData && Object.keys(successData)) {
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
                if (!this.payloadData.subCategory && !this.payloadData.country.length && !this.payloadData.capabilities.length && !this.payloadData.designedFor.length &&
                    !this.payloadData.cost.length && !this.payloadData.platform) {
                    document.getElementById('clearFilterButton').setAttribute('disabled', true);
                } else {
                    document.getElementById('clearFilterButton').removeAttribute('disabled');
                }
                this.payloadData.pageNum = "";
                this.getOrchaAppsData(this.payloadData)

            },

            handleError: function (e) {
                e.target.src = "/modules/my-apostrophe-assets/img/no-img.svg";
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
                //console.log(page);
                var pagePayload = {
                    pageNum: page,
                    // subCategory: this.payloadData.subCategory,
                    // country:this.payloadData.country,
                    // capabilities:this.payloadData.capabilities,
                    // designedFor:this.payloadData.designedFor,
                    // cost:this.payloadData.cost,
                    // platform:this.payloadData.platform
                }
                this.payloadData.pageNum = page
                //this.payloadData.pageNum = page;
                this.getOrchaAppsData(this.payloadData);
                // this.getOrchaAppsData(payloadData);
            },

            isEmptyObj: function (obj) {
                var isEmpty = true;
                for (x in obj) {
                    isEmpty = false;
                    break;
                }
                return isEmpty;
            }
        }
    })
});
