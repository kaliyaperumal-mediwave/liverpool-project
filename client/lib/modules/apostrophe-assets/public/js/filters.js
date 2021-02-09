
$(document).ready(function () {
    if (document.getElementById('filter_content')) {
        new Vue({
            el: '#filter_content',
            data: {
                searchQuery: null,
                filteredData: [],
                showSearchResults: false,
                resources: [],
            },

            mounted: function () {
                this.resources = JSON.parse(document.getElementById('resources').value)
            },

            methods: {
                filterPieces: function () {
                   // console.log(this.searchQuery, "this.searchQuerythis.searchQuery");
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
                },
            },
        })
    }


});