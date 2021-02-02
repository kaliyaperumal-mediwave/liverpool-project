$(document).ready(function () {
    var app = new Vue({
        el: '#ChangeTextSizePage',
        data: {
            textSizeData: 19
        },
        beforeMount: function () {
            if(localStorage.getItem('textSize')) {
                this.textSizeData = localStorage.getItem('textSize');
            }
            $('#loader').show();
        },

        mounted: function () {
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
        },

        methods: {
            saveTextSize: function (size) {
                localStorage.setItem('textSize', size);
                $('#textSizeSuccessLabel').modal('show');
                setTimeout(function () {
                    $('#textSizeSuccessLabel').modal('hide');
                }, 1000);
            }
        }

    })

})