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
            $('#orchaLoader').removeClass('d-none').addClass('d-block');
        },
        mounted: function () {
            //console.log(JSON.parse(localStorage.getItem("orFilData")));
            this.getAllDataForDropdown();
            $('#orchaLoader').removeClass('d-block').addClass('d-none');
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

                    if (!isEmpty) {
                        emptyPayload = JSON.parse(localStorage.getItem("orFilData"));
                        if (emptyPayload.capabilities.length > 0) {
                            let self = this;
                            for (i = 0; i < emptyPayload.capabilities.length; i++) {
                               // this.patchCategory.push(this.capabilityList.find(capabilityList => capabilityList.id === (emptyPayload.capabilities[i])));
                                this.capabilityList.filter(function (item) {
                                    if (item.id==emptyPayload.capabilities[i]) {
                                        self.patchCategory.push(item)
                                    }
                                })
                            }
                            this.capabilityValue = self.patchCategory;
                        }

                        if (emptyPayload.designedFor.length > 0) {
                            let self = this;
                            for (i = 0; i < emptyPayload.designedFor.length; i++) {
                                //this.patchDesignedFor.push(this.designedForList.find(designedForList => designedForList.id === (emptyPayload.designedFor[i])));
                                this.designedForList.filter(function (item) {
                                    if (item.id==emptyPayload.designedFor[i]) {
                                        self.patchDesignedFor.push(item)
                                    }
                                })
                            }
                            this.designedForValue = self.patchDesignedFor;
                        }

                        if (emptyPayload.cost.length > 0) {
                            let self = this;
                            for (i = 0; i < emptyPayload.cost.length; i++) {
                               // this.patchCost.push(this.costList.find(costList => costList.id === (emptyPayload.cost[i])));
                                this.costList.filter(function (item) {
                                    if (item.id==emptyPayload.cost[i]) {
                                        self.patchCost.push(item)
                                    }
                                })
                            }
                            this.costValue = self.patchCost;
                        }

                       // this.categoryValue = this.categoryList.find(categoryList => categoryList.id === emptyPayload.subCategory);
                       let _self = this;
                       this.categoryList.filter(function (item) {
                        if (item.id==emptyPayload.subCategory) {
                            _self.categoryValue = item;
                        }
                      })

                        //this.platformValue = this.platformList.find(platformList => platformList.id === emptyPayload.platform);
                        this.platformList.filter(function (item) {
                            if (item.id==emptyPayload.platform) {
                                _self.platformValue = item;
                            }
                          })
                        document.getElementById('clearFilterButton').removeAttribute('disabled');
                    }
                    else {
                        emptyPayload = {};
                    }
                    this.getOrchaAppsData(emptyPayload);

                } else {
                    $('#orchaLoader').removeClass('d-block').addClass('d-none');
                }
            },

            resetFilters: function () {
                $('#orchaLoader').removeClass('d-none').addClass('d-block');
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

                $('#orchaLoader').removeClass('d-none').addClass('d-block');
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

            // getOrchaAppsData: function (payload) {
            //      $('#orchaLoader').removeClass('d-none').addClass('d-block');
            //     localStorage.setItem("orFilData", JSON.stringify(payload));
            //     var successData = apiCallPost('post', '/getSearchData/', payload);
            //     if (successData && Object.keys(successData)) {
            //         if (successData.data.result.items.length) {
            //             this.filteredAppsList = successData.data.result.items;
            //         } else {
            //             this.filteredAppsList = [];
            //         }
            //         if (successData.data.result.pagingInfo) {
            //             this.paginationData.currentPage = successData.data.result.pagingInfo.currentPage;
            //             this.paginationData.perPage = successData.data.result.pagingInfo.itemsPerPage;
            //             this.paginationData.totalItems = successData.data.result.pagingInfo.totalItems;
            //         } else {
            //             this.paginationData.currentPage = null;
            //             this.paginationData.perPage = null;
            //             this.paginationData.totalItems = null;
            //         }
            //            $('#orchaLoader').removeClass('d-block').addClass('d-none');

            //     } else {
            //            $('#orchaLoader').removeClass('d-block').addClass('d-none');
            //     }

            // },

            getOrchaAppsData: function (payload) {
                var _self = this;
                localStorage.setItem("orFilData", JSON.stringify(payload));
                var trimmedPayload = trimObj(payload);
                $.ajax({
                    url: API_URI + '/getSearchData/',
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    //async: false,
                    data: JSON.stringify(trimmedPayload),
                    cache: false,
                    success: function (res) {
                        var successData = res;
                        if (successData && Object.keys(successData)) {
                            if (successData.data && successData.data.result.items.length) {
                                _self.filteredAppsList = successData.data.result.items;
                            } else {
                                _self.filteredAppsList = [];
                            }
                            if ( successData.data  && successData.data.result.pagingInfo) {
                                _self.paginationData.currentPage = successData.data.result.pagingInfo.currentPage;
                                _self.paginationData.perPage = successData.data.result.pagingInfo.itemsPerPage;
                                _self.paginationData.totalItems = successData.data.result.pagingInfo.totalItems;
                            } else {
                                _self.paginationData.currentPage = null;
                                _self.paginationData.perPage = null;
                                _self.paginationData.totalItems = null;
                            }
                            $('#orchaLoader').removeClass('d-block').addClass('d-none');
                        } else {
                            $('#orchaLoader').removeClass('d-block').addClass('d-none');
                        }
                    },
                    error: function (error) {
                        $('#orchaLoader').removeClass('d-block').addClass('d-none');
                        if (error) {
                            showError(error.responseJSON.message, error.status);
                        }
                    }
                });
            },

            removeOptions: function (option, type) {
                $('#orchaLoader').removeClass('d-none').addClass('d-block');
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
                    var searchPayload = {
                        keyword: this.searchText
                    }
                    $('#orchaLoader').removeClass('d-none').addClass('d-block');
                    this.getOrchaAppsData(searchPayload);
                } else {
                    $('#orchaLoader').removeClass('d-none').addClass('d-block');
                    this.getOrchaAppsData(searchPayload);
                    document.getElementById("searchTxt").focus();
                    document.getElementById("searchTxt").select();
                }

            },

            updatePage: function (page) {
                $('#orchaLoader').removeClass('d-none').addClass('d-block');
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
