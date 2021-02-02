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
            var switchElem = document.getElementById('switchId');
            switchElem.setAttribute('checked', false);
            if (localStorage.getItem('theme')) {
                this.theme = localStorage.getItem('theme');
            }
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
        },

        methods: {

            changeTheme: function (e) {
                if (e.target.checked) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
                else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                }
            },

            saveTheme: function (selectedTheme) {
                localStorage.setItem('theme', selectedTheme);
                $('#themeSuccessModal').modal('show');
            },

            closeModal: function () {
                $('#themeSuccessModal').modal('hide');
            }
        }

    })

})