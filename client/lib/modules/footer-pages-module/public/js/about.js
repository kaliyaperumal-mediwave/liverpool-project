var API_URI = "/modules/footer-pages-module";
$(document).ready(function () {
    new Vue({
        el: '#aboutUsPage',
        data: {
            location: window.location,
            searchRefObj: {errMsg:false,validateErrMsg:false}
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
            searchReferral: function () {
                var _self = this;
                if (this.searchRefObj.refCode!="" && this.searchRefObj.refCode!=undefined && (this.searchRefObj.refCode).trim()!="") {
                    $.ajax({
                        //  url: API_URI + "/fetchEligibility",
                        url: API_URI + "/searchReferalByCode/" + this.searchRefObj.refCode,
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json',
                        // data: JSON.stringify(this.sendObj),
                        success: function (data) {
                            if(data.length!=0)
                            {
                                location.href = "/viewreferals?"+ btoa(_self.searchRefObj.refCode);
                                _self.searchRefObj.errMsg = false;
                            }
                            else
                            {
                                _self.searchRefObj.errMsg = true;
                            }
                            $('#loader').hide();
                        },
                        error: function (error) {
                            $('#loader').hide();
                            console.log(error.responseJSON.message)
                            showError(error.responseJSON.message, error.status);
                        }
                    });
                }
                else
                {
                    this.searchRefObj.validateErrMsg=true;
                }
            },

            getRefCode: function (e) {
                //set errmsg false to clear from view
                var searchTxt = e.target.value;
                if (searchTxt.length > 0) {
                    this.searchRefObj.errMsg = false;
                    this.searchRefObj.validateErrMsg=false;
                }
            },
            getStringLength: function (str) {
                return str.length;
            },

        }

    })

})