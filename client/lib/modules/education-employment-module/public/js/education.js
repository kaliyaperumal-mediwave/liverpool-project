
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

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.userId = this.paramValues[0];
            this.userRole = this.paramValues[1];
            this.userMode = this.paramValues[2];
            this.dynamicLabels = getDynamicLabels(this.userRole);
            $('#loader').hide();
            if (this.userMode != undefined) {
                this.fetchSavedData();
            }
            if (getUrlVars()['edt'] == 1) {
                this.fetchSavedData();
            }
            this.initMaps()
        },

        methods: {

            initMaps: function () {
                var _self = this;
                var autoCompleteChild;
                autoCompleteChild = new google.maps.places.Autocomplete((document.getElementById('attendedLocation')), {
                    types: ['establishment'],
                });
                google.maps.event.addListener(autoCompleteChild, 'place_changed', function () {
                    _self.educationAddress = autoCompleteChild.getPlace().name + ',' + autoCompleteChild.getPlace().formatted_address;
                    if (_self.educationAddress) {
                        _self.mapsEntered = true;
                        _self.educAndEmpData.attendedInfo = _self.educationAddress;
                    } else {
                        _self.mapsEntered = false;
                    }
                });
            },

            onOptionChange: function (event) {
                var questionIdentifier = event.target.name;
                if (questionIdentifier == 'currentPosition' || questionIdentifier == 'EHCP' || questionIdentifier == 'EHAT' || questionIdentifier == 'SocialWorker') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                }
            },

            //Form Submittion of Section-4(Referral) with validation logic
            saveAndContinue: function () {
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
                            $('#loader').show();
                            this.upsertEducationForm(this.payloadData);
                        }
                        else if (formData.position != 'education') {
                            $('#loader').show();
                            this.upsertEducationForm(this.payloadData);
                        }

                        else {
                            scrollToInvalidInput();
                            return false;
                        }

                    } else {
                        scrollToInvalidInput();
                        return false;
                    }
                } else if (formData.haveSocialWorker === 'no') {
                    if (formData.position === 'education' && formData.attendedInfo) {
                        $('#loader').show();
                        this.upsertEducationForm(this.payloadData);
                    }
                    else if (formData.position != 'education') {
                        $('#loader').show();
                        this.upsertEducationForm(this.payloadData);
                    }
                    else {
                        scrollToInvalidInput();
                        return false;
                    }
                }

                else {
                    $('#loader').show();
                    this.upsertEducationForm(this.payloadData);
                }

            },

            //Section 3(Education) Save and Service call with navaigation Logic
            upsertEducationForm: function (payload) {
                // console.log(payload);
                var _self = this;
                var responseData = apiCallPost('post', '/education', payload);
                if (responseData && Object.keys(responseData)) {
                    $('#loader').hide();
                    location.href = redirectUrl(location.href, "referral", responseData.userid, responseData.role);
                } else {
                    $('#loader').hide();
                    console.log('empty response')
                }
            },

            //Edit Api call
            fetchSavedData: function () {
                var payload = {};
                payload.uuid = this.userId;
                payload.role = this.userRole;
                var successData = apiCallPost('post', '/fetchProfession', payload);
                if (Object.keys(successData)) {
                    this.patchValue(successData);
                } else {
                    $('#loader').hide();
                    console.log('empty response')
                }

            },

            //Patching the value logic
            patchValue: function (data) {
                if (this.userRole == "child") {
                    if (data.child_education_place) {
                        Vue.set(this.educAndEmpData, "attendedInfo", data.child_education_place);
                    }
                    Vue.set(this.educAndEmpData, "position", data.child_profession);
                    Vue.set(this.educAndEmpData, "haveEhcpPlan", data.child_EHCP);
                    Vue.set(this.educAndEmpData, "haveEhat", data.child_EHAT);
                    Vue.set(this.educAndEmpData, "haveSocialWorker", data.child_socialworker);
                    Vue.set(this.educAndEmpData, "socialWorkName", data.child_socialworker_name);
                    Vue.set(this.educAndEmpData, "socialWorkContact", data.child_socialworker_contact);
                }
                else if (this.userRole == "parent") {

                    if (data[0].parent[0].child_education_place) {
                        Vue.set(this.educAndEmpData, "attendedInfo", data[0].parent[0].child_education_place);
                    }
                    Vue.set(this.educAndEmpData, "position", data[0].parent[0].child_profession);
                    //   Vue.set(this.educAndEmpData,"childEducationPlace",data[0].parent[0].child_education_place);
                    Vue.set(this.educAndEmpData, "haveEhcpPlan", data[0].parent[0].child_EHCP);
                    Vue.set(this.educAndEmpData, "haveEhat", data[0].parent[0].child_EHAT);
                    Vue.set(this.educAndEmpData, "haveSocialWorker", data[0].parent[0].child_socialworker);
                    Vue.set(this.educAndEmpData, "socialWorkName", data[0].parent[0].child_socialworker_name);
                    Vue.set(this.educAndEmpData, "socialWorkContact", data[0].parent[0].child_socialworker_contact);
                }
                else if (this.userRole == "professional") {
                    if (data[0].professional[0].child_education_place) {
                        Vue.set(this.educAndEmpData, "attendedInfo", data[0].professional[0].child_education_place);
                    }
                    Vue.set(this.educAndEmpData, "position", data[0].professional[0].child_profession);
                    Vue.set(this.educAndEmpData, "haveEhcpPlan", data[0].professional[0].child_EHCP);
                    Vue.set(this.educAndEmpData, "haveEhat", data[0].professional[0].child_EHAT);
                    Vue.set(this.educAndEmpData, "haveSocialWorker", data[0].professional[0].child_socialworker);
                    Vue.set(this.educAndEmpData, "socialWorkName", data[0].professional[0].child_socialworker_name);
                    Vue.set(this.educAndEmpData, "socialWorkContact", data[0].professional[0].child_socialworker_contact);
                }
                $('#loader').hide();
            },

            //Back to previous page
            backToAbout: function () {
                backToPreviousPage('/about?', this.userId, this.userRole)
            },
        }
    })
});