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
                diagnosis: '',
                diagnosisOther: '',
                supportOrSymptoms: '',
                problemsOther: '',
                referralInfo: '',
                hasAnythingInfo: '',
                triggerInfo: '',
                disabilityOrDifficulty: '',
                accessService: '',
                //isAccessingService: '',
                listService: '',
            },
            dependent: [
                {
                    parentKey: 'diagnosis',
                    childKey: 'diagnosisList'
                },
                {
                    parentKey: 'supportOrSymptoms',
                    childKey: 'problemsList'
                },
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
            accessList: [],
            allAvailableService: [],
            referralId: "",
            hasSubmittedServiceForm: false,
            storeDeleteData: null,
            listOfDiagnosis: [
                { id: '11E', value: 'ADD/ADHD' },
                { id: '1154', value: 'Anxiety' },
                { id: '11243', value: 'Autism' },
                { id: '1187C43', value: 'Bullying related' },
                { id: '118754', value: 'Conduct disorder' },
                { id: '198HT', value: 'Depression' },
                { id: '987GH', value: 'Dyslexia' },
                { id: '9HS8G+', value: 'Drinking and drugs related' },
                { id: 'SDF87H', value: 'Eating Disorders' },
                { id: '78TH', value: 'Family Difficulty' },
                { id: '2VDF20', value: 'Gender dysphoria' },
                { id: '43R4', value: 'Obsessive-compulsive disorder (OCD)' },
                { id: '1F5G4', value: 'Panic attacks' },
                { id: '47FBGH', value: 'Phobias' },
                { id: '118709877fg9543', value: 'Psychosis (hearing or seeing things that other’s can’t)' },
                { id: 'DF3V6S', value: 'Self-harm' },
                { id: '1DS', value: 'Pulling hair out' },
                { id: '4F7', value: 'Separation anxiety' },
                { id: '1154FVGD', value: 'Stress' },
                { id: 'OI9P8', value: 'Suicidal thoughts' },
                { id: '7TR', value: 'Social phobia' },
                { id: '1NFH', value: "Tics and Tourette’s" },
                { id: 'TRYE', value: 'Wetting and soiling' }
            ],
            listOfProblems: [
                { id: 'sdf', value: 'Trouble concentrating' },
                { id: '564dfh', value: 'Feeling nervous or on edge', },
                { id: '564j', value: 'Trouble socialising' },
                { id: 'hj', value: 'Bullying' },
                { id: '02h', value: 'Find it hard to control myself' },
                { id: '9897', value: 'Feeling sad, unhappy or hopeless' },
                { id: 'dfj7t8y', value: 'Trouble reading and writing' },
                { id: 'g4df56+', value: 'Drinking and drugs' },
                { id: 'fjuyt18', value: 'Feeling clumsy and uncoordinated' },
                { id: 'rujr98yu', value: 'Issues with food, diet or eating' },
                { id: 'fjyhj1', value: 'Problems with family' },
                { id: 'dfjj848', value: 'Problems with self identity' },
                { id: 'dfghjd89', value: 'Compulsive behaviour' },
                { id: 'dfg8', value: 'Panic attacks' },
                { id: '1187qw1243', value: 'Feeling scared or anxious' },
                { id: 'df198oijd', value: 'Seeing or hearing things' },
                { id: 'gdfh98', value: 'Had a traumatic experience' },
                { id: '2432fg', value: 'Feeling that I want to hurt myself' },
                { id: 'p989df', value: 'Self-harming' },
                { id: 'mk89uj8', value: 'Pulling hair out' },
                { id: '9ig89u', value: 'Trouble sleeping' },
                { id: '8mfg8', value: 'Feeling stressed' },
                { id: '88gfh', value: 'Feeling that I don’t want to live' },
                { id: '0f8495a7-4bc7-4194-a20b-485667901a02', value: 'Uncontrolled movements' },
                { id: 'ac435a42-7157-4529-a20c-16a5fbf3e226', value: 'Wetting or soiling myself' },
                { id: 'ac663e81-88c6-4514-9771-520de3088b03', value: 'Low self esteem' },
                { id: 'e8458f91-4e04-4487-8797-0dad7339b49c', value: 'Lacking confidence in myself' },


            ],
            listOfAvailableService: [
                { id: 'oopdfh', value: 'Addvanced Solutions' },
                { id: '8789dfgji', value: 'ADHD Foundation' },
                { id: '89df8fg', value: 'Alder Hey CAHMS' },
                { id: 'pdf9', value: 'Barnado’s Young Carers' },
                { id: 'mknib', value: 'Bully Busters' },
                { id: 'cdsfg', value: 'EDYS' },
                { id: '7856zf', value: 'Kooth' },
                { id: '34545ds', value: 'Merseycare 16-18' },
                { id: 'po89767', value: 'Merseyside Youth Association' },
                { id: '908978xczx', value: 'PSS Spinning World' },
                { id: 'lijbxc', value: 'Venus' },
                { id: '85fhtsewre', value: 'YPAS' },
                { id: '0dfsu8u', value: 'Other' },
            ],
            paramValues: []
        },
        methods: {

            //Options changing logic
            onOptionChange: function (event) {
                var questionIdentifier = event.target.name;
                var optionsName = this.referralData;
                if (questionIdentifier == 'support' || questionIdentifier == 'covidReferal' || questionIdentifier == 'mentalDiagnosis' ||
                    questionIdentifier == 'accessedService' || questionIdentifier === 'anyService') {
                    resetValues(event.target.form, this, 'referralData');
                }
                else if (questionIdentifier === 'listDiagnosis') {
                    if (!this.diagnosisList.length) {
                        if (optionsName.diagnosisOther === '') {
                            resetValues(event.target.form, this, 'referralData');
                        }
                    }
                }
                else if (questionIdentifier === 'listProblems') {
                    if (!this.problemsList.length) {
                        if (optionsName.problemsOther === '') {
                            resetValues(event.target.form, this, 'referralData');
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
            onValueEnter: function (e) {
                var questionIdentifier = event.target.name;
                if (questionIdentifier === 'listDiagnosis') {
                    if (!this.diagnosisList.length) {
                        if (!e.target.value) {
                            resetValues(event.target.form, this, 'referralData');
                        }
                    }

                } else if (questionIdentifier === 'listProblems') {
                    if (!e.target.value) {
                        resetValues(event.target.form, this, 'referralData');
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


            //Form Submittion of Section-4(Referral) with validation logic
            saveAndContinue: function () {
                this.isFormSubmitted = true;
                var formData = this.referralData;
                if (formData.referralInfo && formData.hasAnythingInfo && formData.triggerInfo && formData.disabilityOrDifficulty) {
                    this.payloadData.referralData = JSON.parse(JSON.stringify(this.referralData));
                    this.payloadData.role = this.userRole;
                    this.payloadData.userid = this.userId;
                    this.payloadData.diagnosisList = this.diagnosisList;
                    this.payloadData.problemsList = this.problemsList;
                    this.payloadData.accessList = this.accessList;
                    this.payloadData.allAvailableService = this.allAvailableService;
                    this.payloadData.editFlag = getUrlVars()['edt'];
                    this.payloadData.id = this.referralId;
                    if (this.userMode === 'edit') {
                        this.payloadData.userMode = 'edit';
                    } else {
                        this.payloadData.userMode = 'add';
                    }
                    this.upsertReferralForm(this.payloadData);

                } else {
                    scrollToInvalidInput();
                    return false;
                }

            },

            //Section 4(Referral) Save and Service call with navaigation Logic
            upsertReferralForm: function (payload) {
                var responseData = apiCallPost('post', '/saveReferral', payload);
                if (Object.keys(responseData)) {
                    location.href = redirectUrl(location.href, "review");
                    this.storeDeleteData = null;
                } else {
                    console.log('empty response')
                }
            },

            //Patching the value logic
            patchValue: function (data) {
                console.log(data)
                this.diagnosisList = data.diagnosis;
                this.problemsList = data.symptoms;
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

