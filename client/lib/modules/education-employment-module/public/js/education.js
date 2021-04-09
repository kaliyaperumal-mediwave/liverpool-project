
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
                socialWorkContact: '',
                referral_progress: 60
            },
            prevAddressData: null,
            educationManualAddressData: [],
            addressData: {
                school: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: ''
            },
            isAddressFormSubmitted: false,
            yourAreIn: [{
                id: 'c1035a21-07a4-407f-a8d0-dcc0e70c6e07',
                value: 'Education'
            }, {
                id: '8a7060dd-1b5e-434c-846e-80f5ef0f34b5',
                value: 'Employment'

            }, {
                id: '4dea507b-fca1-4cc9-a68b-953e1fb81ff5',
                value: 'Neither'

            }],
            currentSection: 'education',
            userRole: '',
            userId: '',
            payloadData: {},
            dynamicLabels: {},
            educationAddress: '',
            mapsEntered: false,
            isFormSubmitted: false,
            phoneRegex: /^[0-9,-]{10,15}$|^$/,
            aboutYourSelf: [],
            showInstitution: false
        },

        beforeMount: function () {
            $('#loaderEduc').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.userId = document.getElementById('uUid').innerHTML;
            this.userRole = document.getElementById('uRole').innerHTML;
            this.dynamicLabels = getDynamicLabels(this.userRole);
            this.fetchSavedData();
            this.initMaps();
            $('#loaderEduc').hide();
        },

        methods: {

            initMaps: function () {
                $('#loaderEduc').hide();
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

            getManualAddress: function (e) {
                console.log(e);
                $('#educationModal').modal('show');
            },

            // Getting Manual Address
            getManualAddress: function () {
                $('#educationModal').modal('show');
                this.resetAddressModalValues();
            },

            //Adding and Updating a address logic
            upsertAddress: function () {
                manualAddressLogic(this, 'addressData', 'educationManualAddressData');
                this.educAndEmpData.attendedInfo = "";
                document.getElementById('2df66d79-a41a-4c4e-acee-171c39fe26f5').style.pointerEvents = "none";
                document.getElementById('2df66d79-a41a-4c4e-acee-171c39fe26f5').style.opacity = 0.7;
                document.getElementById('c4238c48-4dd6-405c-b3d9-cda7f17bdcb8').style.pointerEvents = "none";
                document.getElementById('c4238c48-4dd6-405c-b3d9-cda7f17bdcb8').style.opacity = 0.5;
            },

            //Patching the HouseHold logic
            patchAddress: function (address) {
                patchManualAddress(this, 'addressData', address, 'educationManualAddressData');
                this.prevAddressData = JSON.parse(JSON.stringify(this.educationManualAddressData));
            },

            //Resetting the modal values of service data
            resetAddressModalValues: function () {
                this.isAddressFormSubmitted = false;
                this.addressData.addressLine1 = '';
                this.addressData.addressLine2 = '';
                this.addressData.city = '';
                this.addressData.country = '';
                this.addressData.postCode = '';
                this.addressData.mode = '';
            },

            //Delete service logic
            deleteSect3ManualAddress: function () {
                deleteLogicManualAddress(this.educationManualAddressData, this.addressData, this, 'educationManualAddressData',
                    '2df66d79-a41a-4c4e-acee-171c39fe26f5', 'c4238c48-4dd6-405c-b3d9-cda7f17bdcb8');
                $('#deleteAddressModal').modal('hide');
            },

            checkArrayLength: function (arr) {
                if (arr && Array.from(arr).length) {
                    return true;
                } else {
                    return false;
                }
            },

            resetAddressValue: function (data) {
                if (this.addressData.mode && this.addressData.mode === 'add') {
                    this.resetAddressModalValues();
                } else if (this.addressData.mode && this.addressData.mode === 'update') {
                    var prevAddressObj = convertArrayToObj(this.prevAddressData);
                    if (this.addressData.mode === 'update') {
                        if (_.isEqual(this.addressData, prevAddressObj)) {
                            this.addressData = this.addressData;
                        } else {
                            this.educationManualAddressData = [];
                            this.educationManualAddressData.push(prevAddressObj);
                        }
                        return true;
                    } else {
                        this.resetAddressModalValues();
                    }
                }
            },

            onOptionChange: function (event) {
                var _self = this;
                var questionIdentifier = event.target.name;
                var data = event.target.value;
                if (questionIdentifier == 'currentPosition') {
                    if (event.target.checked) {
                        if (data == 'Education') {
                            var neitherIndex = _self.aboutYourSelf.indexOf('Neither');
                            if (neitherIndex != -1) {
                                _self.aboutYourSelf.splice(neitherIndex, 1);
                            }
                            _self.showInstitution = true;
                            $('#4dea507b-fca1-4cc9-a68b-953e1fb81ff5').attr('checked', false);
                            resetValues(event.target.form, this, 'educAndEmpData');

                        } else if (data == 'Employment') {
                            var neitherIndex = _self.aboutYourSelf.indexOf('Neither');
                            if (neitherIndex != -1) {
                                _self.aboutYourSelf.splice(neitherIndex, 1);
                            }
                            if (_self.aboutYourSelf.indexOf('Education') != -1) {
                                _self.showInstitution = true;
                            }
                            $('#4dea507b-fca1-4cc9-a68b-953e1fb81ff5').attr('checked', false);
                            resetValues(event.target.form, this, 'educAndEmpData');

                        }
                        else if (data == 'Neither') {
                            $('#c1035a21-07a4-407f-a8d0-dcc0e70c6e07').attr('checked', false);
                            $('#8a7060dd-1b5e-434c-846e-80f5ef0f34b5').attr('checked', false);
                            _self.showInstitution = false;
                            _self.aboutYourSelf = ['Neither'];
                            resetValues(event.target.form, this, 'educAndEmpData');
                        }

                    } else {
                        if (data == 'Education') {
                            _self.showInstitution = false;

                        }
                        resetValues(event.target.form, this, 'educAndEmpData');
                    }

                }
                else if (questionIdentifier == 'EHCP' || questionIdentifier == 'EHAT' || questionIdentifier == 'SocialWorker') {
                    resetValues(event.target.form, this, 'educAndEmpData');
                }
            },

            //Form Submission of Section-4(Referral) with validation logic
            saveAndContinue: function () {
                this.isFormSubmitted = true;
                var formData = this.educAndEmpData;
                this.payloadData.educAndEmpData = JSON.parse(JSON.stringify(formData));
                this.payloadData.role = this.userRole;
                this.payloadData.userid = this.userId;
                if (formData.haveSocialWorker === 'yes') {
                    if (formData.socialWorkContact && !this.phoneRegex.test(formData.socialWorkContact)) {
                        scrollToInvalidInput();
                        return false;
                    } else {
                        if (this.showInstitution) {
                            if (formData.attendedInfo) {
                                $('#loaderEduc').show();
                                this.upsertEducationForm(this.payloadData);
                            } else {
                                scrollToInvalidInput();
                                return false;
                            }

                        }
                        else {
                            $('#loaderEduc').show();
                            this.upsertEducationForm(this.payloadData);
                        }
                    }


                    // if (!formData.socialWorkName && !formData.socialWorkContact && this.phoneRegex.test(formData.socialWorkContact)) {
                    //     if (this.showInstitution) {
                    //         if (formData.attendedInfo) {
                    //             $('#loaderEduc').show();
                    //             this.upsertEducationForm(this.payloadData);
                    //         } else {
                    //             scrollToInvalidInput();
                    //             return false;
                    //         }

                    //     }
                    //     else {
                    //         $('#loaderEduc').show();
                    //         this.upsertEducationForm(this.payloadData);
                    //     }

                    // } else {
                    //     scrollToInvalidInput();
                    //     return false;
                    // }


                }
                else if (formData.haveSocialWorker === 'no') {
                    if (this.showInstitution) {
                        if (formData.attendedInfo) {
                            $('#loaderEduc').show();
                            this.upsertEducationForm(this.payloadData);

                        } else {
                            scrollToInvalidInput();
                            return false;
                        }

                    } else {
                        $('#loaderEduc').show();
                        this.upsertEducationForm(this.payloadData);
                    }



                    // if (this.aboutYourSelf[0] == "Neither") {
                    //     $('#loaderEduc').show();
                    //     this.upsertEducationForm(this.payloadData);

                    // } else {
                    //     if (this.showInstitution) {
                    //         if (formData.attendedInfo) {
                    //             $('#loaderEduc').show();
                    //             this.upsertEducationForm(this.payloadData);
                    //         } else {
                    //             scrollToInvalidInput();
                    //             return false;
                    //         }

                    //     }
                    //     else {
                    //         $('#loaderEduc').show();
                    //         this.upsertEducationForm(this.payloadData);
                    //     }
                    // }

                    // if (formData.position === 'education' && formData.attendedInfo) {
                    //     $('#loaderEduc').show();
                    //     this.upsertEducationForm(this.payloadData);
                    // }
                    // else if (formData.position != 'education') {
                    //     $('#loaderEduc').show();
                    //     this.upsertEducationForm(this.payloadData);
                    // }
                    // else {
                    //     scrollToInvalidInput();
                    //     return false;
                    // }
                }

                else {
                    $('#loaderEduc').show();
                    this.upsertEducationForm(this.payloadData);
                }

            },

            //Section 3(Education) Save and Service call with navigation's Logic
            upsertEducationForm: function (payload) {
                payload.educAndEmpData.position = this.aboutYourSelf.toString();
                var responseData = apiCallPost('post', '/education', payload);
                if (responseData && Object.keys(responseData)) {
                    $('#loaderEduc').hide();
                    if (this.paramValues != undefined) {
                        if (this.paramValues[0] == "sec5back") {
                            location.href = "/review";
                        }
                        else {
                            var url = location.href;
                            location.href = "/referral?" + url.substring(url.indexOf("?") + 1);
                        }
                    }
                    else {
                        location.href = "/referral";
                    }

                } else {
                    $('#loaderEduc').hide();
                    //console.log('empty response')
                }
            },

            //Edit Api call
            fetchSavedData: function () {
                var payload = {};
                payload.uuid = this.userId;
                payload.role = this.userRole;
                var successData = apiCallPost('post', '/fetchProfession', payload);
                if (successData && Object.keys(successData)) {
                    this.patchValue(successData);
                } else {
                    $('#loaderEduc').hide();
                    //console.log('empty response')
                }

            },

            //Function to trim space entered
            trimWhiteSpace: function (event, obj, key) {
                preventWhiteSpaces(event, this, obj, key)
            },

            //Patching the value logic
            patchValue: function (data) {
                if (this.userRole == "child") {
                    if (data.child_education_place) {
                        Vue.set(this.educAndEmpData, "attendedInfo", data.child_education_place);
                    }
                    if (data.child_profession) {
                        data.child_profession = capitalizeFirstLetter(data.child_profession);
                        var convertArray = data.child_profession.split(",");
                        if (convertArray.indexOf('Education') != -1) {
                            this.showInstitution = true;
                        }
                        this.aboutYourSelf = convertArray;
                    }
                    //Vue.set(this.educAndEmpData, "position", data.child_profession);
                    Vue.set(this.educAndEmpData, "haveEhcpPlan", data.child_EHCP);
                    Vue.set(this.educAndEmpData, "haveEhat", data.child_EHAT);
                    Vue.set(this.educAndEmpData, "haveSocialWorker", data.child_socialworker);
                    Vue.set(this.educAndEmpData, "socialWorkName", data.child_socialworker_firstname);
                    Vue.set(this.educAndEmpData, "socialWorkLastName", data.child_socialworker_lastname);
                    Vue.set(this.educAndEmpData, "socialWorkContact", data.child_socialworker_contact);
                    Vue.set(this.educAndEmpData, "referral_progress", data.referral_progress == 40 ? 60 : data.referral_progress);
                }
                else if (this.userRole == "parent") {
                    if (data[0].parent[0].child_education_place) {
                        Vue.set(this.educAndEmpData, "attendedInfo", data[0].parent[0].child_education_place);
                    }
                    if (data[0].parent[0].child_profession) {
                        data[0].parent[0].child_profession = capitalizeFirstLetter(data[0].parent[0].child_profession);
                        var convertArray = data[0].parent[0].child_profession.split(",");
                        if (convertArray.indexOf('Education') != -1) {
                            this.showInstitution = true;
                        }
                        this.aboutYourSelf = convertArray;
                    }
                    // Vue.set(this.educAndEmpData, "position", data[0].parent[0].child_profession);
                    //   Vue.set(this.educAndEmpData,"childEducationPlace",data[0].parent[0].child_education_place);
                    Vue.set(this.educAndEmpData, "haveEhcpPlan", data[0].parent[0].child_EHCP);
                    Vue.set(this.educAndEmpData, "haveEhat", data[0].parent[0].child_EHAT);
                    Vue.set(this.educAndEmpData, "haveSocialWorker", data[0].parent[0].child_socialworker);
                    Vue.set(this.educAndEmpData, "socialWorkName", data[0].parent[0].child_socialworker_firstname);
                    Vue.set(this.educAndEmpData, "socialWorkLastName", data[0].parent[0].child_socialworker_lastname);
                    Vue.set(this.educAndEmpData, "socialWorkContact", data[0].parent[0].child_socialworker_contact);
                    Vue.set(this.educAndEmpData, "referral_progress", data[0].referral_progress == 40 ? 60 : data[0].referral_progress);
                }
                else if (this.userRole == "professional") {
                    if (data[0].professional[0].child_education_place) {
                        Vue.set(this.educAndEmpData, "attendedInfo", data[0].professional[0].child_education_place);
                    }
                    if (data[0].professional[0].child_profession) {
                        data[0].professional[0].child_profession = capitalizeFirstLetter(data[0].professional[0].child_profession);
                        var convertArray = data[0].professional[0].child_profession.split(",");
                        if (convertArray.indexOf('Education') != -1) {
                            this.showInstitution = true;
                        }
                        this.aboutYourSelf = convertArray;
                    }
                    //Vue.set(this.educAndEmpData, "position", data[0].professional[0].child_profession);
                    Vue.set(this.educAndEmpData, "haveEhcpPlan", data[0].professional[0].child_EHCP);
                    Vue.set(this.educAndEmpData, "haveEhat", data[0].professional[0].child_EHAT);
                    Vue.set(this.educAndEmpData, "haveSocialWorker", data[0].professional[0].child_socialworker);
                    Vue.set(this.educAndEmpData, "socialWorkName", data[0].professional[0].child_socialworker_firstname);
                    Vue.set(this.educAndEmpData, "socialWorkLastName", data[0].professional[0].child_socialworker_lastname);
                    Vue.set(this.educAndEmpData, "socialWorkContact", data[0].professional[0].child_socialworker_contact);
                    Vue.set(this.educAndEmpData, "referral_progress", data[0].referral_progress == 40 ? 60 : data[0].referral_progress);
                }
            },

        }
    })
});