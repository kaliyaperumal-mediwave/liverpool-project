
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



            this.paramValues = getParameter(location.href)
            this.userId = this.paramValues[0];
            this.userRole = this.paramValues[1];
            this.userMode = this.paramValues[2];
            this.dynamicLabels = getDynamicLabels(this.userRole);
            console.log(this.userId, this.userRole, this.userMode)
            if (this.userMode != undefined) {
                // this.patchValue();
                this.fetchSavedData();
            }
            if (getUrlVars()['edt'] == 1) {
                this.fetchSavedData();
            }
           // google.maps.event.addDomListener(window, 'load', _self.initMaps);
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
                 //   console.log(autoCompleteChild.getPlace())
                    _self.educationAddress = autoCompleteChild.getPlace().name +','+autoCompleteChild.getPlace().formatted_address;
                    if (_self.educationAddress) {
                        _self.mapsEntered = true;
                        _self.educAndEmpData.attendedInfo = _self.educationAddress;
                    } else {
                        _self.mapsEntered = false;
                    }
                });
            },

            onOptionChange: function(event) {
                var questionIdentifier = event.target.name;
                if (questionIdentifier == 'currentPosition' || questionIdentifier == 'EHCP' || questionIdentifier == 'EHAT' || questionIdentifier == 'SocialWorker') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                }
            },

            //Form Submittion of Section-4(Referral) with validation logic
            saveAndContinue: function() {
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
            upsertEducationForm: function(payload) {
               // console.log(payload);
                var _self = this;
                var responseData = apiCallPost('post', '/education', payload);
                if (Object.keys(responseData)) {
                    location.href = redirectUrl(location.href, "referral", responseData.userid, responseData.role);
                    // if (this.paramValues[2] == undefined) {
                    //     var parameter =  this.userId +"&"+ this.userRole 
                    //     var enCodeParameter = btoa(parameter)
                    //     location.href = "/referral?"+enCodeParameter;

                    //    // location.href = "/referral?userid=" + responseData.userid + "&role=" + responseData.role;
                    // }
                    // else {
                    //     if (sessionStorage.getItem("section5") == "edit") {
                    //         var parameter = _self.paramValues[0] + "&" + _self.paramValues[1];
                    //         var enCodeParameter = btoa(parameter)
                    //         location.href = "/review?" + enCodeParameter;
                    //     }
                    //     else {
                    //         history.back();
                    //     }

                    //    // history.back();
                    // }
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
                console.log(successData);
                this.patchValue(successData);
            },

            //Patching the value logic
            patchValue: function(data) {
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
                    Vue.set(this.educAndEmpData, "haveEhcpPlan", data[0].parent[0].child_EHAT);
                    Vue.set(this.educAndEmpData, "haveEhat", data[0].parent[0].child_EHCP);
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



                    //  Vue.set(this.professionObj,"childProfession",data[0].professional[0].child_profession);
                    //    Vue.set(this.professionObj,"childEducationPlace",data[0].professional[0].child_education_place);
                    //    Vue.set(this.professionObj,"childEHCP",data[0].professional[0].child_EHAT);
                    //    Vue.set(this.professionObj,"childEHAT",data[0].professional[0].child_EHCP);
                    //    Vue.set(this.professionObj,"isSocialWorker",data[0].professional[0].child_socialworker);
                    //    Vue.set(this.professionObj,"socialWorkerName",data[0].professional[0].child_socialworker_name);
                    //    Vue.set(this.professionObj,"socialWorkerContactNumber",data[0].professional[0].child_socialworker_contact);
                }
            },

            //Back to previous page
            backToAbout: function () {
                backToPreviousPage('/about?', this.userId, this.userRole)
            },
        }
    })
});