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
            //document.getElementById('bebd7580-30a2-4ba6-9c36-1687d292d5da').style.pointerEvents = 'none';

        },

        mounted: function () {
            console.log(document.getElementById('logId').innerHTML)
            var _self = this;
            setTimeout(function () {
                $('#loader').hide();
                $('#piecesLoader').hide();
                _self.loadPiecesData();
            }, 1000);
        },

        methods: {

            loadPiecesData: function () {
                var _self = this;
                $('#piecesLoader').show();
                $.ajax({
                    url: API_URI + "/getPiecesData",
                    type: 'get',
                    async: true,
                    success: function (response) {
                        $('#piecesLoader').hide();
                        _self.resources = response.data.searchData;
                        console.log(_self.resources)
                        // document.getElementById('bebd7580-30a2-4ba6-9c36-1687d292d5da').style.pointerEvents = 'apply';
                    },
                    error: function (err) {
                        $('#piecesLoader').hide();
                        // document.getElementById('bebd7580-30a2-4ba6-9c36-1687d292d5da').style.pointerEvents = 'apply';
                        //console.log(err)
                    },
                })
            },

            navigatePage: function (route) {
                if(route === '/users/login' || route === '/make-referral'|| route === '/resources'){
                    var iFrameDetection = (window === window.parent) ? false : true;
                    if(iFrameDetection){
                        window.open(this.location.origin + route, '_blank');
                        return false;
                    }
                } 
                this.location.href = this.location.origin + route;
            },

            themeChangerInit: function (e) {
                var $node = e.target;
                theme = $node.getAttribute('data-theme');
                $('.theme-wrapper').removeClass('net default small large').addClass('net ' + theme).addClass('body-bg');
            },
            filterPieces: function () {
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