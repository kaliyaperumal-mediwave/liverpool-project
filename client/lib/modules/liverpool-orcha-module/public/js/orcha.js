$(document).ready(function () {
    var app = new Vue({
        el: '#orchaPage',
        data: {

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

        }

    })

})