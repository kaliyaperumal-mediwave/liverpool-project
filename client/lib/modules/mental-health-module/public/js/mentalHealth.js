$(document).ready(function () {
    new Vue({
        el: '#mentalHealthPage',
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
                this.location.href = route;
            },
            filterPieces: function () {
                console.log(this.searchQuery, "this.searchQuerythis.searchQuery");
                if (this.searchQuery) {
                    this.filteredData = [];
                    this.showSearchResults = true;
                    return this.resources.filter((item) => {
                        // TODO: add description and other content after CMS
                        if (this.searchQuery.toLowerCase().split(' ').every(v => item.title.toLowerCase().includes(v))) {
                            this.filteredData.push(item)
                        }
                        return this.filteredData
                    })
                } else {
                    this.showSearchResults = false;
                    return this.filteredData = [];
                }
            }
        }

    })

})