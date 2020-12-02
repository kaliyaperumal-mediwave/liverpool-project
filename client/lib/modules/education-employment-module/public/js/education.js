
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
            dynamicLabels: {},
            educationAddress: '',
            mapsEntered: false,
            isFormSubmitted: false,
            phoneRegex: /^[0-9,-]{10,15}$|^$/,
        },
        mounted: function () {
            var _self = this;
            this.dynamicLabels = section3Labels;
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
                if (questionIdentifier == 'currentPosition' || questionIdentifier == 'EHCP' || questionIdentifier == 'EHAT' || questionIdentifier == 'SocialWorker') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                }
            },

            //Form Submittion of Section-4(Referral) with validation logic
            saveAndContinue() {
                this.isFormSubmitted = true;
                var formData = this.educAndEmpData;
                this.payloadData.educAndEmpData = JSON.parse(JSON.stringify(formData));
                this.payloadData.role = this.userRole;
                this.payloadData.userid = this.userId;
                if (this.userMode === 'edit') {
                    this.payloadData.userMode = 'edit';
                } else {
                    this.payloadData.userMode = 'add';
                }
                if (formData.haveSocialWorker === 'yes') {
                    if (formData.socialWorkName && formData.socialWorkContact && this.phoneRegex.test(formData.socialWorkContact)) {
                        if (formData.position === 'education' && formData.attendedInfo) {
                            this.upsertEducationForm(this.payloadData);
                        } else {
                            scrollToInvalidInput();
                            return false;
                        }

                    } else {
                        scrollToInvalidInput();
                        return false;
                    }
                } else {
                    this.upsertEducationForm(this.payloadData);
                }

            },

            //Section 3(Education) Save and Service call with navaigation Logic
            upsertEducationForm(payload) {
                var responseData = apiCallPost('post', '/education', payload);
                if (Object.keys(responseData)) {
                    if (getUrlVars()["edt"] == null) {
                        location.href = "/referral?userid=" + responseData.userid + "&role=" + responseData.role;
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
                payload.uuid = this.userId;
                payload.role = this.userRole;
                var successData = apiCallPost('post', '/fetchProfession', payload);
                this.patchValue(successData);
            },

            //Patching the value logic
            patchValue(data) {
                if (data.attendedInfo) {
                    Vue.set(this.educAndEmpData, "attendedInfo", data.attendedInfo);
                }
                Vue.set(this.educAndEmpData, "currentPosition", data.referral_type);
                Vue.set(this.educAndEmpData, "haveEhcpPlan", data.is_covid);
                Vue.set(this.educAndEmpData, "haveEhat", data.mental_health_diagnosis);
                Vue.set(this.educAndEmpData, "haveSocialWorker", data.diagnosis_other);
                Vue.set(this.educAndEmpData, "socialWorkName", data.symptoms_supportneeds);
                Vue.set(this.educAndEmpData, "socialWorkContact", data.symptoms_other);
            },

            //Back to previous page
            backToEducation: function () {
                backToPreviousPage('/about')
            },
        }
    })
});