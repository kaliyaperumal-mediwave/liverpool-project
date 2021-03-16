$(document).ready(function () {
    
    var app = new Vue({
        el: '#orchaHomePage',
        data: {
            searchReferrals: [],
        },

        mounted: function () {
            $('#loader').hide();
        },

        methods: {
            toggleArrow: function (e) {
            },
        }
    })
});
