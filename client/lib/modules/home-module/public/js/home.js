$(document).ready(function () {
    new Vue({
        el: '#landing-page',
        data: {
            location: window.location,
            searchQuery: null,
            searchQueryToLower:null,
            filteredData: [],
            showSearchResults: false,
            resources: [],
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            try {
                if(document.getElementById('resources') && document.getElementById('resources').value) {
                    this.resources = JSON.parse(document.getElementById('resources').value);
                } else {
                    this.resources = [];
                }
            } catch (error) {
                $('#loader').hide();
                console.log(error);
            }
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
        },

        methods: {

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