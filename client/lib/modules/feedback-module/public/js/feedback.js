$(document).ready(function () {
    new Vue({
        el: '#feedback-page',
        data: {
            comments: '',
            ratings: ''
        },
        mounted: function () {
            console.log('mounted');
        },

        methods: {

            sendFeedback: function () {
                console.log('clicked')
            },
        }

    })

})