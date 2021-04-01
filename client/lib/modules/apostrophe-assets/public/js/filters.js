
$(document).ready(function () {
    if (document.getElementById('filter_content')) {
        new Vue({
            el: '#filter_content',
            data: {
                searchQuery: null,
                searchQueryToLower: null,
                filteredData: [],
                showSearchResults: false,
                resources: [],
            },

            mounted: function () {

                try {
                    if (document.getElementById('resources') && document.getElementById('resources').value) {
                        this.resources = JSON.parse(document.getElementById('resources').value);
                    } else {
                        this.resources = [];
                    }
                } catch (error) {
                    $('#loader').hide();
                    console.log(error);
                }
            },

            methods: {
                filterPieces: function () {
                    // console.log(this.searchQuery, "this.searchQuerythis.searchQuery");
                    //console.log(this.searchQuery)
                    this.searchQueryToLower = this.searchQuery.toLowerCase();
                    if (this.searchQueryToLower) {
                        this.filteredData = [];
                        this.showSearchResults = true;
                        var self = this;
                        console.log('------------self.resources.filter----------',self.resources.filter);
                        return self.resources.filter(function (item) {
                            // TODO: add description and other content after CMS
                            // if (!!~item.title.toLowerCase().indexOf(self.searchQueryToLower)) {
                            //     self.filteredData.push(item);
                            // }
                            console.log('------item.Topic-------',item.Topic);
                            console.log('------item.Topic.toLowerCase()-------',item.Topic.toLowerCase());

                            if (item.Topic.toLowerCase() == 'watch') {
                                if (!!~item.SubTitle.toLowerCase().indexOf(self.searchQueryToLower)) {
                                    self.filteredData.push(item);
                                }
                            }
                            else if (item.Topic.toLowerCase() == 'read') {
                                if (!!~item.read_topic.toLowerCase().indexOf(self.searchQueryToLower)) {
                                    self.filteredData.push(item);
                                }
                            }
                            else if (item.Topic.toLowerCase() == 'games') {
                                if (!!~item.games_title.toLowerCase().indexOf(self.searchQueryToLower)) {
                                    self.filteredData.push(item);
                                }
                            }
                            else if (item.Topic.toLowerCase() == 'events') {
                                if (!!~item.eventsTopic.toLowerCase().indexOf(self.searchQueryToLower)) {
                                    self.filteredData.push(item);
                                }
                            }
                            else if (item.Topic.toLowerCase() == 'partneragencies') {
                                if (!!~item.partnerAgencies.toLowerCase().indexOf(self.searchQueryToLower)) {
                                    self.filteredData.push(item);
                                }
                            }
                            else {
                                if (!!~item.title.toLowerCase().indexOf(self.searchQueryToLower)) {
                                    self.filteredData.push(item);
                                }
                            }

                        //     if(item.Topic.toLowerCase()=='watch')
                        //     {
                        //         if (!!~item.SubTitle.toLowerCase().indexOf(self.searchQueryToLower)) {
                        //             self.filteredData.push(item);
                        //         }
                        //     }
                        //    else if(item.Topic.toLowerCase()=='read')
                        //     {
                        //         if (!!~item.read_topic.toLowerCase().indexOf(self.searchQueryToLower)) {
                        //             self.filteredData.push(item);
                        //         }
                        //     }
                        //     else if(item.Topic.toLowerCase()=='games')
                        //     {
                        //         if (!!~item.games_title.toLowerCase().indexOf(self.searchQueryToLower)) {
                        //             self.filteredData.push(item);
                        //         }
                        //     }
                        //     else if(item.Topic.toLowerCase()=='events')
                        //     {
                        //         if (!!~item.eventsTopic.toLowerCase().indexOf(self.searchQueryToLower)) {
                        //             self.filteredData.push(item);
                        //         }
                        //     }
                        //     else if(item.Topic.toLowerCase()=='partneragencies')
                        //     {
                        //         if (!!~item.partnerAgencies.toLowerCase().indexOf(self.searchQueryToLower)) {
                        //             self.filteredData.push(item);
                        //         }
                        //     }
                        //     else
                        //     {
                        //         if (!!~item.title.toLowerCase().indexOf(self.searchQueryToLower)) {
                        //             self.filteredData.push(item);
                        //         }
                        //     }
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
