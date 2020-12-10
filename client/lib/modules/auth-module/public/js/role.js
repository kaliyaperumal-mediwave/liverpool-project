
//const apiUrl = "/user/eligibility"
var API_URI = "/modules/auth-module";
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
                contactProfParent: ''
            },
            date: null,
            dateWrap: true,
            options: {
                format: 'YYYY/MM/DD',
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
            date: ''
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.getGP();
            this.getProfGP();
            if (this.paramValues != undefined) {
                if (this.paramValues[2] != undefined) {
                    this.elgibilityObj.uuid = this.paramValues[0];
                    this.elgibilityObj.editFlag = this.paramValues[2]
                    this.fetchSavedData()
                }
            }

        },

        methods: {
            fetchSavedData: function () {
                this.sendObj.uuid = this.paramValues[0];
                this.sendObj.role = this.paramValues[1];
                $.ajax({
                    url: API_URI + "/fetchEligibility",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        app.setValues(data);

                    },
                });
            },

            setValues: function (data) {
                var roleType = this.paramValues[1];
                this.patchFlag = true;
                console.log(roleType)
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
            getGP: function () {
                var _self = this;
                gpList = [];

                $.ajax({
                    url: "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177",
                    type: 'get',
                    success: function (response) {
                        _self.gpListShow = response.Organisations;
                        for (i = 0; i < _self.gpListShow.length; i++) {
                            _self.gpListName.push(_self.gpListShow[i].Name + "," + _self.gpListShow[i].PostCode);
                            //_self.gpListPost.push(_self.gpListShow[i].PostCode)
                        }
                        displayNameList = _self.gpListName;
                        displayPostList = _self.gpListPost;
                        console.log(displayNameList);
                        $("#gpLocation").autocomplete({
                            source: displayNameList,
                            response: function (event, ui) {
                                if (ui.content.length == 0) {
                                    $(this).trigger('keydown');
                                } else {

                                    //console.log(ui.content.length);
                                }
                            }
                        });

                    },
                    error: function (err) {
                        console.log(err)
                    },
                })
            },

            getProfGP: function () {
                var _self = this;
                gpList = [];
                $.ajax({
                    url: "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177",
                    type: 'get',
                    success: function (response) {
                        this.gpListShow = response.Organisations;
                        for (i = 0; i < this.gpListShow.length; i++) {
                            _self.gpProfListName.push(this.gpListShow[i].Name + ',' + this.gpListShow[i].PostCode);
                            //    _self.gpProfListPost.push(this.gpListShow[i].PostCode)
                        }
                        displayNameList = _self.gpProfListName;
                        displayPostList = _self.gpProfListPost;

                        $("#gpProfLocation").autocomplete({
                            source: displayNameList,
                        });
                        return;
                    },
                    error: function (err) {
                        console.log(err)
                    },
                })
            },


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
                // console.log("selectTxt");
                var _self = this;
                var selectFlag = false;
                this.elgibilityObj.registerd_gp = {};
                $(".gpLocation").on("autocompleteselect", function (event, ui) {
                    //    console.log(ui.item.label);
                    if (e.target.value === '') {
                        app.elgibilityObj.submitForm = "false";
                    } else {
                        selectFlag = true;
                        app.elgibilityObj.regGpTxt = ui.item.label;
                        app.elgibilityObj.submitForm = "true";
                    }
                });
                // app.submitForm = "true";
                console.log(e.target.value.length)
                if (e.target.value.length == 0) {
                    app.elgibilityObj.submitForm = "false";
                }
                else {
                    app.elgibilityObj.submitForm = "true";
                }
            },

            getProfAddress: function (e) {
                var _self = this;
                var selectFlag = false;
                //  this.elgibilityObj.registerd_gp = {};
                $("#gpProfLocation").on("autocompleteselect", function (event, ui) {
                    //   console.log(ui.item.label);
                    if (e.target.value === '') {
                        app.submitForm = "false";
                    } else {
                        selectFlag = true;
                        app.elgibilityObj.regProfGpTxt = ui.item.label;
                        console.log(app.elgibilityObj.regProfGpTxt);
                        app.elgibilityObj.submitProfForm = "true";
                    }
                });
                if (e.target.value.length === 0) {
                    app.elgibilityObj.submitProfForm = "false";
                }
                else {
                    app.elgibilityObj.submitProfForm = "true";
                }

            },

            changeDob: function (e, date) {
                if (this.patchFlag != true) {
                    var today = new Date();
                    var selectedDate = new Date(date);
                    var age = this.diff_years(today, selectedDate);
                    var roleText = this.elgibilityObj.role;
                    if (this.elgibilityObj.isInformation != undefined) {
                        this.elgibilityObj.isInformation = "";
                    }
                    console.log(age);
                    if (roleText == 'child') {
                        if (age < 15) {
                            this.elgibilityObj.belowAgeLimit = "yes";
                            this.elgibilityObj.aboveLimit = "";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.submitForm = "false";
                        }
                        else if (age > 19) {
                            this.elgibilityObj.aboveLimit = "yes";
                            this.elgibilityObj.belowAgeLimit = "";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.contactParent = "";
                        }
                        else {
                            console.log("343")
                            this.elgibilityObj.contactParent = "yes";
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
                            this.elgibilityObj.contactProfParent = "";
                            this.elgibilityObj.parentConcernInformation = "";
                            this.elgibilityObj.childConcernInformation
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
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.submitForm = "false";
                        }
                        else {
                            this.elgibilityObj.contactParent = "yes";
                            this.elgibilityObj.belowAgeLimit = "";
                            this.elgibilityObj.aboveLimit = "";
                            this.elgibilityObj.submitForm = "false";
                        }

                    }
                }
                else {
                    this.patchFlag = true;
                }

            },

            resetFlag(e) {
                var dynamicHeight;
                var mainWidth = document.getElementsByClassName('main-content-bg')[0].clientWidth
                if (mainWidth <= 350) {
                    dynamicHeight = e.currentTarget.clientWidth + 25;
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
                //  this.elgibilityObj.editFlag = this.getUrlVars()['edt'];
                var phoneRegex = /^[0-9,-]{10,15}$|^$/;
                var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
                var emailRegex = new RegExp(/^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i);
                this.isSubmitted = true;
                console.log(this.elgibilityObj.role);
                var role = this.elgibilityObj.role;
                if (role === 'professional') {
                    this.elgibilityObj.profRegisterd_gp = this.elgibilityObj.regProfGpTxt;
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
                    this.elgibilityObj.registerd_gp = this.elgibilityObj.regGpTxt;
                    this.apiRequest(this.elgibilityObj, role);
                }
                else if (role === 'child') {
                    this.elgibilityObj.registerd_gp = this.elgibilityObj.regGpTxt;
                    this.apiRequest(this.elgibilityObj, role);
                }
            },

            apiRequest: function (payload, role) {
                console.log(payload)
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
                        _self.isSubmitted = false;
                        if (role === 'professional') {
                            _self.resetValidation();
                        }
                        location.href = redirectUrl(location.href, "about", data.userid, role);
                    },
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

                return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
            },

            fetchAgeLogic: function (dbdob, roleText) {
                console.log(dbdob);
                var today = new Date();
                var selectedDate = new Date(dbdob);
                var age = this.diff_years(today, selectedDate);
                console.log(age);
                if (roleText == 'child') {
                    if (age < 15) {

                        this.belowAgeLimit = "yes";
                        this.aboveLimit = "";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else if (age > 19) {
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
                else if (roleText == 'professional') {
                    if (age < 15) {
                        this.profBelowAgeLimit = "yes";
                        this.profaboveLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.submitProfForm = "false";
                    }
                    else if (age > 19) {
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
                    if (age > 19) {
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

            }

        }
    })

});