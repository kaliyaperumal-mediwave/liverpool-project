
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
            currentSection: 'education',
            userMode: '',
            userRole: '',
            userId: '',
            payloadData: {},
            educationAddress: '',
            mapsEntered: false,
            isFormSubmitted: false,
            phoneRegex: /^[0-9,-]{10,15}$|^$/,
        },
        mounted: function () {
            var _self = this;
            google.maps.event.addDomListener(window, 'load', _self.initMaps);
            this.userMode = getQueryStringValue('mode');
            this.userRole = getQueryStringValue('role');
            this.userId = getQueryStringValue('userId');
            if (this.userMode === 'edit') {
                this.patchValue();
            }
            if (getUrlVars()['edt'] == 1) {
                this.fetchSavedData();
            }
        },
        methods: {

            initMaps: function () {
                var _self = this;
                var autoCompleteChild;
                autoCompleteChild = new google.maps.places.Autocomplete((document.getElementById('attendedLocation')), {
                    types: ['geocode'],
                });
                google.maps.event.addListener(autoCompleteChild, 'place_changed', function () {
                    _self.educationAddress = autoCompleteChild.getPlace().formatted_address;
                    if (_self.educationAddress) {
                        _self.mapsEntered = true;
                        _self.educAndEmpData.attendedInfo = _self.educationAddress;
                    } else {
                        _self.mapsEntered = false;
                    }
                });
            },

            onOptionChange(event) {
                var questionIdentifier = event.target.name;
                if (questionIdentifier == 'currentPosition') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                } else if (questionIdentifier == 'EHCP') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                } else if (questionIdentifier == 'EHAT') {
                    resetValues(event.target.form, this, 'educAndEmpData');

                } else if (questionIdentifier == 'SocialWorker') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                }
            },

            //Form Submittion of Section-4(Referral) with validation logic
            saveAndContinue() {
                this.isFormSubmitted = true;
                var formData = this.educAndEmpData;
                if (formData.socialWorkName && formData.socialWorkContact && this.phoneRegex.test(formData.socialWorkContact)) {
                    if (formData.position === 'education' && formData.attendedInfo) {
                        this.payloadData.educAndEmpData = JSON.parse(JSON.stringify(formData));
                        this.payloadData.role = this.userRole;
                        this.payloadData.userid = this.userId;
                        if (this.userMode === 'edit') {
                            this.payloadData.userMode = 'edit';
                        } else {
                            this.payloadData.userMode = 'add';
                        }
                        this.upsertEducationForm(this.payloadData);
                    } else {
                        scrollToInvalidInput();
                        return false;
                    }

                } else {
                    scrollToInvalidInput();
                    return false;
                }

            },

            //Section 3(Education) Save and Service call with navaigation Logic
            upsertEducationForm(payload) {
                var responseData = apiCallPost('post', '/saveEducation', payload);
                if (Object.keys(responseData)) {
                    if (getUrlVars()["edt"] == null) {
                        location.href = "/referral?userid=" + data.userid + "&role=" + role;
                    }
                    else {
                        history.back();
                    }
                } else {
                    console.log('empty response')
                }
            },

            //Edit Api call
            fetchSavedData: function () {
                var payload = {};
                payload.userid = this.userId;
                payload.role = this.userRole;
                var successData = apiCallPost('post', '/education', payload);
                this.patchValue(successData);
            },

            //Patching the value logic
            patchValue(data) {
                Vue.set(this.referralData, "support", data.referral_type);
                Vue.set(this.referralData, "covid", data.is_covid);
                Vue.set(this.referralData, "diagnosis", data.mental_health_diagnosis);
                Vue.set(this.referralData, "diagnosisOther", data.diagnosis_other);
                Vue.set(this.referralData, "supportOrSymptoms", data.symptoms_supportneeds);
                Vue.set(this.referralData, "problemsOther", data.symptoms_other);
                Vue.set(this.referralData, "referralInfo", data.referral_issues);
                Vue.set(this.referralData, "hasAnythingInfo", data.has_anything_helped);
                Vue.set(this.referralData, "triggerInfo", data.any_particular_trigger);
                Vue.set(this.referralData, "disabilityOrDifficulty", data.disabilities);
                Vue.set(this.referralData, "accessService", data.any_other_services);
            },

            //Back to previous page
            backToEducation: function () {
                backToPreviousPage('/education')
            },



            // backToAbout: function () {
            //     var uid = this.getUrlVars()['userid'];
            //     var role = this.getUrlVars()['role'];
            //     location.href = "/about?userid=" + uid + "&role=" + role + "&edt=1";
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