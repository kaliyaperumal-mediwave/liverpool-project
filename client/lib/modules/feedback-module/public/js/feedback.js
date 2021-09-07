var API_URI = "/modules/feedback-module";

$(document).ready(function () {
    var app = new Vue({
        el: '#feedbackPage',
        data: {
            feedbackData: {
                comments: '',
                ratings: '',
            },
            feedbackMessage: '',
            isFormSubmitted: false,
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

            preventWhiteSpace: function (e) {
                if (e.target.value && !e.target.value.replace(/ /g, "").length) {
                    this.feedbackData.comments = e.target.value.trim();
                    return false;
                }
            },

            sendFeedback: function () {
                this.isFormSubmitted = true;
                if (this.feedbackData.ratings && this.feedbackData.comments) {
                    var feedbackObj = JSON.parse(JSON.stringify(this.feedbackData));
                    $('#loader').show();
                    var successData = apiCallPost('post', '/feedback', feedbackObj);
                    $('#loader').hide();
                    if (successData && Object.keys(successData)) {
                        $('#loader').removeClass('d-block').addClass('d-none');
                        this.feedbackMessage = successData.message;
                        $('#feedbackSuccess').modal('show');
                    } else {
                        $('#loader').removeClass('d-block').addClass('d-none');
                        this.feedbackMessage = 'Something went wrong. Please try again.';
                    }
                } else {
                    scrollToInvalidInput();
                    return false;
                }
            },

            resetForm: function () {
                this.isFormSubmitted = false;
                this.feedbackData.ratings = '';
                this.feedbackData.comments = '';
            },

            closeMsg: function () {
                this.resetForm();
                $('#feedbackSuccess').modal('hide');
            }

        }

    })

})