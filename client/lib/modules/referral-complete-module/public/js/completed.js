
var API_URI = "/modules/referral-complete-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#completed-form',
        data: {
            ackObj: {refCode:'123'},
            paramValues: [],
            reference_code:''
        },
        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.getRefNo();
        },
        methods: {
            getRefNo: function() {
                var _self = this;
                $.ajax({
                    url: API_URI + "/getRefNo/" + this.paramValues[0],
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {
                        _self.reference_code = data.reference_code
                    },
                    error: function (error) {
                        console.log('Something went Wrong', error)
                    }
                });
            },
          
        }
    })
});