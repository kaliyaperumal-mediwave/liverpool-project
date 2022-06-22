$(document).ready(function () {
    var app = new Vue({
        el: '#voiceOverPage',
        data: {
            voiceOverData: ''
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var isIE = false || !!document.documentMode;
            if (isIE) {
                $('#hideVoiceOverPage').removeClass().addClass('d-block');
                $('#showVoicePage').removeClass().addClass('d-none');
            }
            var switchElem = document.getElementById('switchVoice');
            if (localStorage.getItem('voiceOver') && localStorage.getItem('voiceOver') == 'on') {
                switchElem.value = localStorage.getItem('voiceOver');
                switchElem.checked = true;

            } else if (localStorage.getItem('voiceOver') && localStorage.getItem('voiceOver') == 'off') {
                switchElem.checked = false;
            }
            setTimeout(function () {
                $('#loader').hide();
            }, 1000);
        },

        methods: {
            setVoiceOver: function (e) {
                if (e.target.checked) {
                    e.target.value = "on";
                    localStorage.setItem('voiceOver', 'on');
                    $('#voiceOverToggleText').text('Voice over turned on successfully');
                }
                else {
                    e.target.value = "off"
                    localStorage.setItem('voiceOver', 'off');
                    $('#voiceOverToggleText').text('Voice over turned off successfully');
                }
                setTimeout(function () {
                    $('#voiceOverSuccessModal').modal('show');
                }, 400)
            },
        }

    })

})