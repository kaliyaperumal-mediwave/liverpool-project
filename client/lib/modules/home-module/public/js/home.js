$(document).ready(function () {
    new Vue({
        el: '#landing-page',
        data: {
            location: window.location
        },
        mounted: function () {
            console.log('mounted');
        },

        methods: {

            navigatePage: function (route) {
                this.location.href = this.location.origin + route;
            },
        }

    })

})