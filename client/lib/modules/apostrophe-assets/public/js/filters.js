
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
                
                try {
                    if(document.getElementById('resources') && document.getElementById('resources').value) {
                        this.resources = JSON.parse(document.getElementById('resources').value);
                    } else {
                        this.resources = [];
                    }
                } catch (error) {
                    console.log(error);
                }
            },

            methods: {
                filterPieces: function () {
                    // console.log(this.searchQuery, "this.searchQuerythis.searchQuery");
                    if (this.searchQuery) {
                        this.filteredData = [];
                        this.showSearchResults = true;
                        let self = this;
                        return self.resources.filter(function (item) {
                            // TODO: add description and other content after CMS
                            if (!!~item.title.toLowerCase().indexOf(self.searchQuery)) {
                                self.filteredData.push(item);
                            }
                            return self.filteredData
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