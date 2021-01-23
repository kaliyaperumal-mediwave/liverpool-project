// var API_URI = "/modules/auth-module";
$(document).ready(function () {
    new Vue({
        el: '#confirmationEmail',
        data: {

        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var _self = this;
            setTimeout(function () {
                $('#loader').hide();
            }, 700);
        },

        methods: {

            navigatePage: function (route) {
                window.location.href = window.location.origin + route;
            },

        }
    })

});