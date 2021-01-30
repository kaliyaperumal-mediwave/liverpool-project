$(document).ready(function () {
    var app = new Vue({
        el: '#ChangeTextSizePage',
        data: {
            textSizeData: ''
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
            changeTextSize: function() {
                console.log('clicked');
            }
        }

    })

})