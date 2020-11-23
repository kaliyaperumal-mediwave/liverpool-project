
var API_URI = "/modules/education-employment-module";

$(document).ready(function () {
    var app = new Vue({
        el: '#education-form',
        data: {
            educAndEmpData: {
                position: '',
                haveEhcpPlan: '',
                haveEhat: '',
                attendedInfo: '',
                haveSocialWorker: '',
                socialWorkName: '',
                socialWorkContact: ''
            },
            educationAddress: '',
            mapsEntered: false,
            isFormSubmitted: false,
            currentSection: '',
            phoneRegex: /^[0-9,-]{10,15}$|^$/,
        },
        mounted: function () {
            var _self = this;
            google.maps.event.addDomListener(window, 'load', _self.initMaps);
        },
        methods: {

            initMaps: function () {
                var _self = this;
                var autoCompleteChild;
                autoCompleteChild = new google.maps.places.Autocomplete((document.getElementById('attendedLocation')), {
                    types: ['geocode'],
                });
                google.maps.event.addListener(autoCompleteChild, 'place_changed', function () {
                    debugger;
                    _self.educationAddress = autoCompleteChild.getPlace().formatted_address;
                    if (_self.educationAddress) {
                        _self.mapsEntered = true;
                        _self.educAndEmpData.attendedInfo = _self.educationAddress;
                    } else {
                        _self.mapsEntered = false;
                    }

                });
            },

            addressChange(e) {
                debugger;
                console.log(e);
                if (e.target.length) {
                    if (this.educationAddress) {
                        this.mapsEntered = true;
                    } else {
                        this.mapsEntered = false;
                    }
                } else {
                    if (this.educationAddress) {
                        this.mapsEntered = true;
                    } else {
                        this.mapsEntered = false;
                    }
                }

            },

            onOptionChange(event) {
                var questionIdentifier = event.target.name;
                var optionsName = this.educAndEmpData;
                if (questionIdentifier == 'currentPosition') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                } else if (questionIdentifier == 'EHCP') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                } else if (questionIdentifier == 'EHAT') {
                    resetValues(event.target.form, this, 'educAndEmpData');

                } else if (questionIdentifier == 'SocialWorker') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                }
            }

            // fetchSavedData: function () {
            //     console.log("if")
            //     this.sendObj.uuid = this.getUrlVars()['userid'];
            //     this.sendObj.role = this.getUrlVars()['role'];
            //     console.log(this.sendObj);
            //     $.ajax({
            //         url: API_URI + "/fetchProfession",
            //         type: 'post',
            //         dataType: 'json',
            //         contentType: 'application/json',
            //         data: JSON.stringify(this.sendObj),
            //         success: function (data) {
            //             app.setValues(data);

            //         },
            //     });
            // },

            // setValues: function (data) {
            //     var roleType = this.getUrlVars()["role"]
            //     if (roleType == "child") {

            //         Vue.set(this.professionObj, "childProfession", data.child_profession);
            //         Vue.set(this.professionObj, "childEducationPlace", data.child_education_place);
            //         Vue.set(this.professionObj, "childEHCP", data.child_EHAT);
            //         Vue.set(this.professionObj, "childEHAT", data.child_EHCP);
            //         Vue.set(this.professionObj, "isSocialWorker", data.child_socialworker);
            //         Vue.set(this.professionObj, "socialWorkerName", data.child_socialworker_name);
            //         Vue.set(this.professionObj, "socialWorkerContactNumber", data.child_socialworker_contact);
            //     }
            //     else if (roleType == "parent") {
            //         //  console.log(data);

            //         Vue.set(this.professionObj, "childProfession", data[0].parent[0].child_profession);
            //         Vue.set(this.professionObj, "childEducationPlace", data[0].parent[0].child_education_place);
            //         Vue.set(this.professionObj, "childEHCP", data[0].parent[0].child_EHAT);
            //         Vue.set(this.professionObj, "childEHAT", data[0].parent[0].child_EHCP);
            //         Vue.set(this.professionObj, "isSocialWorker", data[0].parent[0].child_socialworker);
            //         Vue.set(this.professionObj, "socialWorkerName", data[0].parent[0].child_socialworker_name);
            //         Vue.set(this.professionObj, "socialWorkerContactNumber", data[0].parent[0].child_socialworker_contact);
            //     }
            //     else if (roleType == "professional") {

            //         Vue.set(this.professionObj, "childProfession", data[0].professional[0].child_profession);
            //         Vue.set(this.professionObj, "childEducationPlace", data[0].professional[0].child_education_place);
            //         Vue.set(this.professionObj, "childEHCP", data[0].professional[0].child_EHAT);
            //         Vue.set(this.professionObj, "childEHAT", data[0].professional[0].child_EHCP);
            //         Vue.set(this.professionObj, "isSocialWorker", data[0].professional[0].child_socialworker);
            //         Vue.set(this.professionObj, "socialWorkerName", data[0].professional[0].child_socialworker_name);
            //         Vue.set(this.professionObj, "socialWorkerContactNumber", data[0].professional[0].child_socialworker_contact);
            //     }

            // },

            // backToAbout: function () {
            //     var uid = this.getUrlVars()['userid'];
            //     var role = this.getUrlVars()['role'];
            //     location.href = "/about?userid=" + uid + "&role=" + role + "&edt=1";
            // },
            // initialize: function () {
            //     var _self = this;
            //     var autoCompleteChild;
            //     autoCompleteChild = new google.maps.places.Autocomplete((document.getElementById('childEducationPlace')), {
            //         types: ['geocode'],
            //     });
            //     google.maps.event.addListener(autoCompleteChild, 'place_changed', function () {
            //         _self.childEducation = autoCompleteChild.getPlace().formatted_address;
            //     });
            // },

            // onChange: function (event) {
            //     var optionText = event.target.name;
            //     if ((optionText == "childProfession" && this.professionObj.childEducationPlace != undefined) || (optionText == "childProfession" && this.professionObj.childEHCP != undefined)) {
            //         this.professionObj.childEducationPlace = "";
            //         this.professionObj.childEHCP = "";
            //         this.professionObj.childEHAT = "";
            //         this.professionObj.isSocialWorker = "";
            //         this.professionObj.socialWorkerName = "";
            //         this.professionObj.socialWorkerContactNumber = "";
            //     }

            //     if (optionText == "childEHCP" && this.professionObj.childEHAT != undefined) {
            //         this.professionObj.childEHAT = "";
            //         this.professionObj.isSocialWorker = "";
            //         this.professionObj.socialWorkerName = "";
            //         this.professionObj.socialWorkerContactNumber = "";
            //     }

            //     if (optionText == "childEHAT" && this.professionObj.isSocialWorker != undefined) {
            //         this.professionObj.isSocialWorker = "";
            //         this.professionObj.socialWorkerName = "";
            //         this.professionObj.socialWorkerContactNumber = "";
            //     }
            // },

            // onVaueChange: function (e, type) {
            //     if (this.isSubmitted) {
            //         var phoneRegex = /^[0-9,-]{10,15}$|^$/;
            //         var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
            //         if (type === 'name') {
            //             if (e.target.value.length === 0) {
            //                 this.hasNameReqError = true;
            //             } else {
            //                 if (!nameRegex.test(e.target.value)) {
            //                     this.hasNameInvalidError = true;
            //                 } else {
            //                     this.hasNameInvalidError = false;
            //                 }
            //                 this.hasNameReqError = false;
            //             }

            //         } else if (type === 'contact') {
            //             if (e.target.value.length === 0) {
            //                 this.hasContactReqError = true;
            //                 this.hasContactInvalidError = false;
            //             } else {
            //                 if (!phoneRegex.test(e.target.value)) {
            //                     this.hasContactInvalidError = true;
            //                 } else {
            //                     this.hasContactInvalidError = false;
            //                 }
            //                 this.hasContactReqError = false;
            //             }

            //         }
            //     }
            // },

            // saveEducation: function () {
            //     var _self = this;
            //     var phoneRegex = /^[0-9,-]{10,15}$|^$/;
            //     var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
            //     this.isSubmitted = true;
            //     var userid = this.getUrlVars()['userid'];
            //     var role = this.getUrlVars()['role'];
            //     this.professionObj.userid = userid;
            //     this.professionObj.role = role;
            //     this.professionObj.childEducationPlace = _self.childEducation;
            //     console.log(this.professionObj);
            //     if (this.professionObj.isSocialWorker === 'yes') {
            //         if (this.professionObj.socialWorkerName && this.professionObj.socialWorkerContactNumber) {
            //             if (nameRegex.test(this.professionObj.socialWorkerName) && phoneRegex.test(this.professionObj.socialWorkerContactNumber)) {
            //                 this.apiRequest(this.professionObj, this.professionObj.isSocialWorker);
            //             } else {
            //                 if (!nameRegex.test(this.professionObj.socialWorkerName)) {
            //                     this.hasNameInvalidError = true;
            //                 } else {
            //                     this.hasNameInvalidError = false;
            //                 }
            //                 if (!phoneRegex.test(this.professionObj.socialWorkerContactNumber)) {
            //                     this.hasContactInvalidError = true;
            //                 } else {
            //                     this.hasContactInvalidError = false;
            //                 }
            //             }
            //         } else {
            //             if (this.professionObj.socialWorkerName === undefined) {
            //                 this.hasNameReqError = true;
            //             } else {
            //                 this.hasNameReqError = false;
            //             }
            //             if (this.professionObj.socialWorkerContactNumber === undefined) {
            //                 this.hasContactReqError = true;
            //             } else {
            //                 this.hasContactReqError = false;
            //             }
            //         }
            //     } else {
            //         this.apiRequest(this.professionObj, this.professionObj.isSocialWorker);
            //     }
            // },

            // apiRequest: function (payload, role) {
            //     var _self = this;
            //     $.ajax({
            //         url: API_URI + "/education",
            //         type: 'post',
            //         dataType: 'json',
            //         contentType: 'application/json',
            //         data: JSON.stringify(payload),
            //         success: function (data) {
            //             //  alert("section 3 saved.");
            //             this.isSubmitted = false;
            //             console.log(data);
            //             if (_self.getUrlVars()['edt'] == null) {
            //                 location.href = "/referral?userid=" + data.userid + "&role=" + new URL(location.href).searchParams.get('role');
            //             }
            //             else {
            //                 history.back();
            //             }
            //         },
            //     });
            // },
            // resetValidation: function () {
            //     this.hasNameInvalidError = false;
            //     this.hasNameReqError = false;
            //     this.hasContactInvalidError = flase;
            //     this.hasContactReqError = false;
            // },

            // getUrlVars: function () {
            //     var vars = {};
            //     var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
            //         function (m, key, value) {
            //             vars[key] = value;
            //         });


            //     return vars;
            // }
        }
    })
});