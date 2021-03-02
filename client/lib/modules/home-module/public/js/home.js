var API_URI = "/modules/home-module";
$(document).ready(function () {
    new Vue({
        el: '#landing-page',
        data: {
            location: window.location,
            searchQuery: null,
            searchQueryToLower: null,
            filteredData: [],
            showSearchResults: false,
            resources: [],
        },
        beforeMount: function () {
            $('#loader').show();
            $('#piecesLoader').show();
            
        },

        mounted: function () {
            var _self = this;
            setTimeout(function () {
                $('#loader').hide();
                $('#piecesLoader').hide();
                _self.loadPiecesData();
            }, 1000);
        },

        methods: {
            loadPiecesData: function () {
                console.log("api call start")
                $('#piecesLoader').show();
                var successData = apiCallGet('get', '/getPiecesData', API_URI);
                console.log(successData.data.searchData);
                this.resources = successData.data.searchData;
                $('#piecesLoader').hide();
            },

            navigatePage: function (route) {
                this.location.href = this.location.origin + route;
            },

            themeChangerInit: function (e) {
                var $node = e.target;
                theme = $node.getAttribute('data-theme');
                $('.theme-wrapper').removeClass('net default small large').addClass('net ' + theme).addClass('body-bg');
            },
            filterPieces: function () {
                // console.log(this.searchQuery, "this.searchQuerythis.searchQuery");
                this.searchQueryToLower = this.searchQuery.toLowerCase();
                if (this.searchQueryToLower) {
                    this.filteredData = [];
                    this.showSearchResults = true;
                    let self = this;
                    return self.resources.filter(function (item) {
                        // TODO: add description and other content after CMS
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
        }

    })

})