$(document).ready(function () {
    var API_URI = "/modules/dashboard-module";
    $("#doSearchReferral").click(function (event) {
        if (!$('#toSearchRefCode').val().trim()) {
            $("#dispErrMsg").html("Please type reference code to search");
            return;
        }
        $.ajax({
            url: API_URI + "/searchReferalByCode/" + $('#toSearchRefCode').val(),
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                if (data.length != 0) {
                    location.href = "/viewreferrals?" + btoa($('#toSearchRefCode').val());
                }
                else {
                    $("#dispErrMsg").html("Not found. Please enter valid reference code");
                }
            },
            error: function (error) {
                if (error) {
                    showError(error.responseJSON.message);
                }
            }
        });
    });

    $("#toSearchRefCode").on('input', function () {
        $("#dispErrMsg").html("");
    });
});