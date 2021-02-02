$(document).ready(function () {
    var app = new Vue({
        el: '#ChangeTextSizePage',
        data: {
            textSizeData: 19
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
            saveTextSize: function (size) {
                console.log('size', size);
                localStorage.setItem('textSize', size);
            }
        }

    })

})