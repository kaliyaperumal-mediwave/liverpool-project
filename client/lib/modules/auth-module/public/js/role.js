
//const apiUrl = "/user/eligibility"
var API_URI = "/modules/auth-module";
$(document).ready(function () {
    var _self = this;
    var app = new Vue({
        el: '#role-form',
        mounted: function () {
            this.loaded();
        },
        data: {
            gpListShow: [],
            elgibilityObj: {},
            submitForm: "",
            submitProfForm: "",
            belowAgeLimit: "",
            aboveLimit: "",
            profBelowAgeLimit: "",
            profaboveLimit: "",
            hasNameReqError: false,
            hasContactReqError: false,
            hasNameInvalidError: false,
            hasContactInvalidError: false,
            hasEmailInvalidError: false,
            isSubmitted: false,
        },
        methods: {
            loaded() {
                console.log('loaded')
            },
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

            onChange(event) {

                var optionText = event.target.name;
                console.log(optionText);
                if (optionText == "role" && this.elgibilityObj.interpreter != undefined) {
                    console.log(optionText);
                    this.elgibilityObj.interpreter = "";
                    this.elgibilityObj.childDob = "";
                    this.belowAgeLimit = "";
                    this.aboveLimit = "";
                    this.elgibilityObj.camhs = "";
                    this.elgibilityObj.isInformation = "";
                    this.elgibilityObj.registerd_gp = "";
                    this.elgibilityObj.contactParent = "";
                    this.submitForm = "false";
                }

                if (optionText == "interpreter" && this.elgibilityObj.camhs != undefined) {
                    this.elgibilityObj.childDob = "";
                    this.belowAgeLimit = "";
                    this.aboveLimit = "";
                    this.elgibilityObj.camhs = "";
                    this.elgibilityObj.camhsSelect = "";
                    this.elgibilityObj.isInformation = "";
                    this.elgibilityObj.registerd_gp = "";
                    this.elgibilityObj.contactParent = "";
                    this.submitForm = "false";
                }

                if (optionText == "belowAgeParent" && this.elgibilityObj.isInformation != undefined) {
                    this.elgibilityObj.isInformation = "";
                    this.elgibilityObj.registerd_gp = "";
                    this.submitForm = "false";
                }

                if (optionText == "camhsSelect") {
                    console.log(this.elgibilityObj.isInformation);
                    console.log(this.elgibilityObj.role);
                    this.getGP();
                   
                }
                if (optionText == "camhsSelect" && this.submitForm != undefined) {
                    this.elgibilityObj.registerd_gp = "";
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
                    this.profBelowAgeLimit = "";
                    this.profaboveLimit = "";
                    this.elgibilityObj.contactProfParent = "";
                    this.submitProfForm = "false";
                }
                

                if (optionText == "parentConcernSelect") {
                    this.getProfGP();
                    var selectTxt = event.target.value
                    if (selectTxt == "no") {
                        console.log("--");
                      //  this.elgibilityObj.childConcernInformation = "";
                        this.elgibilityObj.profRegisterd_gp = "";
                   //     this.profBelowAgeLimit = "";
                        this.elgibilityObj.profaboveLimit = "";
                       // this.profBelowAgeLimit = "";
                      //  this.profaboveLimit = "";
                     // this.elgibilityObj.parentConcernInformation
                        this.submitProfForm = "false";
                    }
                }

                // if (optionText == "parentConcernSelect") {
                //     this.getProfGP();
                //     var selectTxt = event.target.value
                //     if (selectTxt == "no") {
                //         console.log("--");
                //         this.elgibilityObj.registerd_gp = "";
                //         this.profBelowAgeLimit = "";
                //         this.profaboveLimit = "";
                //         this.submitProfForm = "false";
                //     }
                // }
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
                var today = new Date();
                var selectedDate = new Date(event.target.value);
                var age = this.diff_years(today, selectedDate);
                var roleText = event.target.name;
                if(this.elgibilityObj.isInformation != undefined)
                {
                    this.elgibilityObj.isInformation="";
                }
                console.log(age);
                if (roleText == 'child') {
                    if (age < 15) {
                        this.belowAgeLimit = "yes";
                        this.aboveLimit = "";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else if (age > 25) {
                        this.aboveLimit = "yes";
                        this.belowAgeLimit = "";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else {
                        this.elgibilityObj.camhs = "show";
                            this.belowAgeLimit = "";
                            this.aboveLimit = "";
                        this.submitForm = "false";
                    }
                }
                else if (roleText == 'prof') {
                    if (age < 15) {
                        this.profBelowAgeLimit = "yes";
                        this.profaboveLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.submitProfForm = "false";
                    }
                    else if (age > 25) {
                        this.profaboveLimit = "yes";
                        this.profBelowAgeLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.submitProfForm = "false";
                    }
                    else {
                        this.elgibilityObj.parentConcern = "show";
                        this.profBelowAgeLimit = "";
                        this.profaboveLimit = "";
                        this.submitProfForm = "false";
                    }
                }

                else if (roleText == 'parent') {
                    if (age > 25) {
                        this.aboveLimit = "yes";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else {
                        this.elgibilityObj.camhs = "show";
                        this.belowAgeLimit = "";
                        this.aboveLimit = "";
                        this.submitForm = "false";
                    }

                }

            },

            changeGP() {
                this.submitForm = "true";
            },

            onVaueChange(e, type) {
                if (this.isSubmitted) {
                    var phoneRegex = /^[0-9,-]{10,15}$|^$/;
                    var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
                    var emailRegex = new RegExp(/^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i);
                    if (type === 'fullName') {
                        if (e.target.value.length === 0) {
                            this.hasNameReqError = true;
                        } else {
                            if (!nameRegex.test(e.target.value)) {
                                this.hasNameInvalidError = true;
                            } else {
                                this.hasNameInvalidError = false;
                            }
                            this.hasNameReqError = false;
                        }

                    } else if (type === 'email') {
                        if (e.target.value.length === 0) {
                            this.hasEmailInvalidError = false;
                        } else {
                            if (emailRegex.test(e.target.value)) {
                                this.hasEmailInvalidError = false;
                            } else {
                                this.hasEmailInvalidError = true;
                            }
                            //this.hasNameReqError = false;
                        }
                    }

                    else if (type === 'contact') {
                        if (e.target.value.length === 0) {
                            this.hasContactReqError = true;
                            this.hasContactInvalidError = false;
                        } else {
                            if (!phoneRegex.test(e.target.value)) {
                                this.hasContactInvalidError = true;
                            } else {
                                this.hasContactInvalidError = false;
                            }
                            this.hasContactReqError = false;
                        }

                    }
                }
            },

            save() {
                var phoneRegex = /^[0-9,-]{10,15}$|^$/;
                var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
                var emailRegex = new RegExp(/^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i);
                this.isSubmitted = true;
                console.log(this.elgibilityObj);
                var role = this.elgibilityObj.role;
                if (role === 'professional') {
                    if (this.elgibilityObj.profName && this.elgibilityObj.profContactNumber) {
                        if (nameRegex.test(this.elgibilityObj.profName) && phoneRegex.test(this.elgibilityObj.profContactNumber)) {
                            if (this.elgibilityObj.profEmail) {
                                if (emailRegex.test(this.elgibilityObj.profEmail)) {
                                    this.apiRequest(this.elgibilityObj, role);

                                } else {
                                    this.hasEmailInvalidError = true;
                                }

                            } else {
                                this.apiRequest(this.elgibilityObj, role);
                            }
                        }
                        else {
                            if (!nameRegex.test(this.elgibilityObj.profName)) {
                                this.hasNameInvalidError = true;
                            } else {
                                this.hasNameInvalidError = false;
                            }
                            if (!phoneRegex.test(this.elgibilityObj.profContactNumber)) {
                                this.hasContactInvalidError = true;
                            } else {
                                this.hasContactInvalidError = false;
                            }
                            if (this.elgibilityObj.profEmail) {
                                if (!emailRegex.test(this.elgibilityObj.profEmail)) {
                                    this.hasEmailInvalidError = true;
                                }
                            }
                            window.scrollTo(0, 0)
                        }
                    } else {
                        if (this.elgibilityObj.profName === undefined) {
                            this.hasNameReqError = true;
                        } else {
                            this.hasNameReqError = false;
                        }
                        if (this.elgibilityObj.profContactNumber === undefined) {
                            this.hasContactReqError = true;
                        } else {
                            this.hasContactReqError = false;
                        }
                        if (this.elgibilityObj.profEmail) {
                            if (!emailRegex.test(this.elgibilityObj.profEmail)) {
                                this.hasEmailInvalidError = true;
                            }
                        }
                        window.scrollTo(0, 0)
                    }
                } else if (role === 'parent') {
                    this.apiRequest(this.elgibilityObj, role);
                }
                else if (role === 'child') {
                    this.apiRequest(this.elgibilityObj, role);
                }
            },

            apiRequest(payload, role) {
                var _self = this;
                $.ajax({
                    url: API_URI + "/eligibility",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    success: function (data) {
                        //alert("section 1 saved.");
                        console.log(data);
                        _self .isSubmitted = false;
                        if (role === 'professional') {
                            _self .resetValidation();;
                        }
                        location.href = "/about?userid=" + data.userid + "&role=" + role;
                    },
                });
            },


            resetValidation() {
                this.hasNameInvalidError = false;
                this.hasNameReqError = false;
                this.hasEmailInvalidError = false;
                this.hasContactInvalidError = false;
                this.hasContactReqError = false;
            },

            diff_years(dt2, dt1) {
                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                return Math.abs(Math.round(diff / 365.25));
            }

        }
    })

});