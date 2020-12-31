var API_URI = "/modules/check-referral-module";
$(document).ready(function () {

    new Vue({
        el: '#check-referral',

        data: {
            checkReferral: {
                email: "",
                password: ""
            },
            isFormSubmitted: false,
            showVisibility: false,
        },

        mounted: function () {
        },

        methods: {
            toggleArrow: function (e) {
                var ele = e.target;
                var classList = Array.from(e.target.classList)
                if (classList.indexOf('fa-chevron-circle-up') > -1) {
                    $(ele).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                } else {
                    $(ele).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                }
            },
        }
    })

});