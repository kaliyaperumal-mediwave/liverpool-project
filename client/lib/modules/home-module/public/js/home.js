$(document).ready(function () {
    new Vue({
        el: '#landing-page',
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

            themeChangerInit: function (e) {
                var $node = e.target;
                theme = $node.getAttribute('data-theme');
                $('.theme-wrapper').removeClass('net default small large').addClass('net ' + theme).addClass('body-bg');
            },

        }

    })

})