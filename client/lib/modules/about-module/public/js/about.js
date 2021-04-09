var API_URI = "/modules/about-module";
$(document).ready(function () {
    Vue.component('date-picker', VueBootstrapDatetimePicker);
    var app = new Vue({
        el: '#about-form',
        data: {
            labelToDisplay: "",
            aboutObj: {
                nhsNumber: "",
                childNameTitle: "",
                childFirstName: "",
                childLastName: "",
                childEmail: "",
                contactMode: "mobile",
                childContactNumber: "",
                childAddress: "",
                sendPost: "",
                childGender: "",
                childIdentity: "",
                sexAssignedAtBirth: "",
                childSexualOrientation: "",
                childEthnicity: "",
                childCareAdult: "",
                parentFirstName: "",
                parentLastName: "",
                referral_progress: 40,
            },
            aboutFormData: {
                parentialResponsibility: "",
                parentCarerFirstName: "",
                parentCarerLastName: "",
                relationshipToYou: "",
                contactNumber: "",
                // parentContactMode: "mobile",
                emailAddress: "",
                sameHouse: "",
                parentOrCarrerAddress: "",
                legalCareStatus: ""
            },
            parentContactMode: "mobile",
            prevAddressData: null,
            dateWrap: true,
            options: {
                // format: 'YYYY/MM/DD',
                format: 'DD/MM/YYYY',
                dayViewHeaderFormat: 'MMMM YYYY',
                useCurrent: false,
                allowInputToggle: true,
                minDate: new Date(1950, 10, 25),
                maxDate: moment().endOf('day').add(1, 'sec'),
            },
            sendObj: {},
            sec2dynamicLabel: {},
            houseHoldData: {
                name: '',
                relationShip: '',
                dob: '',
                profession: '',
                lastName: ''
            },
            manualAddressArray: [],
            addressData: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: ''
            },
            manualAddressParentArray: [],
            addressParentData: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: ''
            },
            allHouseHoldMembers: [],
            isAddressFormSubmitted: false,
            isFormSubmitted: false,
            isHouseHoldFormSubmitted: false,
            phoneRegex: /^[0-9,-]{10,15}$|^$/,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            nhsRegex: /^[0-9]{10}$/,
            userRole: '',
            userMode: '',
            userId: '',
            payloadData: {},
            currentSection: 'about',
            childDob: "",
            showBelowAge: "",
            submitForm: "",
            selectedChildAddress: "",
            selectedParentAddress: "",
            empClgSchool: "",
            saveAndCont: "",
            headerToDisplay: "",
            edFlag: false,
            paramValues: [],
            editPatchFlag: false,
            storeDeleteData: null,
            dateFmt: ''
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var _self = this;
            this.paramValues = getParameter(location.href);
            this.userRole = document.getElementById('uRole').innerHTML;
            this.userId = document.getElementById('uUid').innerHTML;
            this.sec2dynamicLabel = getDynamicLabels(this.userRole, undefined);
            this.fetchSavedData();
            this.initMaps();
            $('#loader').hide();
        },

        methods: {

            //Initializing Google Maps Autocompleted
            initMaps: function () {
                $('#loader').hide();
                var _self = this;
                var childAddress;
                var houseHoldAddress;
                var parentAddress;

                childAddress = new google.maps.places.Autocomplete((document.getElementById('txtChildAddress')), {
                    types: ['geocode'],
                });

                houseHoldAddress = new google.maps.places.Autocomplete((document.getElementById('educLocation')), {
                    types: ['establishment'],
                });

                parentAddress = new google.maps.places.Autocomplete((document.getElementById('gpParentorCarerLocation')), {
                    types: ['geocode'],
                });

                google.maps.event.addListener(childAddress, 'place_changed', function () {
                    _self.aboutObj.childAddress = childAddress.getPlace().formatted_address;
                    // const selectedPlace = google.maps.event.getPlace();
                    // console.log(selectedPlace);
                    // document.getElementById('navigateiside').innerHTML = selectedPlace.adr_address;
                    // document.getElementById('navigateiside').innerHTML = _self.aboutObj.childAddres;
                });

                google.maps.event.addListener(houseHoldAddress, 'place_changed', function () {
                    _self.houseHoldData.profession = houseHoldAddress.getPlace().name + ',' + houseHoldAddress.getPlace().formatted_address;
                });

                google.maps.event.addListener(parentAddress, 'place_changed', function () {
                    _self.aboutFormData.parentOrCarrerAddress = parentAddress.getPlace().formatted_address;
                });
            },

            onOptionChange: function (event) {
                var optionsName = this.aboutFormData;
                this.sec2dynamicLabel = getDynamicLabels(this.userRole, optionsName.parentialResponsibility)
                resetValues(event.target.form, this, 'aboutFormData');
            },

            //Fetch Api service Logic
            fetchSavedData: function () {
                var payload = {};
                payload.uuid = document.getElementById('uUid').innerHTML;
                payload.role = document.getElementById('uRole').innerHTML;
                var successData = apiCallPost('post', '/fetchAbout', payload);
                if (successData && Object.keys(successData)) {
                    this.patchValue(successData);
                    $('#loader').hide();
                } else {
                    //console.error('error')
                    $('#loader').hide();
                }
            },

            //Function to trim space entered
            trimWhiteSpace: function (event, obj, key) {
                preventWhiteSpaces(event, this, obj, key)
            },

            //Setting values Logic for Edit and Update
            patchValue: function (data) {
                this.userRole = document.getElementById('uRole').innerHTML;
                if (this.userRole == "child") {
                    if (data.parent[0] != undefined) {
                        this.editPatchFlag = true;
                        Vue.set(this.aboutObj, "nhsNumber", data.child_NHS);
                        if (data.child_name_title != null) {
                            Vue.set(this.aboutObj, "childNameTitle", data.child_name_title);
                        }
                        Vue.set(this.aboutObj, "childNameTitle", data.child_name_title);
                        Vue.set(this.aboutObj, "childFirstName", data.child_firstname);
                        Vue.set(this.aboutObj, "childLastName", data.child_lastname);
                        Vue.set(this.aboutObj, "childEmail", data.child_email);
                        Vue.set(this.aboutObj, "childContactNumber", data.child_contact_number);
                        Vue.set(this.aboutObj, "childAddress", data.child_address);
                        Vue.set(this.aboutObj, "sendPost", data.can_send_post);
                        Vue.set(this.aboutObj, "childGender", data.child_gender);
                        Vue.set(this.aboutObj, "childIdentity", data.child_gender_birth);
                        Vue.set(this.aboutObj, "childSexualOrientation", data.child_sexual_orientation);
                        Vue.set(this.aboutObj, "childEthnicity", data.child_ethnicity);
                        Vue.set(this.aboutObj, "childCareAdult", data.child_care_adult);
                        if (data.contact_type != null) {
                            Vue.set(this.aboutObj, "contactMode", data.contact_type);
                        }
                        if (data.sex_at_birth != null) {
                            Vue.set(this.aboutObj, "sexAssignedAtBirth", data.sex_at_birth);
                        }
                        // Vue.set(this.aboutObj, "contactMode", data.contact_type);
                        // Vue.set(this.aboutObj, "sexAssignedAtBirth", data.sex_at_birth);
                        this.allHouseHoldMembers = data.household_member;
                        Vue.set(this.aboutObj, "parentFirstName", data.parent[0].parent_firstname);
                        Vue.set(this.aboutObj, "parentLastName", data.parent[0].parent_lastname);
                        Vue.set(this.aboutFormData, "parentialResponsibility", data.parent[0].parental_responsibility);
                        //  ue.set(this.aboutObj, "childCareAdult", data.child_care_adult);
                        this.sec2dynamicLabel = getDynamicLabels(this.userRole, data.parent[0].parental_responsibility)
                        Vue.set(this.aboutFormData, "parentCarerFirstName", data.parent[0].responsibility_parent_firstname);
                        Vue.set(this.aboutFormData, "parentCarerLastName", data.parent[0].responsibility_parent_lastname);
                        Vue.set(this.aboutFormData, "relationshipToYou", data.parent[0].child_parent_relationship);
                        Vue.set(this.aboutFormData, "parentContactMode", data.parent[0].parent_contact_type);
                        Vue.set(this.aboutFormData, "contactNumber", data.parent[0].parent_contact_number);
                        Vue.set(this.aboutFormData, "emailAddress", data.parent[0].parent_email);
                        Vue.set(this.aboutFormData, "sameHouse", data.parent[0].parent_same_house);
                        Vue.set(this.aboutFormData, "parentOrCarrerAddress", data.parent[0].parent_address);
                        Vue.set(this.aboutFormData, "legalCareStatus", data.parent[0].legal_care_status);
                        Vue.set(this.aboutObj, "referral_progress", data.referral_progress == 20 ? 40 : data.referral_progress);
                    }
                }
                else if (this.userRole == "parent") {
                    if (data[0].parent[0].child_firstname != null) {
                        this.editPatchFlag = true;
                        Vue.set(this.aboutObj, "nhsNumber", data[0].parent[0].child_NHS);
                        if (data[0].parent[0].child_name_title != null) {
                            Vue.set(this.aboutObj, "childNameTitle", data[0].parent[0].child_name_title);
                        }
                        //Vue.set(this.aboutObj, "childNameTitle", data[0].parent[0].child_name_title);
                        Vue.set(this.aboutObj, "childFirstName", data[0].parent[0].child_firstname);
                        Vue.set(this.aboutObj, "childLastName", data[0].parent[0].child_lastname);
                        Vue.set(this.aboutObj, "childEmail", data[0].parent[0].child_email);
                        Vue.set(this.aboutObj, "childContactNumber", data[0].parent[0].child_contact_number);
                        Vue.set(this.aboutObj, "childAddress", data[0].parent[0].child_address);
                        Vue.set(this.aboutObj, "sendPost", data[0].parent[0].can_send_post);
                        Vue.set(this.aboutObj, "childGender", data[0].parent[0].child_gender);
                        Vue.set(this.aboutObj, "childIdentity", data[0].parent[0].child_gender_birth);
                        Vue.set(this.aboutObj, "childSexualOrientation", data[0].parent[0].child_sexual_orientation);
                        Vue.set(this.aboutObj, "childEthnicity", data[0].parent[0].child_ethnicity);
                        Vue.set(this.aboutObj, "childCareAdult", data[0].parent[0].child_care_adult);
                        Vue.set(this.aboutObj, "houseHoldName", data[0].parent[0].child_household_name);
                        if (data[0].parent[0].child_contact_type != null) {
                            Vue.set(this.aboutObj, "contactMode", data[0].parent[0].child_contact_type);
                        }
                        if (data[0].parent[0].sex_at_birth != null) {
                            Vue.set(this.aboutObj, "sexAssignedAtBirth", data[0].parent[0].sex_at_birth);
                        }
                        // Vue.set(this.aboutObj, "contactMode", data[0].parent[0].contact_type);
                        // Vue.set(this.aboutObj, "sexAssignedAtBirth", data[0].parent[0].sex_at_birth);
                        Vue.set(this.aboutObj, "parentFirstName", data[0].parent_firstname);
                        Vue.set(this.aboutObj, "parentLastName", data[0].parent_lastname);
                        //Vue.set(this.aboutObj, "parentContactName", data[0].responsibility_parent_firstname);
                        this.allHouseHoldMembers = data[0].household_member;
                        Vue.set(this.aboutFormData, "parentialResponsibility", data[0].parental_responsibility);
                        this.sec2dynamicLabel = getDynamicLabels(this.userRole, data[0].parental_responsibility)
                        Vue.set(this.aboutFormData, "parentCarerFirstName", data[0].responsibility_parent_firstname);
                        Vue.set(this.aboutFormData, "parentCarerLastName", data[0].responsibility_parent_lastname);
                        Vue.set(this.aboutFormData, "relationshipToYou", data[0].child_parent_relationship);
                        Vue.set(this.aboutFormData, "parentContactMode", data[0].parent_contact_type);
                        Vue.set(this.aboutFormData, "contactNumber", data[0].parent_contact_number);
                        Vue.set(this.aboutFormData, "emailAddress", data[0].parent_email);
                        Vue.set(this.aboutFormData, "sameHouse", data[0].parent_same_house);
                        Vue.set(this.aboutFormData, "parentOrCarrerAddress", data[0].parent_address);
                        Vue.set(this.aboutFormData, "legalCareStatus", data[0].legal_care_status);
                        this.allHouseHoldMembers = data[0].parent[0].household_member;
                        Vue.set(this.aboutObj, "referral_progress", data[0].referral_progress == 20 ? 40 : data[0].referral_progress);
                    }
                }
                else if (this.userRole == "professional") {
                    if (data[0] != undefined && data[0].parent[0] != undefined) {
                        this.editPatchFlag = true;
                        Vue.set(this.aboutObj, "nhsNumber", data[0].parent[0].child_NHS);
                        if (data[0].parent[0].child_name_title != null) {
                            Vue.set(this.aboutObj, "childNameTitle", data[0].parent[0].child_name_title);
                        }
                        //Vue.set(this.aboutObj, "childNameTitle", data[0].parent[0].child_name_title);
                        Vue.set(this.aboutObj, "childFirstName", data[0].parent[0].child_firstname);
                        Vue.set(this.aboutObj, "childLastName", data[0].parent[0].child_lastname);
                        Vue.set(this.aboutObj, "childEmail", data[0].parent[0].child_email);
                        Vue.set(this.aboutObj, "childContactNumber", data[0].parent[0].child_contact_number);
                        Vue.set(this.aboutObj, "childAddress", data[0].parent[0].child_address);
                        Vue.set(this.aboutObj, "sendPost", data[0].parent[0].can_send_post);
                        Vue.set(this.aboutObj, "childGender", data[0].parent[0].child_gender);
                        Vue.set(this.aboutObj, "childIdentity", data[0].parent[0].child_gender_birth);
                        Vue.set(this.aboutObj, "childSexualOrientation", data[0].parent[0].child_sexual_orientation);
                        Vue.set(this.aboutObj, "childEthnicity", data[0].parent[0].child_ethnicity);
                        Vue.set(this.aboutObj, "childCareAdult", data[0].parent[0].child_care_adult);
                        if (data[0].parent[0].child_contact_type != null) {
                            Vue.set(this.aboutObj, "contactMode", data[0].parent[0].child_contact_type);
                        }

                        if (!data[0].parent[0].sex_at_birth != null) {
                            Vue.set(this.aboutObj, "sexAssignedAtBirth", data[0].parent[0].sex_at_birth);
                        }

                        Vue.set(this.aboutObj, "houseHoldName", data[0].parent[0].child_household_name);
                        if (data[0] && data[0].parent[0] && data[0].parent[0].household_member) {
                            this.allHouseHoldMembers = data[0].parent[0].household_member;
                        } else {
                            this.allHouseHoldMembers = [];
                        }
                        Vue.set(this.aboutObj, "parentFirstName", data[0].parent_firstname);
                        Vue.set(this.aboutObj, "parentLastName", data[0].parent_lastname);
                        Vue.set(this.aboutFormData, "parentialResponsibility", data[0].parental_responsibility);
                        this.sec2dynamicLabel = getDynamicLabels(this.userRole, data[0].parental_responsibility)
                        Vue.set(this.aboutFormData, "parentCarerFirstName", data[0].responsibility_parent_firstname);
                        Vue.set(this.aboutFormData, "parentCarerLastName", data[0].responsibility_parent_lastname);
                        Vue.set(this.aboutFormData, "relationshipToYou", data[0].child_parent_relationship);
                        Vue.set(this.aboutFormData, "parentContactMode", data[0].parent_contact_type);
                        Vue.set(this.aboutFormData, "contactNumber", data[0].parent_contact_number);
                        Vue.set(this.aboutFormData, "emailAddress", data[0].parent_email);
                        Vue.set(this.aboutFormData, "sameHouse", data[0].parent_same_house);
                        Vue.set(this.aboutFormData, "parentOrCarrerAddress", data[0].parent_address);
                        Vue.set(this.aboutFormData, "legalCareStatus", data[0].legal_care_status);
                        Vue.set(this.aboutFormData, "parentUUID", data[0].uuid);
                        Vue.set(this.aboutObj, "referral_progress", data[0].prof_referral_progress == 20 ? 40 : data[0].prof_referral_progress);
                    }
                }
            },

            //Form Submission of Section-4(Referral) with validation logic
            saveAndContinue: function () {
                this.isFormSubmitted = true;
                var formData = _.merge({}, this.aboutObj, this.aboutFormData);
                if (formData.childNameTitle && formData.contactNumber && formData.relationshipToYou &&
                    formData.childCareAdult && formData.parentialResponsibility && formData.childGender && formData.parentFirstName && formData.parentLastName &&
                    formData.childIdentity && formData.sexAssignedAtBirth && formData.sendPost && formData.childAddress && formData.childFirstName && formData.childLastName && formData.childContactNumber
                    && this.phoneRegex.test(formData.contactNumber) && this.phoneRegex.test(formData.childContactNumber)
                ) {
                    if ((formData.parentialResponsibility == 'no' && !formData.parentCarerFirstName && !formData.parentCarerLastName) || (formData.nhsNumber && !this.nhsRegex.test(formData.nhsNumber))
                        || (formData.childEmail && !this.emailRegex.test(formData.childEmail)) || (formData.childContactNumber && !this.phoneRegex.test(formData.childContactNumber))
                        || (formData.contactNumber && !this.phoneRegex.test(formData.contactNumber)) || (formData.emailAddress && !this.emailRegex.test(formData.emailAddress))) {
                        scrollToInvalidInput();
                        return false;
                    }
                    $('#loader').show();
                    this.payloadData.aboutData = JSON.parse(JSON.stringify(formData));
                    this.payloadData.role = document.getElementById('uRole').innerHTML;
                    this.payloadData.userid = document.getElementById('uUid').innerHTML
                    this.payloadData.allHouseHoldMembers = this.allHouseHoldMembers;
                    if (this.editPatchFlag) {
                        this.payloadData.editFlag = this.editPatchFlag
                    }
                    if (this.userMode === 'edit') {
                        this.payloadData.userMode = 'edit';
                    } else {
                        this.payloadData.userMode = 'add';
                    }
                    // this.payloadData.aboutData.childFirstName = this.maritalStatus + '.' + this.payloadData.aboutData.childFirstName;
                    // var lastName = this.maritalStatus + '' + this.payloadData.aboutData.childLastName;
                   // this.payloadData.aboutData = this.parentContactMode;
                    this.upsertAboutYouForm(this.payloadData);
                } else {
                    scrollToInvalidInput();
                    return false;
                }
            },

            checkArrayLength: function (arr) {
                if (arr && Array.from(arr).length) {
                    return true;
                } else {
                    return false;
                }
            },


            // Getting Manual Address
            getManualAddress: function (modelId) {
                if (modelId === 'bdeb1825-c05e-4949-974e-93514d3a85b4') {
                    $('#addressModal').modal('show');
                    this.resetAddressModalValues();
                }
                else if (modelId === 'ab0ea3ad-43c5-4f21-a449-e8087707654b') {
                    $('#addressParentModal').modal('show');
                    this.resetAddressParentModalValues();
                }
            },

            //Adding and Updating a address logic
            upsertAddress: function () {
                manualAddressLogic(this, 'addressData', 'manualAddressArray', 'addressModal');
                this.aboutObj.childAddress = "";
                document.getElementById('cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7').style.pointerEvents = "none";
                document.getElementById('cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7').style.opacity = 0.7;
                document.getElementById('bdeb1825-c05e-4949-974e-93514d3a85b4').style.pointerEvents = "none";
                document.getElementById('bdeb1825-c05e-4949-974e-93514d3a85b4').style.opacity = 0.5;
            },

            //Patching the HouseHold logic
            patchAddress: function (address) {
                patchManualAddress(this, 'addressData', address, 'manualAddressArray');
                this.prevAddressData = JSON.parse(JSON.stringify(this.manualAddressArray));
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
            //Resetting the modal values of address model data
            resetAddressParentModalValues: function () {
                this.isAddressFormSubmitted = false;
                this.addressParentData.addressLine1 = '';
                this.addressParentData.addressLine2 = '';
                this.addressParentData.city = '';
                this.addressParentData.country = '';
                this.addressParentData.postCode = '';
                this.addressParentData.mode = '';
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
                            this.manualAddressArray = [];
                            this.manualAddressArray.push(prevAddressObj);
                        }
                        return true;
                    } else {
                        this.resetAddressModalValues();
                    }
                }
            },

            //Section 2(About You) Save and Service call with navigation Logic
            upsertAboutYouForm: function (payload) {
                var responseData = apiCallPost('post', '/saveReferral', payload);
                if (responseData && Object.keys(responseData)) {
                    $('#loader').hide();
                    if (this.paramValues != undefined) {
                        if (this.paramValues[0] == "sec5back") {
                            location.href = "/review";
                        }
                        else {
                            var url = location.href;
                            location.href = "/education?" + url.substring(url.indexOf("?") + 1);
                        }
                    }
                    else {
                        location.href = "/education";
                    }
                } else {
                    $('#loader').hide();
                    // console.log('empty response')
                }
            },

            //Adding and Updating a HouseHold logic
            upsertHouseHold: function () {
                this.isHouseHoldFormSubmitted = true;
                var houseHoldForm = this.houseHoldData;
                var modal = document.getElementById('closeModalRaj');
                if (houseHoldForm.name) {
                    if (houseHoldForm.mode === 'update') {
                        this.allHouseHoldMembers = this.allHouseHoldMembers.map(function (it) {
                            if (it.mode === 'update' && it.id === houseHoldForm.id) {
                                it = JSON.parse(JSON.stringify(houseHoldForm));
                                delete it.mode;
                                return it;
                            }
                            else {
                                delete it.mode;
                                return it;
                            }
                        });
                    } else {
                        houseHoldForm.id = uuidV4();
                        houseHoldForm.mode = 'add';
                        this.allHouseHoldMembers.push(JSON.parse(JSON.stringify(houseHoldForm)));
                    }
                    this.resetModalValues();
                    modal.setAttribute("data-dismiss", "modal");
                } else {
                    modal.removeAttribute("data-dismiss", "modal");
                    return;
                }
            },

            //Patching the service logic
            patchHouseHold: function (houseHold) {
                var houseHoldForm = this.houseHoldData;
                houseHoldForm.name = houseHold.name;
                houseHoldForm.lastName = houseHold.lastName;
                houseHoldForm.relationShip = houseHold.relationShip;
                houseHoldForm.dob = houseHold.dob;
                houseHoldForm.profession = houseHold.profession;
                houseHoldForm.id = houseHold.id;
                houseHoldForm.mode = 'update';
                this.allHouseHoldMembers.map(function (i) {
                    if (i.id === houseHold.id) {
                        i.mode = "update";
                    } else {
                        delete i.mode;
                    }
                });
            },

            //Delete service logic
            openDeleteModal: function (service) {
                this.storeDeleteData = service;
            },

            //Delete service logic
            deleteHouseHold: function (member) {
                var modal = document.getElementById('closeModalDeleteAbout');
                deleteLogic(this.allHouseHoldMembers, member, this, 'allHouseHoldMembers')
                modal.setAttribute("data-dismiss", "modal");
            },

            //Delete service logic
            deleteManualAddress: function () {
                deleteLogicManualAddress(this.manualAddressArray, this.addressData, this, 'manualAddressArray',
                    'cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7', 'bdeb1825-c05e-4949-974e-93514d3a85b4');
                $('#deleteAddressModal').modal('hide');
            },

            //Resetting the modal values of service data
            resetModalValues: function () {
                this.isHouseHoldFormSubmitted = false;
                this.houseHoldData.name = '';
                this.houseHoldData.lastName = '';
                this.houseHoldData.relationShip = '';
                this.houseHoldData.dob = '';
                this.houseHoldData.profession = '';
                this.houseHoldData.mode = '';
            },

            resetModal: function (type) {
                if (type === 'add') {
                    this.resetModalValues();
                } else {
                    if (this.serviceData.mode === 'update') {
                        return true;
                    } else {
                        this.resetModalValues();
                    }
                }
            },

            //Back to previous page
            backToRole: function () {
                backToPreviousPage('/role?', this.userId, this.userRole)
            },

            //Clearing date values from inpt
            clearDate: function (e) {
                if (e.keyCode == 8 || e.keyCode == 46) {
                    $('#houseHoldDate').datepicker('setDate', null);
                    this.houseHoldData.dob = "";
                }
            },

            setCalendarHeight: function (e) {
                e.currentTarget.firstElementChild.setAttribute('inputmode', 'none');
                e.currentTarget.firstElementChild.setAttribute('autocomplete', 'off');
                var dynamicHeight;
                var mainWidth = document.getElementById('dobAboutCal').clientWidth;
                if (mainWidth <= 350) {
                    dynamicHeight = e.currentTarget.clientWidth + 25;
                } else {
                    dynamicHeight = e.currentTarget.clientWidth - 10;
                }
                var dob = document.getElementsByClassName('bootstrap-datetimepicker-widget');
                dob[0].style.width = '' + dynamicHeight + 'px';
            },

            resetAge: function (event, date) {
                if (this.getAge(date) > 19) {
                    this.houseHoldData.profession = "";
                }
            },

            getAge: function (dateString) {
                if (dateString != "") {
                    var today = new Date();
                    this.dateFmt = this.setDateFormat(dateString)
                    var birthDate = new Date(this.dateFmt);
                    var age = today.getFullYear() - birthDate.getFullYear();
                    var m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    return age;
                }
            },

            setDateFormat: function (dbDate) {
                if (dbDate != null) {
                    var dateArray = dbDate.split("/");
                    var toOldFmt = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
                    var date = new Date(toOldFmt)
                    var yyyy = date.getFullYear().toString();
                    var mm = (date.getMonth() + 1).toString();
                    var dd = date.getDate().toString();
                    var mmChars = mm.split('');
                    var ddChars = dd.split('');
                    var showDate = (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + yyyy
                    return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
                }
            },
        }
    })
});