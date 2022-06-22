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
            var switchElem = document.getElementById('test');
            var logoElem = document.getElementById('logoBgHome');

            if (localStorage.getItem('theme') == 'dark') {
                if (logoElem) {
                    logoElem.src = "/modules/my-apostrophe-assets/img/liverpool_dark.svg";
                }
                switchElem.value = localStorage.getItem('theme');
                switchElem.checked = true;

            } else if (localStorage.getItem('theme') == 'light') {
                if (logoElem) {
                    logoElem.src = "/modules/my-apostrophe-assets/img/liverpool.svg";
                }
                switchElem.checked = false;
            }
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
        },

        methods: {

            changeTheme: function (e) {
                if (e.target.checked) {
                    e.target.value = "dark";
                    var theme = 'on';
                    $('body').removeClass().addClass('net ' + theme).addClass('body-bg');
                    localStorage.setItem('theme', 'dark');
                }
                else {
                    e.target.value = "light"
                    var theme = 'off';
                    $('body').removeClass().addClass('net ' + theme).addClass('body-bg');
                    localStorage.setItem('theme', 'light');
                }
                setTimeout(function () {
                    $('#themeSuccessModal').modal('show');
                }, 400)
            },
        }

    })

})