$(document).ready(function () {
    new Vue({
        el: '#landing-page',
        data: {
            location: window.location,
            searchQuery: null,
            filteredData: [],
            showSearchResults: false,
            resources: [],
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.resources = JSON.parse(document.getElementById('resources').value)
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
                if (this.searchQuery) {
                    this.filteredData = [];
                    this.showSearchResults = true;
                    return this.resources.filter(function (item) {
                        // TODO: add description and other content after CMS
                        if (this.searchQuery.toLowerCase().split(' ').every(function (v) {
                            return !!~item.title.toLowerCase().indexOf(v)
                        })) {
                            return this.filteredData;
                        }
                    })
                } else {
                    this.showSearchResults = false;
                    return this.filteredData = [];
                }
            }
        }

    })

})