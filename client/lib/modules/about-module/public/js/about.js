var API_URI = "/modules/about-module";
$(document).ready(function () {
    Vue.component('date-picker', VueBootstrapDatetimePicker);
    Vue.component('vue-multiselect', window.VueMultiselect.default)
    var app = new Vue({
        el: '#about-form',
        components: { Multiselect: window.VueMultiselect.default },
        data: {
            // options: [],
            showLoadingSpinner: "",
            optionsProxy: [],
            selectedResources: [],
            addressOptions: [],
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
                emailAddress: "",
                sameHouse: "",
                parentOrCarrerAddress: "",
                legalCareStatus: ""
            },
            parentContactMode: "mobile",
            prevChildAddressData: null,
            prevParentAddressData: null,
            dateWrap: true,
            options: {
                format: 'DD/MM/YYYY',
                dayViewHeaderFormat: 'MMMM YYYY',
                useCurrent: false,
                allowInputToggle: true,
                minDate: new Date(1950, 10, 25),
                maxDate: moment().endOf('day').add(1, 'sec'),
            },
            showLoadingSpinner: false,
            sec2dynamicLabel: {},
            houseHoldData: {
                name: '',
                lastName: '',
                relationShip: '',
                dob: '',
                profession: '',
                manualAddress: {
                    profession: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    country: '',
                    postCode: ''

                }
            },
            childManualAddress: [],
            addressData: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: ''
            },
            parentManualAddress: [],
            addressParentData: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: ''
            },
            showFlagHouseHold: false,
            allHouseHoldMembers: [],
            showManualAddressHouseHold: false,
            isAddressFormSubmitted: false,
            isAddressFormParentSubmitted: false,
            isFormSubmitted: false,
            isManualAddress: false,
            isHouseHoldFormSubmitted: false,
            phoneRegex: /^\+{0,1}[0-9 ]{10,16}$/,
            postCodeRegex: /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/,
            // phoneRegex: /(\s*\(?(0|\+44)(\s*|-)\d{4}\)?(\s*|-)\d{3}(\s*|-)\d{3}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\)?(\s*|-)\d{3}(\s*|-)\d{4}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{2}\)?(\s*|-)\d{4}(\s*|-)\d{4}\s*)|(\s*(7|8)(\d{7}|\d{3}(\-|\s{1})\d{4})\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\s\d{2}\)?(\s*|-)\d{4,5}\s*)/,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            nhsRegex: /^[0-9]{10}$/,
            userRole: '',
            userMode: '',
            payloadData: {},
            currentSection: 'about',
            paramValues: [],
            editPatchFlag: false,
            storeDeleteData: null,
            dateFmt: '',
            addressList: [],
        },
        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href);
            this.userRole = document.getElementById('uRole').innerHTML;
            this.sec2dynamicLabel = getDynamicLabels(this.userRole, undefined);
            this.isFormSubmitted = false;
            this.fetchSavedData();
            this.initMaps();
            $('#loader').hide();
        },

        methods: {

            //Initializing Google Maps Autocompleted
            initMaps: function () {
                $('#loader').hide();
                var _self = this;
                //var childAddress;
                var houseHoldAddress;
                //var parentAddress;

                // childAddress = new google.maps.places.Autocomplete((document.getElementById('txtChildAddress')), {
                //     types: ['geocode'],
                // });

                houseHoldAddress = new google.maps.places.Autocomplete((document.getElementById('educLocation')), {
                    types: ['establishment'],
                });

                // parentAddress = new google.maps.places.Autocomplete((document.getElementById('gpParentorCarerLocation')), {
                //     types: ['geocode'],
                // });

                // google.maps.event.addListener(childAddress, 'place_changed', function () {
                //     _self.aboutObj.childAddress = childAddress.getPlace().formatted_address;
                // });

                google.maps.event.addListener(houseHoldAddress, 'place_changed', function () {
                    _self.houseHoldData.profession = houseHoldAddress.getPlace().name + ',' + houseHoldAddress.getPlace().formatted_address;
                });

                // google.maps.event.addListener(parentAddress, 'place_changed', function () {
                //     _self.aboutFormData.parentOrCarrerAddress = parentAddress.getPlace().formatted_address;
                // });
            },

            //Reset and Question Flow Logic
            onOptionChange: function (event) {
                var optionsName = this.aboutFormData;
                var questionFormIdentifier = event.target.name;
                if (questionFormIdentifier == 'parentialResponsibility' || questionFormIdentifier == 'liveInSameHouse') {
                    this.parentManualAddress = [];
                    this.isAddressFormParentSubmitted = false;
                    this.setReadonlyState(false, 'ab0ea3ad-43c5-4f21-a449-e8087707654b', 'e97aa97c-34b6-4874-b2d0-b29c194dfdd2');
                }
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
                        if (data.child_manual_address && data.child_manual_address.length) {
                            Vue.set(this, "childManualAddress", data.child_manual_address);
                            this.setReadonlyState(true, 'cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7', 'bdeb1825-c05e-4949-974e-93514d3a85b4');
                        }
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
                        this.allHouseHoldMembers = data.household_member;
                        this.prevHouseHoldData = data.household_member;
                        Vue.set(this.aboutObj, "parentFirstName", data.parent[0].parent_firstname);
                        Vue.set(this.aboutObj, "parentLastName", data.parent[0].parent_lastname);
                        Vue.set(this.aboutFormData, "parentialResponsibility", data.parent[0].parental_responsibility);
                        this.sec2dynamicLabel = getDynamicLabels(this.userRole, data.parent[0].parental_responsibility)
                        Vue.set(this.aboutFormData, "parentCarerFirstName", data.parent[0].responsibility_parent_firstname);
                        Vue.set(this.aboutFormData, "parentCarerLastName", data.parent[0].responsibility_parent_lastname);
                        Vue.set(this.aboutFormData, "relationshipToYou", data.parent[0].child_parent_relationship);
                        if (data.parent[0].parent_contact_type) {
                            Vue.set(this, "parentContactMode", data.parent[0].parent_contact_type);
                        } else {
                            Vue.set(this, "parentContactMode", 'mobile');
                        }
                        Vue.set(this.aboutFormData, "contactNumber", data.parent[0].parent_contact_number);
                        Vue.set(this.aboutFormData, "emailAddress", data.parent[0].parent_email);
                        Vue.set(this.aboutFormData, "sameHouse", data.parent[0].parent_same_house);
                        Vue.set(this.aboutFormData, "parentOrCarrerAddress", data.parent[0].parent_address);
                        if (!data.parent[0].parent_address && data.parent[0].parent_manual_address && data.parent[0].parent_manual_address.length) {
                            Vue.set(this, "parentManualAddress", data.parent[0].parent_manual_address);
                            this.setReadonlyState(true, 'ab0ea3ad-43c5-4f21-a449-e8087707654b', 'e97aa97c-34b6-4874-b2d0-b29c194dfdd2');
                        }
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
                        Vue.set(this.aboutObj, "childFirstName", data[0].parent[0].child_firstname);
                        Vue.set(this.aboutObj, "childLastName", data[0].parent[0].child_lastname);
                        Vue.set(this.aboutObj, "childEmail", data[0].parent[0].child_email);
                        Vue.set(this.aboutObj, "childContactNumber", data[0].parent[0].child_contact_number);
                        Vue.set(this.aboutObj, "childAddress", data[0].parent[0].child_address);
                        if (data[0].parent[0].child_manual_address && data[0].parent[0].child_manual_address.length) {
                            Vue.set(this, "childManualAddress", data[0].parent[0].child_manual_address);
                            this.setReadonlyState(true, 'cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7', 'bdeb1825-c05e-4949-974e-93514d3a85b4');
                        }
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
                        Vue.set(this.aboutObj, "parentFirstName", data[0].parent_firstname);
                        Vue.set(this.aboutObj, "parentLastName", data[0].parent_lastname);
                        this.allHouseHoldMembers = data[0].household_member;
                        this.prevHouseHoldData = data[0].household_member;
                        Vue.set(this.aboutFormData, "parentialResponsibility", data[0].parental_responsibility);
                        this.sec2dynamicLabel = getDynamicLabels(this.userRole, data[0].parental_responsibility)
                        Vue.set(this.aboutFormData, "parentCarerFirstName", data[0].responsibility_parent_firstname);
                        Vue.set(this.aboutFormData, "parentCarerLastName", data[0].responsibility_parent_lastname);
                        Vue.set(this.aboutFormData, "relationshipToYou", data[0].child_parent_relationship);
                        if (data[0].parent_contact_type) {
                            Vue.set(this, "parentContactMode", data[0].parent_contact_type);
                        } else {
                            Vue.set(this, "parentContactMode", 'mobile');
                        }
                        Vue.set(this.aboutFormData, "contactNumber", data[0].parent_contact_number);
                        Vue.set(this.aboutFormData, "emailAddress", data[0].parent_email);
                        Vue.set(this.aboutFormData, "sameHouse", data[0].parent_same_house);
                        Vue.set(this.aboutFormData, "parentOrCarrerAddress", data[0].parent_address);
                        if (!data[0].parent_address && data[0].parent_manual_address && data[0].parent_manual_address.length) {
                            Vue.set(this, "parentManualAddress", data[0].parent_manual_address);
                            this.setReadonlyState(true, 'ab0ea3ad-43c5-4f21-a449-e8087707654b', 'e97aa97c-34b6-4874-b2d0-b29c194dfdd2');
                        }
                        Vue.set(this.aboutFormData, "legalCareStatus", data[0].legal_care_status);
                        this.allHouseHoldMembers = data[0].parent[0].household_member;
                        this.prevHouseHoldData = data[0].parent[0].household_member;
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
                        Vue.set(this.aboutObj, "childFirstName", data[0].parent[0].child_firstname);
                        Vue.set(this.aboutObj, "childLastName", data[0].parent[0].child_lastname);
                        Vue.set(this.aboutObj, "childEmail", data[0].parent[0].child_email);
                        Vue.set(this.aboutObj, "childContactNumber", data[0].parent[0].child_contact_number);
                        if (data[0].parent[0].child_manual_address && data[0].parent[0].child_manual_address.length) {
                            Vue.set(this, "childManualAddress", data[0].parent[0].child_manual_address);
                            this.setReadonlyState(true, 'cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7', 'bdeb1825-c05e-4949-974e-93514d3a85b4');
                        }
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
                            this.prevHouseHoldData = data[0].parent[0].household_member;
                        } else {
                            this.allHouseHoldMembers = [];
                            this.prevHouseHoldData = [];
                        }
                        Vue.set(this.aboutObj, "parentFirstName", data[0].parent_firstname);
                        Vue.set(this.aboutObj, "parentLastName", data[0].parent_lastname);
                        Vue.set(this.aboutFormData, "parentialResponsibility", data[0].parental_responsibility);
                        this.sec2dynamicLabel = getDynamicLabels(this.userRole, data[0].parental_responsibility)
                        Vue.set(this.aboutFormData, "parentCarerFirstName", data[0].responsibility_parent_firstname);
                        Vue.set(this.aboutFormData, "parentCarerLastName", data[0].responsibility_parent_lastname);
                        Vue.set(this.aboutFormData, "relationshipToYou", data[0].child_parent_relationship);
                        if (data[0].parent_contact_type) {
                            Vue.set(this, "parentContactMode", data[0].parent_contact_type);
                        } else {
                            Vue.set(this, "parentContactMode", 'mobile');
                        }
                        Vue.set(this.aboutFormData, "contactNumber", data[0].parent_contact_number);
                        Vue.set(this.aboutFormData, "emailAddress", data[0].parent_email);
                        Vue.set(this.aboutFormData, "sameHouse", data[0].parent_same_house);
                        if (!data[0].parent_address && data[0].parent_manual_address && data[0].parent_manual_address.length) {
                            Vue.set(this, "parentManualAddress", data[0].parent_manual_address);
                            this.setReadonlyState(true, 'ab0ea3ad-43c5-4f21-a449-e8087707654b', 'e97aa97c-34b6-4874-b2d0-b29c194dfdd2');
                        }
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
                    formData.childIdentity && formData.sexAssignedAtBirth && formData.sendPost && formData.childFirstName && formData.childLastName && formData.childContactNumber
                    && this.phoneRegex.test(formData.contactNumber) && this.phoneRegex.test(formData.childContactNumber)
                ) {
                    if (formData.childAddress || this.childManualAddress.length) {
                        if (formData.parentialResponsibility == 'no' && (!formData.parentCarerFirstName || !formData.parentCarerLastName || (formData.nhsNumber && !this.nhsRegex.test(formData.nhsNumber))
                            || (formData.childEmail && !this.emailRegex.test(formData.childEmail)) || (formData.childContactNumber && !this.phoneRegex.test(formData.childContactNumber))
                            || (formData.contactNumber && !this.phoneRegex.test(formData.contactNumber)) || (formData.emailAddress && !this.emailRegex.test(formData.emailAddress)))) {
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
                        this.payloadData.aboutData.parentContactMode = this.parentContactMode;
                        this.payloadData.aboutData.childManualAddress = this.childManualAddress;
                        this.payloadData.aboutData.parentManualAddress = this.parentManualAddress;
                        this.upsertAboutYouForm(this.payloadData);
                    } else {
                        scrollToInvalidInput();
                        return false;
                    }

                } else {
                    scrollToInvalidInput();
                    return false;
                }
            },

            //Function to check array length
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
                    this.resetChildAddressModalValues();
                }
                else if (modelId === 'ab0ea3ad-43c5-4f21-a449-e8087707654b') {
                    $('#addressParentModal').modal('show');
                    this.resetParentAddressModalValues();
                }
            },

            //Adding and Updating a address logic
            upsertAddress: function (role) {
                if (role == 'child') {
                    manualAddressLogic(this, 'addressData', 'childManualAddress', 'addressModal', false, role);
                    this.aboutObj.childAddress = "";
                    document.getElementById('cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7').style.pointerEvents = "none";
                    document.getElementById('cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7').style.opacity = 0.7;
                    document.getElementById('bdeb1825-c05e-4949-974e-93514d3a85b4').style.pointerEvents = "none";
                    document.getElementById('bdeb1825-c05e-4949-974e-93514d3a85b4').style.opacity = 0.5;
                } else if (role == 'parent') {
                    manualAddressLogic(this, 'addressParentData', 'parentManualAddress', 'addressParentModal', false, role);
                    this.aboutFormData.parentOrCarrerAddress = "";
                    document.getElementById('ab0ea3ad-43c5-4f21-a449-e8087707654b').style.pointerEvents = "none";
                    document.getElementById('ab0ea3ad-43c5-4f21-a449-e8087707654b').style.opacity = 0.7;
                    document.getElementById('e97aa97c-34b6-4874-b2d0-b29c194dfdd2').style.pointerEvents = "none";
                    document.getElementById('e97aa97c-34b6-4874-b2d0-b29c194dfdd2').style.opacity = 0.5;
                }

            },

            //Setting Read only state for Manual Address Logic
            setReadonlyState: function (isDisabled, text, inputGroup) {
                var textEle = document.getElementById(text);
                var buttElem = document.getElementById(inputGroup)
                if (isDisabled) {
                    textEle.style.pointerEvents = "none";
                    textEle.style.opacity = 0.7;
                    buttElem.style.pointerEvents = "none";
                    buttElem.style.opacity = 0.5;
                } else {
                    textEle.style.pointerEvents = "auto";
                    textEle.style.opacity = 1;
                    buttElem.style.pointerEvents = "auto";
                    buttElem.style.opacity = 1;
                }

            },

            //Patching the HouseHold logic
            patchAddress: function (address, role) {
                if (role == 'child') {
                    patchManualAddress(this, 'addressData', address, 'childManualAddress');
                    this.prevChildAddressData = JSON.parse(JSON.stringify(this.childManualAddress));
                } else if (role == 'parent') {
                    patchManualAddress(this, 'addressParentData', address, 'parentManualAddress');
                    this.prevParentAddressData = JSON.parse(JSON.stringify(this.parentManualAddress));
                }

            },

            //reset child address value
            resetChildAddressValue: function (data) {
                if (this.addressData.mode && this.addressData.mode === 'add') {
                    this.resetChildAddressModalValues();
                } else if (this.addressData.mode && this.addressData.mode === 'update') {
                    var prevChildAddressObj = convertArrayToObj(this.prevChildAddressData);
                    if (this.addressData.mode === 'update') {
                        if (_.isEqual(this.addressData, prevChildAddressObj)) {
                            this.addressData = this.addressData;
                        } else {
                            this.childManualAddress = [];
                            this.childManualAddress.push(prevChildAddressObj);
                        }
                        return true;
                    } else {
                        this.resetChildAddressModalValues();
                    }
                } else {
                    this.isAddressFormSubmitted = false;
                    this.setReadonlyState(false, 'cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7', 'bdeb1825-c05e-4949-974e-93514d3a85b4');
                }
            },

            //reset parent address value
            resetParentAddressValue: function () {
                if (this.addressParentData.mode && this.addressParentData.mode === 'add') {
                    this.resetChildAddressModalValues();
                } else if (this.addressParentData.mode && this.addressParentData.mode === 'update') {
                    var prevParentAddressObj = convertArrayToObj(this.prevParentAddressData);
                    if (this.addressParentData.mode === 'update') {
                        if (_.isEqual(this.addressParentData, prevParentAddressObj)) {
                            this.addressParentData = this.addressParentData;
                        } else {
                            this.parentManualAddress = [];
                            this.parentManualAddress.push(prevParentAddressObj);
                        }
                        return true;
                    } else {
                        this.resetParentAddressModalValues();
                    }
                } else {
                    this.isAddressFormParentSubmitted = false;
                    this.setReadonlyState(false, 'ab0ea3ad-43c5-4f21-a449-e8087707654b', 'e97aa97c-34b6-4874-b2d0-b29c194dfdd2');
                }
            },

            //Resetting the modal values of service data
            resetChildAddressModalValues: function () {
                this.isAddressFormSubmitted = false;
                this.addressData.addressLine1 = '';
                this.addressData.addressLine2 = '';
                this.addressData.city = '';
                this.addressData.country = '';
                this.addressData.postCode = '';
                this.addressData.mode = '';
            },

            //Resetting the modal values of address model data
            resetParentAddressModalValues: function () {
                this.isAddressFormSubmitted = false;
                this.addressParentData.addressLine1 = '';
                this.addressParentData.addressLine2 = '';
                this.addressParentData.city = '';
                this.addressParentData.country = '';
                this.addressParentData.postCode = '';
                this.addressParentData.mode = '';
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
                }
            },

            //Adding and Updating a HouseHold logic
            upsertHouseHold: function () {
                var errorElements = Array.from(document.getElementsByClassName("invalid-modal-fields"));
                console.log(errorElements);
                this.isHouseHoldFormSubmitted = true;
                var houseHoldForm = this.houseHoldData;
                var modal = document.getElementById('closeModalRaj');
                if (houseHoldForm.name && houseHoldForm.lastName) {
                    if (this.showManualAddressHouseHold) {
                        if (houseHoldForm.manualAddress.profession && houseHoldForm.manualAddress.addressLine1 && houseHoldForm.manualAddress.city &&
                            houseHoldForm.manualAddress.postCode && this.postCodeRegex.test(houseHoldForm.manualAddress.postCode)) {
                            this.showFlagHouseHold = true;
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
                                this.prevHouseHoldData = JSON.parse(JSON.stringify(this.allHouseHoldMembers));
                            } else {
                                houseHoldForm.id = uuidV4();
                                houseHoldForm.mode = 'add';
                                this.allHouseHoldMembers.push(JSON.parse(JSON.stringify(houseHoldForm)));
                                this.prevHouseHoldData = JSON.parse(JSON.stringify(this.allHouseHoldMembers));
                            }
                            this.resetModalValues();
                            modal.setAttribute("data-dismiss", "modal");

                        } else {
                            modal.removeAttribute("data-dismiss", "modal");
                            errorElements[0].previousElementSibling.querySelector('input').focus();
                            errorElements[0].previousElementSibling.querySelector('input').select();
                            return;
                        }
                    } else {
                        //this.setReadonlyStateHouseHold(false, '7a53ccec-e9fc-422b-b410-6c5ec82377d7', '94a4bca4-a05e-44d6-974b-0f09e2e4c576');
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
                            this.prevHouseHoldData = JSON.parse(JSON.stringify(this.allHouseHoldMembers));
                        } else {
                            houseHoldForm.id = uuidV4();
                            houseHoldForm.mode = 'add';
                            this.allHouseHoldMembers.push(JSON.parse(JSON.stringify(houseHoldForm)));
                            this.prevHouseHoldData = JSON.parse(JSON.stringify(this.allHouseHoldMembers));
                        }
                        this.resetModalValues();
                        modal.setAttribute("data-dismiss", "modal");
                    }
                } else {
                    modal.removeAttribute("data-dismiss", "modal");
                    errorElements[0].previousElementSibling.querySelector('input').focus();
                    errorElements[0].previousElementSibling.querySelector('input').select();
                    return;
                }
            },

            toggleHouseHoldManualAddress: function (e) {
                var manualHouseHoldText = document.getElementById('7a53ccec-e9fc-422b-b410-6c5ec82377d7');
                var calcAge = this.getAge(this.houseHoldData.dob);
                console.log(calcAge);
                if (calcAge > 19) {
                    manualHouseHoldText.innerText = "Enter manually";
                    this.setReadonlyStateHouseHold(false, '7a53ccec-e9fc-422b-b410-6c5ec82377d7', '94a4bca4-a05e-44d6-974b-0f09e2e4c576');
                    this.showManualAddressHouseHold = false;
                    this.resetHouseholdManualAddressValue();
                }
            },

            //Patching the service logic
            patchHouseHold: function (houseHold) {
                var _self = this;
                var manualHouseHoldText = document.getElementById('7a53ccec-e9fc-422b-b410-6c5ec82377d7');
                var houseHoldForm = this.houseHoldData;
                houseHoldForm.name = houseHold.name;
                houseHoldForm.lastName = houseHold.lastName;
                houseHoldForm.relationShip = houseHold.relationShip;
                houseHoldForm.dob = houseHold.dob;
                houseHoldForm.profession = houseHold.profession;
                houseHoldForm.id = houseHold.id;
                if (houseHold.manualAddress.profession) {
                    houseHoldForm.manualAddress.profession = houseHold.manualAddress.profession;
                }
                if (houseHold.manualAddress.addressLine1) {
                    houseHoldForm.manualAddress.addressLine1 = houseHold.manualAddress.addressLine1;
                }
                if (houseHold.manualAddress.addressLine2) {
                    houseHoldForm.manualAddress.addressLine2 = houseHold.manualAddress.addressLine2;
                }
                if (houseHold.manualAddress.city) {
                    houseHoldForm.manualAddress.city = houseHold.manualAddress.city;
                }
                if (houseHold.manualAddress.country) {
                    houseHoldForm.manualAddress.country = houseHold.manualAddress.country;
                }
                if (houseHold.manualAddress.postCode) {
                    houseHoldForm.manualAddress.postCode = houseHold.manualAddress.postCode;
                }
                houseHoldForm.mode = 'update';
                this.allHouseHoldMembers.map(function (i) {
                    if (i.id === houseHold.id) {
                        i.mode = "update";
                    } else {
                        delete i.mode;
                    }
                });
                if (_.values(houseHold.manualAddress).every(_.isEmpty)) {
                    _self.setReadonlyStateHouseHold(false, '7a53ccec-e9fc-422b-b410-6c5ec82377d7', '94a4bca4-a05e-44d6-974b-0f09e2e4c576');
                    _self.showManualAddressHouseHold = false;
                    manualHouseHoldText.innerText = 'Enter manually';
                } else {
                    _self.setReadonlyStateHouseHold(true, '7a53ccec-e9fc-422b-b410-6c5ec82377d7', '94a4bca4-a05e-44d6-974b-0f09e2e4c576');
                    _self.showManualAddressHouseHold = true;
                    manualHouseHoldText.innerText = 'Clear manual';
                }
            },

            //Clear House Hold
            clearHouseHoldData: function () {
                var manualHouseHoldText = document.getElementById('7a53ccec-e9fc-422b-b410-6c5ec82377d7');
                if (this.houseHoldData.mode && this.houseHoldData.mode === 'add') {
                    this.resetModalValues();
                    this.resetHouseholdManualAddressValue();
                } else if (this.houseHoldData.mode && this.houseHoldData.mode === 'update') {
                    this.allHouseHoldMembers = [];
                    this.allHouseHoldMembers = this.prevHouseHoldData;
                    return true;
                } else {
                    manualHouseHoldText.innerText = "Enter manually";
                    this.setReadonlyStateHouseHold(false, '7a53ccec-e9fc-422b-b410-6c5ec82377d7', '94a4bca4-a05e-44d6-974b-0f09e2e4c576');
                    this.resetModalValues();
                    this.resetHouseholdManualAddressValue();
                }
            },


            // Getting Manual Address for house hold
            getManualAddressHouseHold: function () {
                var manualHouseHoldText = document.getElementById('7a53ccec-e9fc-422b-b410-6c5ec82377d7');
                var manualHouseHoldContainer = document.getElementById('94a4bca4-a05e-44d6-974b-0f09e2e4c576');
                if (manualHouseHoldText.innerText == 'Enter manually') {
                    this.houseHoldData.profession = "";
                    this.isHouseHoldFormSubmitted = false;
                    this.showManualAddressHouseHold = true;
                    this.isManualAddress = true;
                    manualHouseHoldText.innerText = "Clear manual";
                    manualHouseHoldContainer.style.opacity = "0.7";
                    manualHouseHoldContainer.style.pointerEvents = "none";
                } else if (manualHouseHoldText.innerText == 'Clear manual') {
                    this.isManualAddress = false;
                    this.houseHoldData.profession = "";
                    manualHouseHoldText.innerText = "Enter manually";
                    manualHouseHoldContainer.style.opacity = "1";
                    manualHouseHoldContainer.style.pointerEvents = "auto";
                    this.resetHouseholdManualAddressValue();
                }
            },


            //setting dynamic readonly state for house hold container
            setReadonlyStateHouseHold: function (isDisabled, text, inputGroup) {
                var manualHouseHoldText = document.getElementById(text);
                var buttElem = document.getElementById(inputGroup);
                if (isDisabled) {
                    buttElem.style.pointerEvents = "none";
                    buttElem.style.opacity = 0.5;
                } else {
                    buttElem.style.pointerEvents = "auto";
                    buttElem.style.opacity = 1;
                }

            },

            resetHouseholdManualAddressValue: function () {
                this.showManualAddressHouseHold = false;
                this.houseHoldData.manualAddress.profession = "";
                this.houseHoldData.manualAddress.addressLine1 = "";
                this.houseHoldData.manualAddress.addressLine2 = "";
                this.houseHoldData.manualAddress.city = "";
                this.houseHoldData.manualAddress.country = "";
                this.houseHoldData.manualAddress.postCode = ""
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
            deleteManualAddress: function (role) {
                if (role == 'child') {
                    deleteLogicManualAddress(this.childManualAddress, this.addressData, this, 'childManualAddress',
                        'cd079a4d-c79d-4d38-a245-e0ba6d6ff8b7', 'bdeb1825-c05e-4949-974e-93514d3a85b4');
                    this.isAddressFormSubmitted = false;
                    $('#deleteChildAddressModal').modal('hide');
                } else if (role == 'parent') {
                    deleteLogicManualAddress(this.parentManualAddress, this.addressParentData, this, 'parentManualAddress',
                        'ab0ea3ad-43c5-4f21-a449-e8087707654b', 'e97aa97c-34b6-4874-b2d0-b29c194dfdd2');
                    this.isAddressFormParentSubmitted = false;
                    $('#deleteParentAddressModal').modal('hide');
                }

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
                var manualHouseHoldText = document.getElementById('7a53ccec-e9fc-422b-b410-6c5ec82377d7');
                if (type === 'add') {
                    this.resetModalValues();
                    this.resetHouseholdManualAddressValue();
                    manualHouseHoldText.innerText = "Enter manually";
                    this.setReadonlyStateHouseHold(false, '7a53ccec-e9fc-422b-b410-6c5ec82377d7', '94a4bca4-a05e-44d6-974b-0f09e2e4c576');
                } else {
                    if (this.serviceData.mode === 'update') {
                        return true;
                    } else {
                        this.resetModalValues();
                    }
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

            customLabel: function (option) {
                return option
            },

            updateSelected: function (value) {
                if (value & value.length) {
                    this.selectedResources.push(resource);
                }
                this.optionsProxy = []
            },

            cdnRequest: function (value) {
                this.addressOptions = [];
                if (value && this.postCodeRegex.test(value)) {
                    var _self = this;
                    _self.addressList = [];
                    _self.showLoadingSpinner = true;
                    var addressApi = "https://samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com/ByPostcode/json?postcode=" + value + "&key=NRU3-OHKW-J8L2-38PX&username=guest"
                    $.ajax({
                        url: addressApi,
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json',
                        "headers": {
                            "x-rapidapi-key": "0bd50d58e7mshbf91d1bd48fd6ecp124a09jsn0ca995389a59",
                            "x-rapidapi-host": "samsinfield-postcodes-4-u-uk-address-finder.p.rapidapi.com"
                        },
                        success: function (data) {
                            if (data.Error && Object.keys(data.Error).length) {
                                _self.showLoadingSpinner = false;
                                return false;
                            }
                            if (data.Summaries && data.Summaries.length) {
                                for (i = 0; i < data.Summaries.length; i++) {
                                    _self.addressList.push(data.Summaries[i].Place + ', ' + data.Summaries[i].StreetAddress + ', ' + value);
                                }
                                _self.addressOptions = _self.addressList;
                                _self.showLoadingSpinner = false;
                            } else {
                                _self.showLoadingSpinner = false;
                            }
                        },
                        error: function (error) {
                            _self.showLoadingSpinner = false;
                        }
                    });
                } else {
                    this.showLoadingSpinner = false;
                }

            },

            searchQuery: function (value) {
                this.cdnRequest(value)
            },

            removeDependency: function (index) {
                this.selectedResources.splice(index, 1)
            }
        }
    })
});




