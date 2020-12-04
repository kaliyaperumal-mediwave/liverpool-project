var API_URI = "/modules/referral-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#referral-form',

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            $('#loader').hide();
            this.paramValues = getParameter(location.href)
            this.userId = this.paramValues[0];
            this.userRole = this.paramValues[1];
            this.userMode = this.paramValues[2];
            this.dynamicLabels = getDynamicLabels(this.userRole);
            console.log(this.userId, this.userRole, this.userMode)
            // this.userMode = getQueryStringValue('mode');
            // this.userRole = getQueryStringValue('role');
            // this.userId = getQueryStringValue('userId');
            if (this.userMode === 'edit') {
                this.fetchSavedData();
            }
            // if (getUrlVars()['edt'] == 1) {
            //     this.fetchSavedData()
            // }
            // else {
            //     console.log("if else")
            // }
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
                { id: '1187', value: 'Psychosis (hearing or seeing things that other’s can’t)' },
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
                { id: 'sdf', value: 'ADD/ADHD' },
                { id: '564dfh', value: 'Anxiety', },
                { id: '564j', value: 'Autism' },
                { id: 'hj', value: 'Bullying related' },
                { id: '02h', value: 'Conduct disorder' },
                { id: '9897', value: 'Depression' },
                { id: 'dfj7t8y', value: 'Dyslexia' },
                { id: 'g4df56+', value: 'Drinking and drugs related' },
                { id: 'fjuyt18', value: 'Eating Disorders' },
                { id: 'rujr98yu', value: 'Family Difficulty' },
                { id: 'fjyhj1', value: 'Gender dysphoria' },
                { id: 'dfjj848', value: 'Obsessive-compulsive disorder (OCD)' },
                { id: 'dfghjd89', value: 'Panic attacks' },
                { id: 'dfg8', value: 'Phobias' },
                { id: '1187', value: 'Psychosis (hearing or seeing things that other’s can’t)' },
                { id: 'df198oijd', value: 'Self-harm' },
                { id: 'gdfh98', value: 'Pulling hair out' },
                { id: '2432fg', value: 'Separation anxiety' },
                { id: 'p989df', value: 'Stress' },
                { id: 'mk89uj8', value: 'Suicidal thoughts' },
                { id: '9ig89u', value: 'Social phobia' },
                { id: '8mfg8', value: 'Tics and Tourette’s' },
                { id: '88gfh', value: 'Wetting and soiling' }
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
            onOptionChange(event) {
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
            onValueEnter(e) {
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
                this.patchValue(successData);
            },


            //Form Submittion of Section-4(Referral) with validation logic
            saveAndContinue() {
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
            upsertReferralForm(payload) {
                var responseData = apiCallPost('post', '/saveReferral', payload);
                if (Object.keys(responseData)) {
                    if (this.paramValues[2] == undefined) {
                        var parameter = this.userId + "&" + this.userRole
                        var enCodeParameter = btoa(parameter)
                        location.href = "/review?" + enCodeParameter;
                        // location.href = "/review?userid=" + responseData.userid + "&role=" + responseData.role;
                    }
                    else {
                        history.back();
                    }
                } else {
                    console.log('empty response')
                }
            },

            //Patching the value logic
            patchValue(data) {
                console.log(data)
                this.diagnosisList = data.diagnosis;
                this.problemsList = data.diagnosis;
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
            upsertService() {
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
            patchService(service) {
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
            deleteService(service) {
                deleteLogic(this.allAvailableService, service, this, 'allAvailableService')
            },

            //Resetting the modal values of service data
            resetModalValues() {
                this.hasSubmittedServiceForm = false;
                this.serviceData.name = '';
                this.serviceData.professional = '';
                this.serviceData.contact = '';
                this.serviceData.mode = '';
            },

            resetModal(type) {
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

            clearDependentValues(parentKey) {
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

