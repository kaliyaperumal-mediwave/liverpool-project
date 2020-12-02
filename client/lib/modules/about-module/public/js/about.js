var API_URI = "/modules/about-module";
$(document).ready(function () {
   
    var app = new Vue({
        el: '#about-form',
        data: {
            labelToDisplay: "",
            aboutObj: {
                nhsNumber: "",
                childName: "",
                childEmail: "",
                childContactNumber: "",
                childAddress: "",
                sendPost: "",
                childGender: "",
                childIdentity: "",
                childSexualOrientation: "",
                childEthnicity: "",
                childCareAdult: "",
            },
            aboutFormData: {
                parentialResponsibility: "",
                parentCarerName: "",
                relationshipToYou: "",
                contactNumber: "",
                emailAddress: "",
                sameHouse: "",
                parentOrCarrerAddress: "",
                legalCareStatus: ""
            },
            sendObj: {},
            sec2dynamicLabel: {},
            houseHoldData: {
                name: '',
                relationShip: '',
                dob: '',
                profession: ''
            },
            allHouseHoldMembers: [],
            isFormSubmitted: false,
            isHouseHoldFormSubmitted: false,
            phoneRegex: /^[0-9,-]{10,15}$|^$/,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            nhsRegex: /^\d+$/,
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
            paramValues:[]

        },
        mounted: function () {
            var _self = this;
           this.paramValues= getParameter(location.href)
           this.userId =  this.paramValues[0];
           this.userRole = this.paramValues[1];

           console.log(this.paramValues)

            // this.userMode = getQueryStringValue('mode');
            // this.userRole = getQueryStringValue('role');
            // this.userId = getQueryStringValue('userId');

            this.sec2dynamicLabel = getDynamicLabels(this.userRole, undefined);
            console.log(this.sec2dynamicLabel)
            google.maps.event.addDomListener(window, 'load', _self.initMaps);

            $('#houseHoldDate').datepicker({
                dateFormat: 'yy-mm-dd',
                duration: "fast",
                changeMonth: true,
                changeYear: true,
                autoSize: true,
                gotoCurrent: true,
                setDate: new Date(),
                minDate: new Date(1950, 10 - 1, 25),
                maxDate: '+30Y',
                yearRange: '1950:c',
                onSelect: function (dateText) {
                    // $(this)[0].dispatchEvent(new Event('input', { 'bubbles': true }))
                    _self.houseHoldData.dob = dateText
                },
            });

            // if (this.userMode === 'edit') {
            //     this.patchValue();
            // }
            if (this.paramValues[2] == "edit") {
                this.fetchSavedData();
            }

        },
        methods: {

            //Initilaizing Google Maps Autocompleted
            initMaps: function () {
                var _self = this;
                var childAddress;
                var houseHoldAddress;
                var parentAddress;
                childAddress = new google.maps.places.Autocomplete((document.getElementById('txtChildAddress')), {
                    types: ['geocode'],
                });
                houseHoldAddress = new google.maps.places.Autocomplete((document.getElementById('educLocation')), {
                    types: ['geocode'],
                });
                parentAddress = new google.maps.places.Autocomplete((document.getElementById('gpParentorCarerLocation')), {
                    types: ['geocode'],
                });
                google.maps.event.addListener(childAddress, 'place_changed', function () {
                    _self.aboutObj.childAddress = childAddress.getPlace().formatted_address;
                });
                google.maps.event.addListener(houseHoldAddress, 'place_changed', function () {
                    _self.houseHoldData.profession = houseHoldAddress.getPlace().formatted_address;
                });

                google.maps.event.addListener(parentAddress, 'place_changed', function () {
                    _self.aboutFormData.parentOrCarrerAddress = parentAddress.getPlace().formatted_address;
                });
            },

            onOptionChange: function(event) {
                var questionIdentifier = event.target.name;
                var optionsName = this.aboutFormData;
                // if (questionIdentifier == 'parentialResponsibility') {
                this.sec2dynamicLabel = getDynamicLabels(this.userRole, optionsName.parentialResponsibility)
                resetValues(event.target.form, this, 'aboutFormData');
                // }
            },

            //Ftech Api service Logic
            fetchSavedData: function () {
                var payload = {};
                payload.uuid = this.userId;
                payload.role = this.userRole;
                var successData = apiCallPost('post', '/fetchAbout', payload);
                if (Object.keys(successData)) {
                    this.patchValue(successData);
                } else {
                    console.error('error')
                }

            },

            //Setting values Logic for Edit and Update
            patchValue: function (data) {
               // this.allHouseHoldMembers = data.allHouseHoldMembers;
                if (this.userRole == "child") {
                    Vue.set(this.aboutObj, "childName", data.child_name);
                    Vue.set(this.aboutObj, "childEmail", data.child_email);
                    Vue.set(this.aboutObj, "childContactNumber", data.child_contact_number);
                    Vue.set(this.aboutObj, "childAddress", data.child_address);
                    Vue.set(this.aboutObj, "sendPost", data.can_send_post);
                    Vue.set(this.aboutObj, "childGender", data.child_gender);
                    Vue.set(this.aboutObj, "childIdentity", data.child_identity);
                    Vue.set(this.aboutObj, "childSexualOrientation", data.child_sexual_orientation);
                    Vue.set(this.aboutObj, "childEthnicity", data.child_ethnicity);
                    Vue.set(this.aboutObj, "childCareAdult", data.child_care_adult);
                    Vue.set(this.aboutFormData, "parentialResponsibility", data.parent[0].parential_responsibility);
                    Vue.set(this.aboutFormData, "parentCarerName", data.parent_carer_name);
                    Vue.set(this.aboutFormData, "relationshipToYou", this.convertDate(data.relationshipToYou));
                    Vue.set(this.aboutFormData, "contactNumber", data.child_household_profession);
                    Vue.set(this.aboutFormData, "emailAddress", data.child_household_name);
                    Vue.set(this.aboutFormData, "sameHouse", data.parent[0].parent_name);
                    Vue.set(this.aboutFormData, "parentOrCarrerAddress", data.parent[0].responsibility_parent_name);
                    Vue.set(this.aboutFormData, "legalCareStatus", data.parent[0].child_parent_relationship);

                }
                else if (this.userRole == "parent") {
                    console.log(data);
                    console.log(data[0].parential_responsibility )

                    Vue.set(this.aboutObj,"childNHS",data[0].parent[0].child_NHS);
                    Vue.set(this.aboutObj,"childName",data[0].parent[0].child_name);
                    Vue.set(this.aboutObj,"childEmail",data[0].parent[0].child_email);
                    Vue.set(this.aboutObj,"childContactNumber",data[0].parent[0].child_contact_number);
                    Vue.set(this.aboutObj,"childAddress",data[0].parent[0].child_address);
                    Vue.set(this.aboutObj,"sendPost",data[0].parent[0].can_send_post);
                    Vue.set(this.aboutObj,"childGender",data[0].parent[0].child_gender);
                    Vue.set(this.aboutObj,"childIdentity",data[0].parent[0].child_gender_birth);
                    Vue.set(this.aboutObj,"childSexualOrientation",data[0].parent[0].child_sexual_orientation);
                    Vue.set(this.aboutObj,"childEthnicity",data[0].parent[0].child_ethnicity);
                    Vue.set(this.aboutObj,"childCareAdult",data[0].parent[0].child_care_adult );
                    Vue.set(this.aboutObj,"houseHoldName",data[0].parent[0].child_household_name );
                    Vue.set(this.aboutObj,"parentName",data[0].parent_name );
                    Vue.set(this.aboutObj,"parentContactName",data[0].responsibility_parent_name );
                    Vue.set(this.aboutFormData,"parentialResponsibility",data[0].parential_responsibility );
                    Vue.set(this.aboutObj,"relationshipToYou",data[0].child_parent_relationship );
                    Vue.set(this.aboutObj,"parentContactNumber",data[0].parent_contact_number );
                    Vue.set(this.aboutObj,"parentEmail",data[0].parent_email );
                    Vue.set(this.aboutObj,"parentSameHouse",data[0].parent_same_house );
                    Vue.set(this.aboutObj,"selectedParentAddress",data[0].parent_address );
                    Vue.set(this.aboutObj,"legalCareStatus",data[0].legal_care_status );
                    this.allHouseHoldMembers = data[0].parent[0].household_member;
                }

                else if (this.userRole == "professional") {
                    Vue.set(this.aboutObj,"childNHS",data[0].parent[0].child_NHS);
                    Vue.set(this.aboutObj,"childName",data[0].parent[0].child_name);
                    Vue.set(this.aboutObj,"childEmail",data[0].parent[0].child_email);
                    Vue.set(this.aboutObj,"childContactNumber",data[0].parent[0].child_contact_number);
                    Vue.set(this.aboutObj,"childAddress",data[0].parent[0].child_address);
                    Vue.set(this.aboutObj,"sendPost",data[0].parent[0].can_send_post);
                    Vue.set(this.aboutObj,"childGender",data[0].parent[0].child_gender);
                    Vue.set(this.aboutObj,"childIdentity",data[0].parent[0].child_gender_birth);
                    Vue.set(this.aboutObj,"childSexualOrientation",data[0].parent[0].child_sexual_orientation);
                    Vue.set(this.aboutObj,"childEthnicity",data[0].parent[0].child_ethnicity);
                    Vue.set(this.aboutObj,"childCareAdult",data[0].parent[0].child_care_adult );
                    Vue.set(this.aboutObj,"houseHoldName",data[0].parent[0].child_household_name );
                    Vue.set(this.aboutObj,"parentName",data[0].parent_name );
                    Vue.set(this.aboutObj,"parentContactName",data[0].responsibility_parent_name );
                    Vue.set(this.aboutObj,"parentialResponsibility",data[0].parential_responsibility );
                    Vue.set(this.aboutObj,"childParentRelationship",data[0].child_parent_relationship );
                    Vue.set(this.aboutObj,"parentContactNumber",data[0].parent_contact_number );
                    Vue.set(this.aboutObj,"parentEmail",data[0].parent_email );
                    Vue.set(this.aboutObj,"parentSameHouse",data[0].parent_same_house );
                    Vue.set(this.aboutObj,"selectedParentAddress",data[0].parent_address );
                    Vue.set(this.aboutObj,"legalCareStatus",data[0].legal_care_status );
                    Vue.set(this.aboutObj,"parentUUID",data[0].uuid );
                    // document.getElementById("showAdToast").style.display = "block";
                    // document.getElementById("showAdBtn").style.display = "block";
                }
            },

            //Form Submittion of Section-4(Referral) with validation logic
            saveAndContinue: function() {
                
                this.isFormSubmitted = true;
                var formData = Object.assign(this.aboutObj, this.aboutFormData);
                this.payloadData.aboutData = JSON.parse(JSON.stringify(formData));
                this.payloadData.role = this.userRole;
                this.payloadData.userid = this.userId;
                this.payloadData.allHouseHoldMembers = this.allHouseHoldMembers;
                this.payloadData.editFlag =this.paramValues[2]
             //   this.payloadData.id = this.referralId;
                if (this.userMode === 'edit') {
                    this.payloadData.userMode = 'edit';
                } else {
                    this.payloadData.userMode = 'add';
                }
                this.upsertAboutYouForm(this.payloadData);
                return;
                if (formData.contactNumber && formData.relationshipToYou &&
                    formData.parentCarerName && formData.parentialResponsibility && formData.childGender &&
                    formData.childIdentity && formData.sendPost && formData.childAddress && formData.childName && this.phoneRegex.test(formData.contactNumber)
                ) {

                    if ((formData.nhsNumber && !this.nhsRegex.test(formData.nhsNumber)) || (formData.childEmail && !this.emailRegex.test(formData.childEmail)) ||
                        (formData.childContactNumber && !this.phoneRegex.test(formData.childContactNumber)) ||
                        (formData.contactNumber && !this.phoneRegex.test(formData.contactNumber)) ||
                        (formData.emailAddress && !this.emailRegex.test(formData.emailAddress))
                    ) {
                        scrollToInvalidInput();
                        return false;
                    } else {
                        this.payloadData.aboutData = JSON.parse(JSON.stringify(formData));
                        this.payloadData.role = this.userRole;
                        this.payloadData.userid = this.userId;
                        this.payloadData.allHouseHoldMembers = this.allHouseHoldMembers;
                        this.payloadData.editFlag =this.paramValues[2]
                     //   this.payloadData.id = this.referralId;
                        if (this.userMode === 'edit') {
                            this.payloadData.userMode = 'edit';
                        } else {
                            this.payloadData.userMode = 'add';
                        }
                        this.upsertAboutYouForm(this.payloadData);
                    }

                } else {
                    scrollToInvalidInput();
                    return false;
                }

            },

            //Section 2(About You) Save and Service call with navaigation Logic
            upsertAboutYouForm: function(payload) {
                
                var responseData = apiCallPost('post', '/saveReferral', payload);
            //     if (Object.keys(responseData)) {
            //         if (getUrlVars()["edt"] == null) {
            //             location.href = "/education?userid=" + responseData.userid + "&role=" + responseData.role;
            //         }
            //         else {
            //             history.back();
            //         }
            //     } else {
            //         console.log('empty response')
            //     }
             },

            //Adding and Updating a HouseHold logic
            upsertHouseHold: function() {
                this.isHouseHoldFormSubmitted = true;
                var houseHoldForm = this.houseHoldData;
                var modal = document.getElementById('closeModal');
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
            patchHouseHold: function(houseHold) {
                var houseHoldForm = this.houseHoldData;
                houseHoldForm.name = houseHold.name;
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
            deleteHouseHold: function(service) {
                deleteLogic(this.allHouseHoldMembers, service, this, 'allHouseHoldMembers')
            },

            //Resetting the modal values of service data
            resetModalValues: function() {
                this.isHouseHoldFormSubmitted = false;
                this.houseHoldData.name = '';
                this.houseHoldData.relationShip = '';
                this.houseHoldData.dob = '';
                this.houseHoldData.profession = '';
                this.houseHoldData.mode = '';
            },

            resetModal: function(type) {
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
                backToPreviousPage('/role?',this.userId,this.userRole)
            },

            //Clearing date values from inpt
            clearDate: function (e) {
                if (e.keyCode == 8 || e.keyCode == 46) {
                    $('#houseHoldDate').datepicker('setDate', null);
                    // $('input.hasDatepicker').val('');
                    this.houseHoldData.dob = "";
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

            convertDate: function (dbDate) {
                var date = new Date(dbDate)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();
                var mmChars = mm.split('');
                var ddChars = dd.split('');
                this.fetchAgeLogic(dbDate);
                return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
            },

            
        }

    })
});