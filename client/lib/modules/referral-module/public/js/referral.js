var API_URI = "/modules/referral-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#referral-form',

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.userId = this.paramValues[0];
            this.userRole = this.paramValues[1];
            this.userMode = this.paramValues[2];
            this.dynamicLabels = getDynamicLabels(this.userRole);
            console.log(this.userId, this.userRole, this.userMode)
            if (this.userMode !== undefined) {
                this.fetchSavedData();
            }
            $('#loader').hide();
        },
        data: {
            referralData: {
                support: '',
                covid: '',
                dailyIntakes: '',
                height: '',
                weight: '',
                otherReasonsReferral: '',
                referralInfo: '',
                hasAnythingInfo: '',
                triggerInfo: '',
                disabilityOrDifficulty: '',
                accessService: '',
                listService: '',
            },
            dependent: [
                // {
                //     parentKey: 'diagnosis',
                //     childKey: 'diagnosisList'
                // },
                {
                    parentKey: 'covid',
                    childKey: 'eatingDifficulties'
                },
                // {
                //     parentKey: 'supportOrSymptoms',
                //     childKey: 'problemsList'
                // },
                {
                    parentKey: 'accessService',
                    childKey: 'accessList'
                }
            ],
            serviceData: {
                name: null,
                professional: null,
                contact: null,
            },
            currentSection: 'referral',
            phoneRegex: /^[0-9,-]{10,15}$|^$/,
            dynamicLabels: {},
            isFormSubmitted: false,
            serviceOthers: [],
            showAddOtherService: false,
            userRole: '',
            userMode: '',
            userId: '',
            payloadData: {},
            diagnosisList: [],
            problemsList: [],
            eatingDifficulties: [],
            reasonForReferral: [],
            accessList: [],
            allAvailableService: [],
            referralId: "",
            hasSubmittedServiceForm: false,
            storeDeleteData: null,
            listOfEatingDifficulties: [
                { id: '4937fd43-79ae-4974-90d9-601966a9d3fb', value: 'Restricting Food Intake' },
                { id: 'bd8efbb4-6491-4520-aea7-8ab35f38a261', value: 'Restricting Fluid Intake' },
                { id: '6d31681e-a9b9-4cbe-a7e1-26bcbd17d9c3', value: 'Fear of being fat' },
                { id: '14568ba7-78b0-4bca-aed3-560bdba83060', value: 'Increased preoccupation with weight and shape' },
                { id: '73257df0-9c00-4125-8238-fe096bac4253', value: 'Excessive exercising' },
                { id: '4714dbea-340d-42c5-a183-d54e9522aadb', value: 'Bingeing/ Purging' },
                { id: '48443ca2-47a0-4a8f-be63-59324c509558', value: 'Recent excessive loss of weight' },
                { id: 'fb8c41e3-922e-4332-867a-d67e2bb292fc', value: 'Blackouts' },
                { id: '4ca2d04b-b507-4ef9-ba82-323f4ff665ac', value: 'Dizziness' },
                { id: 'c652572a-2610-434c-9e2a-96cdfefe292d', value: 'Feeling weak and cold' },
                { id: '68066f83-1aca-45f4-97ee-84da1485d02b', value: 'Low mood' },
                { id: '3b568128-10a1-4e5a-a2e5-9fa4a0163de5', value: 'Anxiety' },
                { id: '33cd1600-037f-45d6-a226-1d093d821cb5', value: 'Obsessive behaviour or thoughts' },
                { id: 'ad07ea21-e0c4-488b-b6b0-2e39046fbb92', value: 'Amenorrhoea' },
            ],
            reasonForReferralList: [
                { id: '4bc26bf2-d79b-4b83-912f-e83300efb10e', value: 'Trouble concentrating' },
                { id: 'ac1d34e8-5443-4286-8be2-c964430356c0', value: 'Feeling nervous or on edge', },
                { id: 'e22e6ab1-9b56-490d-8afd-6fcce1969989', value: 'Trouble socialising' },
                { id: '01386494-4f30-4bc5-907d-1d77b5b59540', value: 'Bullying' },
                { id: '864dc606-6954-4855-ad30-a923c1214b01', value: 'Find it hard to control myself' },
                { id: 'e2e9e23c-7802-4e5b-959e-438a612516ec', value: 'Feeling sad, unhappy or hopeless' },
                { id: 'e647a2a8-3240-46cb-8c89-6376e73db296', value: 'Trouble reading and writing' },
                { id: '22b1ac46-71c2-460f-93e3-f672ca73116c', value: 'Drinking and drugs' },
                { id: 'ac03479d-ac0f-4977-a431-d8a350b4d254', value: 'Feeling clumsy and uncoordinated' },
                { id: '2a51c85a-8bc6-4107-bc5a-e76d68fb6be6', value: 'Issues with food, diet or eating' },
                { id: '64740f8f-70c1-4cc6-9222-3f56880a426b', value: 'Problems with family' },
                { id: 'ea72e4b5-f325-41c6-9958-116aa8780a4d', value: 'Problems with self identity' },
                { id: 'cb57d9e4-43a4-469f-9bb7-5949e7b686da', value: 'Compulsive behaviour' },
                { id: 'bb60f501-a346-44fd-860c-3a815ce4ca73', value: 'Panic attacks' },
                { id: '6b4eb776-4287-4296-ab2c-7599939e1c5b', value: 'Feeling scared or anxious' },
                { id: '7a95930e-db58-4bbd-99c8-842dd965c1be', value: 'Seeing or hearing things' },
                { id: '12837896-732c-4a98-be65-f8213728ab73', value: 'Had a traumatic experience' },
                { id: '21eaed08-af51-4115-b6c0-e376eedd9a92', value: 'Feeling that I want to hurt myself' },
                { id: '42496c57-6c92-45f1-97d9-ed763843b53b', value: 'Self-harming' },
                { id: 'f3834f7c-b227-4069-af8a-ee6703bbf393', value: 'Pulling hair out' },
                { id: 'f053d058-678f-4182-aaf7-0b95fedbf1db', value: 'Trouble sleeping' },
                { id: '9c4fa623-f374-49d6-b774-dfda8a1a9f33', value: 'Feeling stressed' },
                { id: '5bea946d-5632-40ef-8d15-523aeb5b747e', value: 'Feeling that I don’t want to live' },
                { id: 'a1373df9-a335-46f5-a530-53b157b64d58', value: 'Uncontrolled movements' },
                { id: 'ba1df932-b6af-4971-b61f-a57895506548', value: 'Wetting or soiling myself' },
                { id: '97caac9e-057f-4df2-8a94-a972e6cae5b3', value: 'Low self esteem' },
                { id: '8676c899-f721-4ebe-9276-7294a64adabd', value: 'Lacking confidence in myself' },

            ],
            listOfAvailableService: [
                { id: '3346efa5-661f-4112-9caf-1fa12c98504e', value: 'Advanced Solutions' },
                { id: '45d6204e-c1e1-46c1-8168-60ea04c70390', value: 'ADHD Foundation' },
                { id: 'f44a383f-1952-4db4-b2e2-11b6cf11ba9a', value: 'Alder Hey CAHMS' },
                { id: 'bda7d546-1452-4ae7-9e01-1e96c8a7991d', value: 'Barnado’s Young Carers' },
                { id: 'd7f13aaa-64c7-4225-9dec-c669dd4a2d4e', value: 'Bully Busters' },
                { id: 'bf1b464e-dcc5-48e0-811b-53855a5435c7', value: 'EDYS' },
                { id: '9b39fa57-98da-41fa-93a7-4c2c4b191c89', value: 'Kooth' },
                { id: '652b84d6-3ff4-42ca-8e35-deaf80e2115e', value: 'Merseycare 16-18' },
                { id: '3d6c3a7e-1948-4eb9-86c8-8177dd132bc0', value: 'Merseyside Youth Association' },
                { id: '016b2e91-6872-4a5d-a49e-5e3a75cc7521', value: 'PSS Spinning World' },
                { id: 'e293c060-2cc4-4288-a941-b6bb56ac8ad4', value: 'Venus' },
                { id: 'e116e2a3-4623-4c01-af34-bbe9ccb8a829', value: 'YPAS' },
                { id: 'fefa3e54-a2ad-43a7-88cc-3fe4abe06533', value: 'Other' },
            ],
            paramValues: []
        },
        methods: {

            //Options changing logic
            onOptionChange: function (event) {
                var questionIdentifier = event.target.name;
                var optionsName = this.referralData;
                if (questionIdentifier == 'support' || questionIdentifier == 'covidReferal') {
                    resetValues(event.target.form, this, 'referralData');
                    this.reasonForReferral = [];
                } else if (questionIdentifier == 'accessedService') {
                    resetValues(event.target.form, this, 'referralData');
                }
                else if (questionIdentifier === 'eatingDisorder') {
                    if (!this.eatingDifficulties.length) {
                        resetValues(event.target.form, this, 'referralData');
                        this.reasonForReferral = [];
                    }
                }
                else if (questionIdentifier === 'listReasonsForReferral') {
                    if (!this.reasonForReferral.length) {
                        if (optionsName.otherReasonsReferral === '') {
                            resetValues(event.target.form, this, 'referralData');
                            this.reasonForReferral = [];
                        }
                    }
                }
                else if (questionIdentifier === 'listService') {
                    if (event.target.checked) {
                        if (event.target.value === 'Other') {
                            this.showAddOtherService = true;
                        }
                    } else {
                        if (event.target.value === 'Other') {
                            this.showAddOtherService = false;
                            this.allAvailableService = [];
                        }
                    }
                    if (!this.accessList.length) {
                        resetValues(event.target.form, this, 'referralData');
                    }
                }
            },

            //Getting values from Other Input box and logic
            onValueEnter: function (event) {
                var questionIdentifier = event.target.name;
                if (questionIdentifier === 'listReasonsForReferral') {
                    if (!event.target.value) {
                        if (!this.reasonForReferral.length) {
                            resetValues(event.target.form, this, 'referralData');
                        }
                    }
                } else if (questionIdentifier === 'briefOutlineInfo') {
                    if (!event.target.value) {
                        resetValues(event.target.form, this, 'referralData');
                        this.reasonForReferral = [];
                    }
                }
            },

            //Edit Api call
            fetchSavedData: function () {
                var payload = {};
                payload.userid = this.userId;
                payload.role = this.userRole;
                var successData = apiCallPost('post', '/fetchReferral', payload);
                if (successData && Object.keys(successData)) {
                    this.patchValue(successData);
                    $('#loader').hide();
                } else {
                    console.error('error');
                    $('#loader').hide();

                }
            },


            //Form Submission of Section-4(Referral) with validation logic
            saveAndContinue: function () {
                this.isFormSubmitted = true;
                var formData = this.referralData;
                if (formData.referralInfo) {
                    this.payloadData.referralData = JSON.parse(JSON.stringify(this.referralData));
                    this.payloadData.role = this.userRole;
                    this.payloadData.userid = this.userId;
                    this.payloadData.reasonForReferral = this.reasonForReferral;
                    this.payloadData.eatingDifficulties = this.eatingDifficulties;
                    // this.payloadData.diagnosisList = this.diagnosisList;
                    // this.payloadData.problemsList = this.problemsList;
                    this.payloadData.accessList = this.accessList;
                    this.payloadData.allAvailableService = this.allAvailableService;
                    this.payloadData.editFlag = getUrlVars()['edt'];
                    this.payloadData.id = this.referralId;
                    if (this.userMode === 'edit') {
                        this.payloadData.userMode = 'edit';
                    } else {
                        this.payloadData.userMode = 'add';
                    }
                    $('#loader').show();
                    this.upsertReferralForm(this.payloadData);

                } else {
                    scrollToInvalidInput();
                    return false;
                }

            },

            //Section 4(Referral) Save and Service call with navaigation Logic
            upsertReferralForm: function (payload) {
                var responseData = apiCallPost('post', '/saveReferral', payload);
                if (responseData && Object.keys(responseData)) {
                    $('#loader').hide();
                   // location.href = redirectUrl(location.href, "review");
                    location.href = redirectUrl(location.href, "review", this.userId, this.userRole);
                    this.storeDeleteData = null;
                } else {
                    $('#loader').hide();
                    console.log('empty response')
                }
            },

            //Patching the value logic
            patchValue: function (data) {
                console.log(data)
                this.eatingDifficulties = data.eating_disorder_difficulties;
                this.reasonForReferral = data.reason_for_referral;
                this.accessList = data.local_services;
                this.referralId = data.id;
                if (this.accessList.indexOf("Other") > -1) {
                    this.showAddOtherService = true;
                } else {
                    this.showAddOtherService = false;
                }
                this.allAvailableService = data.services;
                Vue.set(this.referralData, "support", data.referral_type);
                Vue.set(this.referralData, "covid", data.is_covid);

                //Vue.set(this.referralData, "eatingDifficulties", data.eating_disorder_difficulties);
                Vue.set(this.referralData, "dailyIntakes", data.food_fluid_intake);
                Vue.set(this.referralData, "height", data.height);
                Vue.set(this.referralData, "weight", data.weight);
               // Vue.set(this.referralData, "reasonForReferral", data.reason_for_referral);
                Vue.set(this.referralData, "otherReasonsReferral", data.other_reasons_referral);


                Vue.set(this.referralData, "referralInfo", data.referral_issues);
                Vue.set(this.referralData, "hasAnythingInfo", data.has_anything_helped);
                Vue.set(this.referralData, "triggerInfo", data.any_particular_trigger);
                Vue.set(this.referralData, "disabilityOrDifficulty", data.disabilities);
                Vue.set(this.referralData, "accessService", data.any_other_services);
            },

            //Adding and Updating  a service logic
            upsertService: function () {
                this.hasSubmittedServiceForm = true;
                var serviceForm = this.serviceData;
                var modal = document.getElementById('closeModal');
                if (serviceForm.name && serviceForm.professional && serviceForm.contact && this.phoneRegex.test(serviceForm.contact)) {
                    if (serviceForm.mode === 'update') {
                        this.allAvailableService = this.allAvailableService.map(function (it) {
                            if (it.mode === 'update' && it.id === serviceForm.id) {
                                it = JSON.parse(JSON.stringify(serviceForm));
                                delete it.mode;
                                return it;
                            }
                            else {
                                delete it.mode;
                                return it;
                            }
                        });

                    } else {
                        serviceForm.id = uuidV4();
                        serviceForm.mode = 'add';
                        this.allAvailableService.push(JSON.parse(JSON.stringify(serviceForm)));
                    }
                    this.resetModalValues();
                    modal.setAttribute("data-dismiss", "modal");

                } else {
                    modal.removeAttribute("data-dismiss", "modal");
                    return;
                }

            },

            //Patching the service logic
            patchService: function (service) {
                var serviceForm = this.serviceData;
                serviceForm.name = service.name;
                serviceForm.professional = service.professional;
                serviceForm.contact = service.contact;
                serviceForm.id = service.id;
                serviceForm.mode = 'update';
                this.allAvailableService.map(function (i) {
                    if (i.id === service.id) {
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

            deleteService: function (data) {
                var modal = document.getElementById('closeModalDelete');
                deleteLogic(this.allAvailableService, data, this, 'allAvailableService');
                modal.setAttribute("data-dismiss", "modal");
            },

            //Resetting the modal values of service data
            resetModalValues: function () {
                this.hasSubmittedServiceForm = false;
                this.serviceData.name = '';
                this.serviceData.professional = '';
                this.serviceData.contact = '';
                this.serviceData.mode = '';
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

            clearDependentValues: function (parentKey) {
                var foundKeyPair = this.dependent.filter(function (ele) { return ele.parentKey === parentKey })[0];
                if (foundKeyPair) {
                    this[foundKeyPair.childKey] = [];
                }
            },

            //Back to previous page
            backToEducation: function () {
                backToPreviousPage('/education?', this.userId, this.userRole)
                // backToPreviousPage('/education')
            },

        },
    });
});

