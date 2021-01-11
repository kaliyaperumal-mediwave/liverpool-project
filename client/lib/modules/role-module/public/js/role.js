//const apiUrl = "/user/eligibility"
var API_URI = "/modules/role-module";
$(document).ready(function () {

    Vue.component('date-picker', VueBootstrapDatetimePicker);
    var _self = this;
    var app = new Vue({
        el: '#role-form',

        data: {
            gpListShow: [],
            elgibilityObj: {
                role: '',
                interpreter: '',
                tostInterYes: '',
                childDob: '',
                contactParent: '',
                contactParentNo: '',
                belowAgeLimit: '',
                aboveLimit: '',
                isInformation: '',
                isInformationNo: '',
                regGpTxt: '',
                submitFormTrue: '',
                underLimit: '',
                toastIsInformation: '',
                submitForm: '',
                submitProfForm: '',
                profBelowAgeLimit: '',
                profaboveLimit: '',
                parentConcernInformation: '',
                childConcernInformation: '',
                contactProfParent: '',
                regProfGpTxt: '',
                profEmail: '',
                disableRole: false,
                reasonContactParent:''
            },
            date: null,
            dateWrap: true,
            showInputLoader: false,
            showInputLoaderProf: false,
            options: {
                //format: 'YYYY/MM/DD',
                format: 'DD/MM/YYYY',
                dayViewHeaderFormat: 'MMMM YYYY',
                useCurrent: false,
                allowInputToggle: true,
                minDate: new Date(1950, 10, 25),
                maxDate: moment().endOf('day').add(1, 'sec'),
            },
            hasNameReqError: false,
            hasContactReqError: false,
            hasNameInvalidError: false,
            hasContactInvalidError: false,
            hasEmailInvalidError: false,
            isSubmitted: false,
            edFlag: false,
            sendObj: {},
            maxDate: "",
            gpListName: [],
            gpListPost: [],
            gpProfListName: [],
            gpProfListPost: [],
            loadGpName: true,
            loadGbPost: true,
            selectedGpObj: {},
            paramValues: [],
            patchFlag: false,
            gpFlag: false,
            date: '',
            dateFmt: ''
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href);
            //  this.getGP();
            //  this.getProfGP();
            if (this.paramValues != undefined) {
                if (this.paramValues[0] == "loginFlag") {
                    this.elgibilityObj.loginId = this.paramValues[1];
                    this.elgibilityObj.role = this.paramValues[2];
                    $('input[name=role]').attr("disabled", true);
                    $('#loader').hide();
                }
                else if (this.paramValues[2] != undefined) {
                    this.elgibilityObj.uuid = this.paramValues[0];
                    this.elgibilityObj.editFlag = this.paramValues[2]
                    this.fetchSavedData();
                }
            }
            $('#loader').hide();
        },

        methods: {
            fetchSavedData: function () {
                this.sendObj.uuid = this.paramValues[0];
                this.sendObj.role = this.paramValues[1];
                $.ajax({
                    //  url: API_URI + "/fetchEligibility",
                    url: API_URI + "/fetchEligibility/" + this.sendObj.uuid + "&role=" + this.sendObj.role,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    // data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        app.setValues(data);
                        $('#loader').hide();
                    },
                    error: function (error) {
                        $('#loader').hide();
                        //console.log(error.responseJSON.message)
                    }
                });
            },

            // resetCalendar: function (e) {
            //     debugger
            //     console.log(e);
            //     Vue.use('date-picker', VueBootstrapDatetimePicker);
            // },

            setValues: function (data) {
                var roleType = this.paramValues[1];
                this.patchFlag = true;
                //console.log(roleType)
                if (roleType == "child") {
                    Vue.set(this.elgibilityObj, "role", roleType);
                    Vue.set(this.elgibilityObj, "interpreter", data.need_interpreter);
                    Vue.set(this.elgibilityObj, "childDob", this.convertDate(data.child_dob));
                    this.fetchAgeLogic(data.child_dob, roleType)
                    Vue.set(this.elgibilityObj, "contactParent", data.contact_parent);
                    Vue.set(this.elgibilityObj, "isInformation", data.consent_child);
                    Vue.set(this.elgibilityObj, "regGpTxt", this.bindGpAddress(data.registerd_gp));
                    $('input[name=role]').attr("disabled", true);
                    //   this.getGP();
                }
                else if (roleType == "parent") {

                    Vue.set(this.elgibilityObj, "role", roleType);
                    Vue.set(this.elgibilityObj, "interpreter", data[0].need_interpreter);
                    Vue.set(this.elgibilityObj, "childDob", this.convertDate(data[0].parent[0].child_dob));
                    this.fetchAgeLogic(data.child_dob, roleType)
                    Vue.set(this.elgibilityObj, "contactParent", data[0].contact_parent);
                    Vue.set(this.elgibilityObj, "isInformation", data[0].consent_child);
                    Vue.set(this.elgibilityObj, "regGpTxt", this.bindGpAddress(data[0].parent[0].registerd_gp, roleType));
                    $('input[name=role]').attr("disabled", true);
                    //  this.getGP();
                }
                else if (roleType == "professional") {
                    Vue.set(this.elgibilityObj, "role", roleType);
                    Vue.set(this.elgibilityObj, "profName", data[0].professional_name);
                    Vue.set(this.elgibilityObj, "profEmail", data[0].professional_email);
                    Vue.set(this.elgibilityObj, "profContactNumber", data[0].professional_contact_number);
                    Vue.set(this.elgibilityObj, "profChildDob", this.convertDate(data[0].professional[0].child_dob));
                    this.fetchAgeLogic(data[0].professional[0].child_dob, roleType)
                    Vue.set(this.elgibilityObj, "contactProfParent", data[0].consent_parent);
                    Vue.set(this.elgibilityObj, "parentConcernInformation", data[0].consent_child);
                    Vue.set(this.elgibilityObj, "regProfGpTxt", this.bindGpAddress(data[0].professional[0].registerd_gp, roleType));
                    $('input[name=role]').attr("disabled", true);
                    this.elgibilityObj.submitProfForm = "true";
                    //  this.getProfGP();
                }

            },
            // getGP: function () {
            //     var _self = this;
            //     gpList = [];
            //  //  var gpLink= "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?name"+ txtValue
            //     $.ajax({
            //         url: "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177",
            //         type: 'get',
            //         success: function (response) {
            //             _self.gpListShow = response.Organisations;
            //             for (i = 0; i < _self.gpListShow.length; i++) {
            //                 _self.gpListName.push(_self.gpListShow[i].Name + "," + _self.gpListShow[i].PostCode);
            //                 //_self.gpListPost.push(_self.gpListShow[i].PostCode)
            //             }
            //             displayNameList = _self.gpListName;
            //             displayPostList = _self.gpListPost;
            //             ////console.log(displayNameList);
            //             $("#gpLocation").autocomplete({
            //                 source: displayNameList,
            //                 response: function (event, ui) {
            //                     if (ui.content.length == 0) {
            //                         //alert("gp n")
            //                         $(this).trigger('keydown');
            //                     } else {

            //                         ////console.log(ui.content.length);
            //                     }
            //                 }
            //             });

            //         },
            //         error: function (err) {
            //             //console.log(err)
            //         },
            //     })
            // },

            // getProfGP: function () {
            //     var _self = this;
            //     gpList = [];
            //     $.ajax({
            //         url: "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177",
            //         type: 'get',
            //         success: function (response) {
            //             this.gpListShow = response.Organisations;
            //             for (i = 0; i < this.gpListShow.length; i++) {
            //                 _self.gpProfListName.push(this.gpListShow[i].Name + ',' + this.gpListShow[i].PostCode);
            //                 //    _self.gpProfListPost.push(this.gpListShow[i].PostCode)
            //             }
            //             displayNameList = _self.gpProfListName;
            //             displayPostList = _self.gpProfListPost;

            //             $("#gpProfLocation").autocomplete({
            //                 source: displayNameList,
            //                 response: function (event, ui) {
            //                     if (ui.content.length == 0) {
            //                         $(this).trigger('keydown');
            //                     } else {
            //                     }
            //                 }
            //             });
            //             return;
            //         },
            //         error: function (err) {
            //             //console.log(err)
            //         },
            //     })
            // },


            onChange: function (event) {
                var questionIdentifier = event.target.name;
                var optionValue = event.target.value;
                if (questionIdentifier == "role") {
                    this.resetValues(event.target.form);
                }
                if (questionIdentifier != "role" && questionIdentifier == "interpreter" && optionValue == "yes") {
                    this.resetValues(event.target.form);
                }
                else if (questionIdentifier == "interpreter" && optionValue == "yes") {
                    this.resetValues(event.target.form);
                }
                else if (questionIdentifier == "belowAgeParent" && optionValue == "no") {
                    this.resetValues(event.target.form);
                    this.elgibilityObj.contactParent = optionValue;
                }
                else if (questionIdentifier == "reasonParentContact" && optionValue == "no") {
                    console.log(event.target.form)
                    this.resetValues(event.target.form);
                    this.elgibilityObj.reasonContactParent = optionValue;
                }
                else if (questionIdentifier == "camhsSelect" && optionValue == "no") {
                    this.resetValues(event.target.form);
                    this.elgibilityObj.isInformation = optionValue;
                }
                //for professional
                else if (questionIdentifier == "contactProfParent" && optionValue == "no") {
                    this.resetValues(event.target.form);
                    this.elgibilityObj.contactProfParent = optionValue;
                }
                else if (questionIdentifier == "parentConcernSelect" && optionValue == "no") {
                    this.resetValues(event.target.form);
                    this.elgibilityObj.parentConcernInformation = optionValue;
                }
            },

            resetValues: function (currentForm) {
                var allForms = Array.from(document.forms);
                var formIndex = allForms.indexOf(currentForm);
                for (let i = 0; i < allForms.length; i++) {
                    var attributeValue = $(allForms[i]).data('options');
                    if (formIndex < i) {
                        this.elgibilityObj[attributeValue] = "";
                    }
                    if (formIndex <= i) {
                        this.elgibilityObj.regGpTxt = "";
                        this.elgibilityObj.regProfGpTxt = "";
                    }
                }
            },

            getAge: function (dateString) {
                var today = new Date();
                var birthDate = new Date(dateString);
                var age = today.getFullYear() - birthDate.getFullYear();
                var m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            },

            getAddress: function (e) {
                var nameData;
                var _self = this;
                var searchTxt = e.target.value;
                if (searchTxt.length > 2) {
                    var gpLink = "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?Name=" + searchTxt;
                    $('#showInputLoaderProf').removeClass("d-none").addClass("d-block");
                    $('#addOpacityProf').css('opacity', '0.2');
                    $.ajax({
                        url: gpLink,
                        type: 'get',
                        async: false,
                        success: function (response) {
                            _self.gpListName = [];
                            app.elgibilityObj.gpErrMsg = "";
                            _self.gpListShow = response.Organisations;
                            if (response.Organisations.length <= 0) {
                                var gpLink = "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PostCode=" + searchTxt;
                                $.ajax({
                                    url: gpLink,
                                    type: 'get',
                                    async: false,
                                    success: function (response) {
                                        _self.gpListName = [];
                                        app.elgibilityObj.gpErrMsg = "";
                                        _self.gpListShow = response.Organisations;
                                        for (i = 0; i < _self.gpListShow.length; i++) {
                                            _self.gpListName.push(_self.gpListShow[i].Name + "," + _self.gpListShow[i].PostCode);
                                        }
                                        payload = _self.remove_duplicates(_self.gpListName);
                                        $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                                        $('#addOpacityProf').css('opacity', '1');
                                        $("#gpLocation").autocomplete({
                                            source: payload,
                                            select: function (event, ui) {
                                                _self.gpFlag = true;
                                                _self.elgibilityObj.regGpTxt = ui.item.value;
                                                app.elgibilityObj.submitForm = "true";
                                                // //console.log(ui);
                                            },
                                            close: function () {
                                                _self.gpFlag = true;
                                            }
                                        });
                                    },
                                    error: function (err) {
                                        $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                                        $('#addOpacityProf').css('opacity', '1');
                                        app.elgibilityObj.gpErrMsg = err.responseJSON.errorText;
                                    },
                                })

                            }
                            else {
                                _self.gpListShow = response.Organisations;
                                for (i = 0; i < _self.gpListShow.length; i++) {
                                    _self.gpListName.push(_self.gpListShow[i].Name + "," + _self.gpListShow[i].PostCode);
                                }
                                nameData = _self.remove_duplicates(_self.gpListName);
                                $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                                $('#addOpacityProf').css('opacity', '1');
                                $("#gpLocation").autocomplete({
                                    source: nameData,
                                    select: function (event, ui) {
                                        _self.elgibilityObj.regGpTxt = ui.item.value;
                                        app.elgibilityObj.submitForm = "true";
                                        app.elgibilityObj.gpErrMsg = "";
                                    },
                                    close: function () {
                                        _self.gpFlag = true;
                                    }
                                });
                            }

                        },
                        error: function (err) {
                            $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                            $('#addOpacityProf').css('opacity', '1');
                            app.elgibilityObj.gpErrMsg = err.responseJSON.errorText;
                        },
                    })


                }
                else {
                    app.elgibilityObj.gpErrMsg = '';
                    app.elgibilityObj.submitForm = "false";
                    $("#gpLocation").autocomplete({
                        source: [],
                        select: function (event, ui) {

                        },
                        close: function () {
                            //
                        }
                    });
                }

            },

            getStringLength: function (str) {
                return str.length;
            },

            setAutocompletePostCode: function (data, postCode) {
                var _self = this;
                $("#gpLocation").autocomplete({
                    source: data,
                    select: function (event, ui) {
                        //console.log(ui);
                    },
                    response: function (event, ui) {
                        if (ui.content.length == 0) {
                            _self.gpSearchArea(postCode);

                        } else {
                        }
                    }
                });
            },

            gpSearchArea: function (data) {

                var payload;
                var gpLink = "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PostCode=" + postCode;
                $.ajax({
                    url: gpLink,
                    type: 'get',
                    async: false,
                    success: function (response) {
                        _self.gpListShow = response.Organisations;
                        for (i = 0; i < _self.gpListShow.length; i++) {
                            _self.gpListName.push(_self.gpListShow[i].Name + "," + _self.gpListShow[i].PostCode);
                        }
                        payload = _self.gpListName;
                        //console.log(payload);
                        $("#gpLocation").autocomplete({
                            source: payload,
                            select: function (event, ui) {
                                //console.log(ui);
                            },
                        });


                    },
                    error: function (err) {
                        // //console.log(err)
                    },
                })



            },




            getProfAddress: function (e) {
                var nameData;
                var _self = this;
                var searchTxt = e.target.value;
                if (searchTxt.length > 2) {
                    var gpLink = "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?Name=" + searchTxt;
                    $('#showInputLoader').removeClass("d-none").addClass("d-block");
                    $('#addOpacity').css('opacity', '0.2');
                    $.ajax({
                        url: gpLink,
                        type: 'get',
                        async: false,
                        success: function (response) {
                            _self.gpListShow = [];
                            _self.gpProfListName = [];
                            app.elgibilityObj.gpErrMsg = "";
                            _self.gpListShow = response.Organisations;
                            if (response.Organisations.length <= 0) {
                                var gpLink = "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PostCode=" + searchTxt;
                                $.ajax({
                                    url: gpLink,
                                    type: 'get',
                                    async: false,
                                    success: function (response) {
                                        _self.gpListShow = [];
                                        _self.gpProfListName = [];
                                        app.elgibilityObj.gpErrMsg = "";
                                        _self.gpListShow = response.Organisations;
                                        for (i = 0; i < _self.gpListShow.length; i++) {
                                            _self.gpProfListName.push(_self.gpListShow[i].Name + ',' + _self.gpListShow[i].PostCode);
                                        }
                                        payload = _self.remove_duplicates(_self.gpProfListName);
                                        $('#showInputLoader').removeClass("d-block").addClass("d-none");
                                        $('#addOpacity').css('opacity', '1');
                                        $("#gpProfLocation").autocomplete({
                                            source: payload,
                                            select: function (event, ui) {
                                                app.elgibilityObj.regProfGpTxt = ui.item.label;
                                                app.elgibilityObj.submitProfForm = "true";
                                                app.elgibilityObj.gpErrMsg = "";
                                            },
                                        });

                                    },
                                    error: function (err) {
                                        $('#showInputLoader').removeClass("d-block").addClass("d-none");
                                        $('#addOpacity').css('opacity', '1');
                                        app.elgibilityObj.gpErrMsg = err.responseJSON.errorText;
                                    },
                                })

                            }
                            else {
                                _self.gpListShow = response.Organisations;
                                if (_self.gpListShow.length > 0) {
                                    for (i = 0; i < _self.gpListShow.length; i++) {
                                        _self.gpProfListName.push(_self.gpListShow[i].Name + ',' + _self.gpListShow[i].PostCode);
                                    }
                                    nameData = _self.remove_duplicates(_self.gpProfListName);
                                    $('#showInputLoader').removeClass("d-block").addClass("d-none");
                                    $('#addOpacity').css('opacity', '1');
                                    $("#gpProfLocation").autocomplete({
                                        source: nameData,
                                        select: function (event, ui) {
                                            app.elgibilityObj.regProfGpTxt = ui.item.label;
                                            app.elgibilityObj.submitProfForm = "true";
                                            app.elgibilityObj.gpErrMsg = "";
                                        },
                                    });
                                }

                            }

                        },
                        error: function (err) {
                            $('#showInputLoader').removeClass("d-block").addClass("d-none");
                            $('#addOpacity').css('opacity', '1');
                            app.elgibilityObj.gpErrMsg = err.responseJSON.errorText;
                        },
                    })

                } else {
                    app.elgibilityObj.gpErrMsg = '';
                    app.elgibilityObj.submitProfForm = "false";
                    $("#gpProfLocation").autocomplete({
                        source: [],
                        select: function (event, ui) {

                        },
                        close: function () {
                            //
                        }
                    });
                }





                // var _self = this;
                // var selectFlag = false;
                // //  this.elgibilityObj.registerd_gp = {};
                // $(".gpProfLocation").on("autocompleteselect", function (event, ui) {
                //     //   //console.log(ui.item.label);
                //     if (e.target.value === '') {
                //         app.elgibilityObj.submitProfForm = "false";
                //     } else {
                //         selectFlag = true;
                //         app.elgibilityObj.regProfGpTxt = ui.item.label;
                //         app.elgibilityObj.submitProfForm = "true";
                //     }
                // });
                // if (e.target.value.length === 0) {
                //     app.elgibilityObj.submitProfForm = "false";
                // }
                // else {
                //     app.elgibilityObj.submitProfForm = "true";
                // }

            },

            selectGp: function () {
                //console.log("erer")
            },

            changeDob: function (e, date) {
                //  //console.log(date);
                if (this.patchFlag != true && date != null) {
                    var today = new Date();
                    this.dateFmt = this.setDate(date)
                    var selectedDate = new Date(this.dateFmt);
                    var age = this.diff_years(today, selectedDate);
                    var roleText = this.elgibilityObj.role;
                    if (this.elgibilityObj.isInformation != undefined) {
                        this.elgibilityObj.isInformation = "";
                    }

                    //   //console.log(age);
                    if (roleText == 'child') {
                        if (age < 15) {
                            this.elgibilityObj.belowAgeLimit = "yes";
                            this.elgibilityObj.aboveLimit = "";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.regGpTxt = "";
                        }
                        else if (age > 19) {
                            this.elgibilityObj.aboveLimit = "yes";
                            this.elgibilityObj.belowAgeLimit = "";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.regGpTxt = "";
                        }
                        else {
                            //console.log("343")
                            this.elgibilityObj.contactParent = "yes";
                            this.elgibilityObj.belowAgeLimit = "";
                            this.elgibilityObj.aboveLimit = "";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.regGpTxt = "";
                        }
                    }
                    else if (roleText == 'professional') {
                        if (age < 15) {
                            this.elgibilityObj.profBelowAgeLimit = "yes";
                            this.elgibilityObj.profaboveLimit = "";
                            this.elgibilityObj.parentConcern = "";
                            this.elgibilityObj.contactProfParent = "";
                            this.elgibilityObj.parentConcernInformation = "";
                            this.elgibilityObj.childConcernInformation = "";
                            this.elgibilityObj.submitProfForm = "false";
                            this.elgibilityObj.regProfGpTxt = "";
                        }
                        else if (age > 19) {
                            this.elgibilityObj.profaboveLimit = "yes";
                            this.elgibilityObj.profBelowAgeLimit = "";
                            this.elgibilityObj.parentConcern = "";
                            this.elgibilityObj.contactProfParent = "";
                            this.elgibilityObj.parentConcernInformation = "";
                            this.elgibilityObj.childConcernInformation = "";
                            this.elgibilityObj.submitProfForm = "false";
                            this.elgibilityObj.regProfGpTxt = "";
                        }
                        else {
                            this.elgibilityObj.parentConcern = "show";
                            this.elgibilityObj.contactProfParent = "yes";
                            this.elgibilityObj.profBelowAgeLimit = "";
                            this.elgibilityObj.profaboveLimit = "";
                            this.elgibilityObj.parentConcernInformation = "";
                            this.elgibilityObj.childConcernInformation = "";
                            this.elgibilityObj.submitProfForm = "false";
                            this.elgibilityObj.regProfGpTxt = "";
                        }
                    }

                    else if (roleText == 'parent') {
                        if (age > 19) {
                            this.elgibilityObj.aboveLimit = "yes";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.regGpTxt = "";
                        }
                        else {
                            this.elgibilityObj.contactParent = "yes";
                            this.elgibilityObj.belowAgeLimit = "";
                            this.elgibilityObj.aboveLimit = "";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.regGpTxt = "";
                        }

                    }
                }
                else {
                    this.patchFlag = true;
                }

            },

            resetFlag: function (e) {
                e.currentTarget.firstElementChild.setAttribute('inputmode', 'none');
                e.currentTarget.firstElementChild.setAttribute('autocomplete', 'off');
                var dynamicHeight;
                var mainWidth = document.getElementById('dobRoleCal').clientWidth;
                if (mainWidth <= 350) {
                    dynamicHeight = e.currentTarget.clientWidth + 10;
                } else {
                    dynamicHeight = e.currentTarget.clientWidth - 10;
                }
                var dob = document.getElementsByClassName('bootstrap-datetimepicker-widget');
                dob[0].style.width = '' + dynamicHeight + 'px';
                this.patchFlag = false;
            },

            changeGP: function () {
                this.submitForm = "true";
            },

            onVaueChange: function (e, type) {
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

            save: function () {
                // this.elgibilityObj.registerd_gp = this.elgibilityObj.regGpTxt;
                //   this.elgibilityObj.editFlag = this.getUrlVars()["edt"];
                //  this.elgibilityObj.uuid = this.getUrlVars()["userid"];
                this.elgibilityObj.login_id = "4218d0fb-59df-4454-9908-33c564802059";
                var phoneRegex = /^[0-9,-]{10,15}$|^$/;
                var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
                var emailRegex = new RegExp(/^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i);
                this.isSubmitted = true;
                //console.log(this.elgibilityObj.role);
                var role = this.elgibilityObj.role;
                if (role === 'professional') {
                    this.elgibilityObj.profRegisterd_gp = this.elgibilityObj.regProfGpTxt;
                    if (this.elgibilityObj.profName && this.elgibilityObj.profContactNumber) {
                        if (nameRegex.test(this.elgibilityObj.profName) && phoneRegex.test(this.elgibilityObj.profContactNumber)) {
                            if (this.elgibilityObj.profEmail) {
                                if (emailRegex.test(this.elgibilityObj.profEmail)) {
                                    $('#loader').show();
                                    this.apiRequest(this.elgibilityObj, role);

                                } else {
                                    this.hasEmailInvalidError = true;
                                }

                            } else {
                                $('#loader').show();
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
                    this.elgibilityObj.registerd_gp = this.elgibilityObj.regGpTxt;
                    this.apiRequest(this.elgibilityObj, role);
                }
                else if (role === 'child') {
                    this.elgibilityObj.registerd_gp = this.elgibilityObj.regGpTxt;
                    this.apiRequest(this.elgibilityObj, role);
                }
            },

            apiRequest: function (payload, role) {
                if (role == "professional") {
                    payload.prof_ChildDob = this.dateFmt;
                }
                else {
                    payload.child_Dob = this.dateFmt;
                }
                var _self = this;
                $.ajax({
                    url: API_URI + "/eligibility",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    success: function (data) {
                        //alert("section 1 saved.");
                        // //console.log(data);
                        _self.isSubmitted = false;
                        if (role === 'professional') {
                            _self.resetValidation();
                        }
                        if (_self.paramValues != undefined && _self.paramValues[0] == "loginFlag") {
                            var url = window.location.href.split('?')[0];
                            //  //console.log(url)
                            location.href = redirectUrl(url, "about", data.userid, role);
                        }
                        else {
                            location.href = redirectUrl(location.href, "about", data.userid, role);
                        }

                    },
                    error: function (error) {
                        $('#loader').hide();
                        //console.log(error.responseJSON.message)
                    }
                });
            },


            resetValidation: function () {
                this.hasNameInvalidError = false;
                this.hasNameReqError = false;
                this.hasEmailInvalidError = false;
                this.hasContactInvalidError = false;
                this.hasContactReqError = false;
            },

            diff_years: function (dt2, dt1) {
                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                return Math.abs(Math.round(diff / 365.25));
            },

            convertDate: function (dbDate) {
                var date = new Date(dbDate)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();

                var mmChars = mm.split('');
                var ddChars = dd.split('');
                var showDate = (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + yyyy
                this.dateFmt = yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0])
                // 'DD/MM/YYYY'
                // return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
                return showDate;
            },

            setDate: function (dbDate) {
                //console.log(dbDate.split("/"))
                var dateArray = dbDate.split("/");
                var toOldFmt = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
                var date = new Date(toOldFmt)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();

                var mmChars = mm.split('');
                var ddChars = dd.split('');
                var showDate = (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + yyyy
                // 'DD/MM/YYYY'
                return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
                //return showDate;
            },

            fetchAgeLogic: function (dbdob, roleText) {
                //          //console.log(dbdob);
                var today = new Date();
                var selectedDate = new Date(dbdob);
                var age = this.diff_years(today, selectedDate);
                //          //console.log(age);
                if (roleText == 'child') {
                    if (age < 15) {

                        this.elgibilityObj.belowAgeLimit = "yes";
                        this.elgibilityObj.aboveLimit = "";
                        this.elgibilityObj.camhs = "";
                        this.elgibilityObj.submitForm = "false";
                    }
                    else if (age > 19) {
                        this.elgibilityObj.boveLimit = "yes";
                        this.elgibilityObj.belowAgeLimit = "";
                        this.elgibilityObj.camhs = "";
                        this.elgibilityObj.submitForm = "false";
                    }
                    else {
                        this.elgibilityObj.camhs = "show";
                        this.elgibilityObj.belowAgeLimit = "";
                        this.elgibilityObj.aboveLimit = "";
                        this.elgibilityObj.submitForm = "false";
                    }
                }
                else if (roleText == 'professional') {
                    if (age < 15) {
                        this.elgibilityObj.profBelowAgeLimit = "yes";
                        this.elgibilityObj.profaboveLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.elgibilityObj.submitProfForm = "false";
                    }
                    else if (age > 19) {
                        this.elgibilityObj.profaboveLimit = "yes";
                        this.elgibilityObj.profBelowAgeLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.elgibilityObj.submitProfForm = "false";
                    }
                    else {
                        this.elgibilityObj.parentConcern = "show";
                        this.elgibilityObj.profBelowAgeLimit = "";
                        this.elgibilityObj.profaboveLimit = "";
                        this.elgibilityObj.submitProfForm = "false";
                    }
                }

                else if (roleText == 'parent') {
                    if (age > 19) {
                        this.elgibilityObj.aboveLimit = "yes";
                        this.elgibilityObj.camhs = "";
                        this.elgibilityObj.submitForm = "false";
                    }
                    else {
                        this.elgibilityObj.camhs = "show";
                        this.elgibilityObj.belowAgeLimit = "";
                        this.elgibilityObj.aboveLimit = "";
                        this.elgibilityObj.submitForm = "false";
                    }

                }

            },

            bindGpAddress: function (gpAddress, role) {
                if (role == "professional") {
                    if (gpAddress != undefined || gpAddress != "") {
                        this.submitProfForm = "true";
                        return gpAddress;
                    }
                }
                else {
                    if (gpAddress != undefined || gpAddress != "") {
                        this.elgibilityObj.submitForm = "true";
                        return gpAddress;
                    }
                }
            },

            getUrlVars: function () {
                var vars = {};
                var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                    function (m, key, value) {
                        vars[key] = value;
                    });


                return vars;
            },

            restrictDate: function () {

                var dtToday = new Date();

                var month = dtToday.getMonth() + 1;
                var day = dtToday.getDate();
                var year = dtToday.getFullYear();

                if (month < 10)
                    month = '0' + month.toString();
                if (day < 10)
                    day = '0' + day.toString();

                var currentDate = year + '-' + month + '-' + day;

                return currentDate;

            },

            remove_duplicates: function (arr) {
                var obj = {};
                var ret_arr = [];
                for (var i = 0; i < arr.length; i++) {
                    obj[arr[i]] = true;
                }
                for (var key in obj) {
                    ret_arr.push(key);
                }
                return ret_arr;
            }
        }
    })

});