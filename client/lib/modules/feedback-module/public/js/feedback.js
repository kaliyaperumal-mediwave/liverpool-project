$(document).ready(function () {
    var app = new Vue({
        el: '#feedbackPage',
        data: {
            feedbackData: {
                comments: '',
                ratings: '',
            },
            isFormSubmitted: false,
        },
        mounted: function () {
        },

        methods: {

            getFeedback: function () {
                console.log('clicked')
            },

            sendFeedback: function () {
                this.isFormSubmitted = true;
                if (this.feedbackData.ratings) {
                    console.log(this.feedbackData);

                } else {
                    scrollToInvalidInput();
                    return false;
                }
                console.log('clicked')
            },

        }

    })

})