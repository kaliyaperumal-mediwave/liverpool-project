$(document).ready(function () {
    new Vue({
        el: '#wellBeing-page',
        data: {
            location: window.location
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {

            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
        },

        methods: {

            navigatePage: function (route) {
                this.location.href = this.location.origin + route;
            },
        }

    })

})