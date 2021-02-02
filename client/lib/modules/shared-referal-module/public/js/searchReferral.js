$(document).ready(function () {
    var API_URI = "/modules/dashboard-module";
    $("#doSearchReferral").click(function (event) {
        if (!$('#toSearchRefCode').val().trim()) {
            $("#dispErrMsg").html("Please type referrance code to search");
            return;
        }
        $('#loader').show();
        $.ajax({
            url: API_URI + "/searchReferalByCode/" + $('#toSearchRefCode').val(),
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                $('#loader').hide();
                if (data.length != 0) {
                    location.href = "/viewreferrals?" + btoa($('#toSearchRefCode').val());
                }
                else {
                    $("#dispErrMsg").html("Not found. Please enter valid reference code");
                }
            },
            error: function (error) {
                $('#loader').hide();
                if (error) {
                    showError(error.responseJSON.message);
                    setTimeout(function () {
                        $('#errorCommon').modal('hide');
                    }, 1000);
                }
            }
        });
    });

    $("#toSearchRefCode").on('input', function () {
        $("#dispErrMsg").html("");
    });

    console.log(document.getElementById('loginUserFlag').innerHTML)
});