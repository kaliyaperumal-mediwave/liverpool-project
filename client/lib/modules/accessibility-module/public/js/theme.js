$(document).ready(function () {
    var app = new Vue({
        el: '#themePage',
        data: {
            theme: ''
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

            changeTheme: function (e) {
                if (e.target.checked) {
                    theme = 'on';
                    $('body').removeClass().addClass('net ' + theme).addClass('body-bg');
                    localStorage.setItem('theme', 'dark');
                }
                else {
                    theme = 'off';
                    $('body').removeClass().addClass('net ' + theme).addClass('body-bg');
                    localStorage.setItem('theme', 'light');
                }
            },

            saveTheme: function () {
                localStorage.setItem('theme', selectedTheme);
                $('#themeSuccessModal').modal('show');
            },

            closeModal: function () {
                $('#themeSuccessModal').modal('hide');
            }
        }

    })

})