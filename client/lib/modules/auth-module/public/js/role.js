$(document).ready(function () {


    // $("#gpLocation").autocomplete({
    //     source: availableTags
    // });

    $('#datepicker').datepicker();
    var app = new Vue({
        el: '#role-form',
        mounted: function () {
            console.log('this', this)
            this.save()
        },
        data: {
            elgibilityObj: {},
            submitForm: ""
        },
        methods: {
            onChange(event) {
                var optionText = event.target.name;

                console.log(optionText);
                if (optionText == "role" && this.elgibilityObj.interpreter != undefined) {
                    this.elgibilityObj.interpreter = "";
                    this.elgibilityObj.childDob = "";
                    this.submitForm = "false";
                }

                if (optionText == "interpreter" && this.elgibilityObj.camhs != undefined) {
                    this.elgibilityObj.childDob = "";
                    this.elgibilityObj.camhs = "";
                    this.elgibilityObj.camhsSelect = "";
                    this.submitForm = "false";
                }

                if (optionText == "camhsSelect" && this.submitForm != undefined) {
                    this.submitForm = "false";

                }


            },
            changeDob(e) {
                debugger;
                console.log(e);
                $('#datepicker').datepicker({
                    clearBtn: true,
                    format: "dd/mm/yyyy"
                });
            },
            changeGP() {
                this.submitForm = "true";
            },
            save() {
                var availableTags = [
                    "ActionScript",
                    "AppleScript",
                    "Asp",
                    "BASIC",
                    "C",
                    "C++",
                    "Clojure",
                    "COBOL",
                    "ColdFusion",
                    "Erlang",
                    "Fortran",
                    "Groovy",
                    "Haskell",
                    "Java",
                    "JavaScript",
                    "Lisp",
                    "Perl",
                    "PHP",
                    "Python",
                    "Ruby",
                    "Scala",
                    "Scheme"
                ];
                $("#gpLocation").autocomplete({
                    source: availableTags
                });
                return;
            }

        }
    })
    console.log('loaded')
    console.log('vue app', app)

});