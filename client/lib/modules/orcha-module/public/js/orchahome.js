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
            paginationObj:{
                totalItems:"",
                totalPages: "",
                currentPage: "",
                itemsPerPage: ""
            },
            numberList:[],
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            $('#loader').hide();
            this.getFilterDataDropdown();
            this.getSearchData(1);
            var _self = this;
            $(".selectMultipleBE").change(function (e) {
                _self.getSearchData(1);
            });

           // this.numberList = ["1","2","3"]

            // var categorySelect = document.getElementsByClassName('categoryS');
            // var elem = categorySelect[0].children[0];

            // $('#category_list').change(function (e) {
            //     _self.getSearchData();
            // });
        },

        methods: {
            getFilterDataDropdown: function (appId) {
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
            },

            getSearchData: function (numObj) {
                alert(7);
                let filter = {};
                let selectedCapabilitiesList = [];
                let selectedDesignedForList = [];
                let selectedCostList = [];
                //mulit-select search with checkbox
                var capabilityValue = $("#capabilitiesDropdown").val();
                var designedForValue = $("#designedForDropdown").val();
                var costValue = $("#costDropdown").val();

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
                if ($("#countrySelect").val()) {
                    filter.countryOfOrigin = $("#countrySelect").val();
                }
                if ($("#category_list").val()) {
                    filter.categories = $("#category_list").val();
                }
                if ($("#platformSelect").val()) {
                    filter.platform = $("#platformSelect").val();
                }
                if ($("#searchTxt").val()) {
                    filter.keyword = $("#searchTxt").val();
                }

                console.log(filter);
                var successData = apiCallPost('post', '/getSearchData/', filter);
                $('#loader').hide();
                console.log(successData)
                if (successData && Object.keys(successData) && successData.data != null) {
                    this.filteredAppsList = successData.data.result.items
                    this.paginationObj.totalItems = successData.data.result.pagingInfo.totalItems;
                    this.paginationObj.totalPages = successData.data.result.pagingInfo.totalPages;
                    this.paginationObj.currentPage = successData.data.result.pagingInfo.currentPage;
                    this.paginationObj.itemsPerPage = successData.data.result.pagingInfo.itemsPerPage;

                    var pagingInfo = successData.data.result.pagingInfo.totalPages;
                    var obj = {};
                    for (let i = 0; i < pagingInfo; i++) {
                      this.numberList.push(i) 
                    }
                }
                else {
                    this.filteredAppsList = [];
                }
            }
        }
    })


});
