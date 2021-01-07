$(document).ready(function () {
    new Vue({
        el: '#privacyPage',
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
        }

    })

})