
var API_URI = "/modules/referral-complete-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#completed-form',
        data: {
            ackObj: { refCode: '123' },
            paramValues: [],
            reference_code: '',
            loginFlag: '',
            mailId: '',
            sendObj: {}
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.loginFlag = document.getElementById('uRole').innerHTML; // hide in layout.html
            this.getRefNo();
        },

        methods: {

            getRefNo: function () {
                var _self = this;
                $.ajax({
                    url: API_URI + "/getRefNo/" + document.getElementById('uUid').innerHTML,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        _self.reference_code = data.reference_code;
                        _self.sendObj.ref_code = data.reference_code;
                        console.log("logi flag ", _self.loginFlag)
                        // _self.sendMail(_self.sendObj);
                        $('#loader').hide();
                    },
                    error: function (error) {
                        console.log('Something went Wrong', error);
                        $('#loader').hide();
                        showError(error.responseJSON.message, error.status);
                    }
                });
            },

            // sendMail: function (payLoadObj) {
            //     var _self = this;
            //     $.ajax({
            //         url: API_URI + "/sendConfirmationMail",
            //         type: 'post',
            //         dataType: 'json',
            //         contentType: 'application/json',
            //         data: JSON.stringify(payLoadObj),
            //         success: function (data) {
            //             console.log("EmailSent")
            //         },
            //         error: function (error) {
            //             console.log('Something went Wrong', error);
            //             showError(error.responseJSON.message, error.status);
            //         }
            //     });
            // },
        }
    })
});