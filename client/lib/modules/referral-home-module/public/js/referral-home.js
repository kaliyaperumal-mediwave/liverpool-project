var API_URI = "/modules/dashboard-module";
$(document).ready(function () {
    new Vue({
        el: '#referralHomePage',
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