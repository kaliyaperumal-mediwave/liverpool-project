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
            filterObj: {
                capability: "",
                designedfor: "",
                subCategory: "",
                platform: "",
                cost: "",
                country: ""
            },
            searchQuery: null,
            selectedCapabilitiesList: [],
            filteredAppsList: [],
            paginationObj: {
                totalItems: "",
                totalPages: "",
                currentPage: "",
                itemsPerPage: ""
            },
            numberList: [],
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            // $('#loader').hide();
            this.getFilterDataDropdown();
            this.getSearchData(undefined, undefined);
            var _self = this;
            $(".selectMultipleBE").change(function (e) {
                _self.getSearchData(undefined);
            });

            $('.selectpicker').change(function (e) {
                _self.getSearchData();
            });

        },

        methods: {
            getFilterDataDropdown: function (appId) {
                $('#loader').show();
                var _self = this;
                var successData = apiCallGet('get', '/getFilterData/', API_URI);
                setTimeout(function () {
                    $('#loader').hide();
                }, 1000);
                if (successData && Object.keys(successData)) {
                    _self.capabilityList = successData.data.capability_payload;
                    _self.designedForList = successData.data.designedFor_payload;
                    _self.subCategoryList = successData.data.subCategory_payload;
                    _self.platformList = successData.data.platform_payload;
                    _self.costList = successData.data.cost_payload;
                    _self.countryList = successData.data.country_payload;
                }
            },
            scrollXAndY: function (page) {
                if (page == "prev") {
                    document.getElementById('paginationDiv').scrollLeft -= 230;
                }
                else if (page == "next") {
                    document.getElementById('paginationDiv').scrollLeft += 230;
                }
            },
            getSearchData: function (e, page) {
                $('#loader').show();
                let filter = {};
                let selectedCapabilitiesList = [];
                let selectedDesignedForList = [];
                let selectedCostList = [];
                var selectedCountry = [];
                var selectedCategory = [];
                //mulit-select search with checkbox
                var capabilityValue = $("#capabilitiesDropdown").val();
                var designedForValue = $("#designedForDropdown").val();
                var costValue = $("#costDropdown").val();
                var countryValue = $("#countrySelect").val();
                var categoryValue = $("#category_list").val();

                if (capabilityValue != null) {
                    selectedCapabilitiesList.push(capabilityValue);
                }
                if (selectedCapabilitiesList && selectedCapabilitiesList.length > 0) {
                    filter.capabilities = selectedCapabilitiesList[0];
                }

                if (designedForValue != null) {
                    selectedDesignedForList.push(designedForValue);
                }

                if (selectedDesignedForList && selectedDesignedForList.length > 0) {
                    filter.designedFor = selectedDesignedForList[0];
                }

                if (costValue != null) {
                    selectedCostList.push(costValue);
                }

                if (selectedCostList && selectedCostList.length > 0) {
                    filter.cost = selectedCostList[0];
                }
                //single search - searchable drop down.

                if (countryValue != null) {
                    selectedCountry.push(countryValue);
                }
                if (selectedCountry && selectedCountry.length > 0) {
                    filter.country = selectedCountry;
                }
                if (categoryValue != null) {
                    selectedCategory.push(categoryValue);
                }
                if (selectedCategory && selectedCategory.length > 0) {
                    filter.subCategory = selectedCategory;
                }

                if ($("#category_list").val()) {
                    filter.subCategory = $("#category_list").val();
                }
                if ($("#platformSelect").val()) {
                    filter.platform = $("#platformSelect").val();
                }
                if ($("#searchTxt").val()) {
                    filter.keyword = $("#searchTxt").val();
                }
                if (page == "prev") {
                    filter.pageNum = Number(this.paginationObj.currentPage) - 1;
                }
                else if (page == "next") {
                    filter.pageNum = Number(this.paginationObj.currentPage) + 1;
                }
                else if (page) {
                    filter.pageNum = page
                }

                // //console.log(filter);
                var successData = apiCallPost('post', '/getSearchData/', filter);
                setTimeout(function () {
                    $('#loader').hide();
                }, 1000);

                //console.log(successData)
                if (successData && Object.keys(successData) && successData.data != null) {
                    this.paginationObj.totalItems = "";
                    this.paginationObj.totalPages = "";
                    this.paginationObj.currentPage = "";
                    this.paginationObj.itemsPerPage = "";
                    this.filteredAppsList = successData.data.result.items
                    if (successData.data.result.items.length > 0) {
                        this.paginationObj.totalItems = successData.data.result.pagingInfo.totalItems;
                        this.paginationObj.totalPages = successData.data.result.pagingInfo.totalPages;
                        this.paginationObj.currentPage = successData.data.result.pagingInfo.currentPage;
                        this.paginationObj.itemsPerPage = successData.data.result.pagingInfo.itemsPerPage;
                        var pagingInfo = successData.data.result.pagingInfo.totalPages;
                    }

                    this.numberList = [];
                    for (let i = 0; i < pagingInfo; i++) {
                        this.numberList.push(i)
                    }
                    //pagination
                    var pagId = Number(this.paginationObj.currentPage);
                    setTimeout(function () {
                        if (pagId > 0 && e != undefined) {
                            var paginationAllData = Array.from(document.getElementsByClassName('uniqueLinkSet'));
                            var pageId = e.target.id;
                            //console.log(paginationAllData, pageId);
                            paginationAllData.map(function (it) {
                                if (it.id == pageId) {
                                    it.classList.add("selectedClass");
                                } else {
                                    it.classList.remove("selectedClass");
                                }
                            })

                            //  document.getElementById("pageIndex" + pagId).classList.add("selectedClass")
                        }
                        if (pagId == 1 && e == undefined) {
                            document.getElementById("pageIndex0").classList.add("selectedClass")
                        }
                    }, 1000);
                }
                else {
                    this.filteredAppsList = [];
                }
            },
            reload: function() {
                window.location.reload();
            }
        }
    })


});
