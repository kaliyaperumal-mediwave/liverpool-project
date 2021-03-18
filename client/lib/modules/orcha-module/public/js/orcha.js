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
            showAppContent: false
        },
        beforeMount: function () {
           $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getUrlVars(location.href);
            this.getAppsDetail(this.paramValues.app_id);
            // setTimeout(function () {
            //     $('#loader').hide();
            // }, 1000);
            try {
                if(document.getElementById('resources') && document.getElementById('resources').value) {
                    this.resources = JSON.parse(document.getElementById('resources').value);
                } else {
                    this.resources = [];
                }
            } catch (error) {
                // $('#loader').hide();
            }
        },

        methods: {
            getAppsDetail: function (appId) {
                var successData = apiCallGet('get', '/getApp/'+appId, API_URI);
                this.appObj = JSON.parse(JSON.stringify(successData.data.result));
                this.appObj.categoryName = this.appObj.subCategories && this.appObj.subCategories.length ? this.appObj.subCategories.join(', ') : '';
                this.appObj.review_date = moment(this.appObj.reviewDate).format("DD/MM/YYYY");
                this.appObj.release_date = moment(this.appObj.releaseDate).format("DD/MM/YYYY");
                this.appObj.file_size = Math.round(this.appObj.fileSize / 1024) + ' MB';
                this.appObj.data_privacy_score = parseInt(this.appObj.smallAppCardInfo.dataPrivacyScore);
                this.appObj.clinical_assurance_score = parseInt(this.appObj.smallAppCardInfo.clinicalAssuranceScore);
                this.appObj.user_experience_score = parseInt(this.appObj.smallAppCardInfo.userExperienceScore);
                if(!this.appObj.screenshots || (this.appObj.screenshots && this.appObj.screenshots.length && this.appObj.screenshots[0] == "")) {
                    this.appObj.screenshots = [];
                }
                this.showAppContent = true;
                $('#loader').hide();
            },
            filterApps: function () {
                this.searchQueryToLower = this.searchQuery.toLowerCase();
                if (this.searchQueryToLower) {
                    this.filteredData = [];
                    this.showSearchResults = true;
                    let self = this;
                    return self.resources.filter(function (item) {
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
            toggleArrow: function (e, section, allData) {
                var ele = e.target;
                var elemId = e.target.id;
                var allToggleIcons = Array.from(document.getElementsByClassName('arrowClass'));
                allToggleIcons.filter(function (i) {
                    if (i.id == elemId) {
                        if (Array.from(ele.classList).indexOf('fa-chevron-circle-up') > -1) {
                            $(ele).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                        } else {
                            $(ele).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                        }
                    } else {
                        $(i).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                    }
                });
            },
        },

    })

})