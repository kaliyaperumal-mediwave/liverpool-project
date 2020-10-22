
const apiUrl = "http://0.0.0.0:3001/user/eligibility"

$(document).ready(function () {


    // $("#gpLocation").autocomplete({
    //     source: availableTags
    // });

    var _self = this;
    var app = new Vue({
        el: '#role-form',
        mounted: function () {
          ///  this.getGP();
        },
        data: {

            gpListShow: [],
            elgibilityObj: {},
            submitForm: ""
        },
        methods: {

            getGP() {
                console.log("Er");
                gpList = [];
                $.ajax({
                    url: "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177",
                    type: 'get',
                    success: function (response) {

                        this.gpListShow = response.Organisations;

                        for (i = 0; i < this.gpListShow.length; i++) {

                            gpList.push(this.gpListShow[i].Name)

                        }

                        $("#gpLocation").autocomplete({
                            source: gpList
                        });
                        return;
                    },
                    error: function (err) {
                        console.log(err)
                    },
                })

            },


            onChange(event) {
                var optionText = event.target.name;

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

                if (optionText == "camhsSelect") {
                   
                    this.getGP();
                
                }
                if (optionText == "camhsSelect" && this.submitForm != undefined) {
                 
                    this.submitForm = "false";

                }


            },
            getAddress(e) {
                $("#gpLocation").on("autocompleteclose", function (event, ui) {
                    console.log('this', _self, app);
                    if (e.target.value === '') {
                        app.submitForm = "false";
                    } else {
                        app.elgibilityObj.registerd_gp = e.target.value
                        app.submitForm = "true";
                    }
                });
            },
            changeDob(e) {
                $('#datepicker').datepicker().on(picker_event, function (e) {
                    console.log(e)
                });;
            },
            changeGP() {
                this.submitForm = "true";
            },
            save() {
              console.log(this.elgibilityObj)

              $.ajax({
                url: apiUrl,
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(this.elgibilityObj),
                success: function (data) {
                   console.log(data)
                },
              
            });
            }

        }
    })
    console.log('loaded')
    console.log('vue app', app)

});