
const apiUrl = "http://0.0.0.0:3001/user/eligibility"

$(document).ready(function () {


    // $("#gpLocation").autocomplete({
    //     source: availableTags
    // });

    var _self = this;
    var app = new Vue({
        el: '#role-form',
        mounted: function () {
              //this.getGP();
        },
        data: {

            gpListShow: [],
            elgibilityObj: {},
            submitForm: "",
            submitProfForm: ""
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

            getProfGP() {
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

                        $("#gpProfLocation").autocomplete({
                            source: gpList
                        });
                        return;
                    },
                    error: function (err) {
                        console.log(err)
                    },
                })

            },

            getDate(e) {
                console.log(e.target.value);
            },

            onChange(event) {
                var optionText = event.target.name;

                console.log(this.elgibilityObj.interpreter);


                if (optionText == "role" && this.elgibilityObj.interpreter != undefined) {

                    console.log(optionText);

                    this.elgibilityObj.interpreter = "";
                    this.elgibilityObj.childDob = "";
                    this.elgibilityObj.camhs = "";
                    this.elgibilityObj.isInformation = "";
                    this.elgibilityObj.registerd_gp = "";
                    this.submitForm = "false";

                }

                if (optionText == "interpreter" && this.elgibilityObj.camhs != undefined) {
                    this.elgibilityObj.childDob = "";
                    this.elgibilityObj.camhs = "";
                    this.elgibilityObj.camhsSelect = "";
                    this.elgibilityObj.isInformation = "";
                    this.submitForm = "false";
                }

                if (optionText == "camhsSelect") {

                    this.getGP();

                }
                if (optionText == "camhsSelect" && this.submitForm != undefined) {

                    this.submitForm = "false";

                }

                //reset fields for prof
                if (optionText == "role" && this.elgibilityObj.parentConcernInformation != undefined) {

                    this.elgibilityObj.profName = "";
                    this.elgibilityObj.profEmail = "";
                    this.elgibilityObj.profContactNumber = "";
                    this.elgibilityObj.profChildDob = "";
                    this.elgibilityObj.parentConcern = "";
                    this.elgibilityObj.parentConcernInformation = "";
                    this.elgibilityObj.childConcernInformation = "";
                    this.elgibilityObj.profRegisterd_gp = "";
                    this.submitProfForm = "false";
                }


                if (optionText == "parentConcernSelect") {
                    var selectTxt = event.target.value
                    if (selectTxt == "no" && this.elgibilityObj.childConcernInformation != undefined) {
                        console.log("--");
                        this.elgibilityObj.childConcernInformation = "";
                        this.elgibilityObj.registerd_gp = "";
                        this.submitProfForm = "false";
                    }

                }

                if (optionText == "childConcernSelect") {
                    this.getProfGP();

                    var selectTxt = event.target.value
                    if (selectTxt == "no") {
                        console.log("--");

                        this.elgibilityObj.registerd_gp = "";
                        this.submitProfForm = "false";
                    }

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
            getProfAddress(e) {
                $("#gpProfLocation").on("autocompleteclose", function (event, ui) {
                    console.log('this', _self, app);
                    if (e.target.value === '') {
                        app.submitProfForm = "false";
                    } else {
                        app.elgibilityObj.profRegisterd_gp = e.target.value
                        app.submitProfForm = "true";
                    }
                });
            },
            changeDob(event) {

                var roleText = event.target.name;
                if (roleText == 'child') {
                    this.elgibilityObj.camhs = "show";
                    this.submitForm = "false";
                }
                else if (roleText == 'prof') {
                    this.elgibilityObj.parentConcern = "show";
                    this.submitProfForm = "false";
                }
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
                        alert("section 1 saved.");
                        location.reload();
                        
                    },

                });
            },

        }
    })

});