
const apiUrl = "http://localhost:3001/user/eligibility"

$(document).ready(function () {


    // $("#gpLocation").autocomplete({
    //     source: availableTags
    // });

    var _self = this;
    var app = new Vue({
        el: '#about-form',
        mounted: function () {
            console.log("vue js loaded");
        },
        data: {
            aboutObj: {},
        },
        methods: {
            saveAbout() {

                console.log(this.aboutObj);
            }
        }
    })

});