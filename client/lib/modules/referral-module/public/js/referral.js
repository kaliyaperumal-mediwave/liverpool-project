$(window).on('load', function () {
    var _self = this;
    var Jquery = $;
    var app = new Vue({
        el: '#referral-form',
        mounted: function () {
            console.log('this', this, Jquery)
            console.log('loaded');
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
                isAccessingService: '',
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
                    parentKey: 'supportOrSymptoms',
                    childKey: 'accessList'
                }
            ],
            diagnosisList: [],
            problemsList: [],
            accessList: [],
            serviceData: {
                name: null,
                professional: null,
                contact: null,
                hasNameReqError: false,
                hasProfReqError: false,
                hasContactReqError: false
            },
            hasSubmittedServiceForm: false,
            listOfDiagnosis: [
                { id: '11E', value: 'ADD/ADHD', isActive: false },
                { id: '1154', value: 'Anxiety', },
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
                { id: '96DFG', value: 'Pulling hair out' },
                { id: '4F7', value: 'Separation anxiety' },
                { id: '1154FVGD', value: 'Stress' },
                { id: 'OI9P8', value: 'Suicidal thoughts' },
                { id: '7TR', value: 'Social phobia' },
                { id: '1NFH', value: 'Tics and Tourette’s' },
                { id: 'TRYE', value: 'Wetting and soiling' }
            ],
            listOfProblems: [
                { id: 'sdf', value: 'ADD/ADHD', isActive: false },
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
                { id: '0205dfg', value: 'Pulling hair out' },
                { id: '2432fg', value: 'Separation anxiety' },
                { id: 'p989df', value: 'Stress' },
                { id: 'mk89uj8', value: 'Suicidal thoughts' },
                { id: '9ig89u', value: 'Social phobia' },
                { id: '8mfg8', value: 'Tics and Tourette’s' },
                { id: '88gfh', value: 'Wetting and soiling' }
            ],
            listOfAvailableService: [
                { id: 'oopdfh', value: 'Addvanced Solutions', isActive: false },
                { id: '8789dfgji', value: 'ADHD Foundation', isActive: false },
                { id: '89df8fg', value: 'Alder Hey CAHMS', isActive: false },
                { id: 'pdf9', value: 'Barnado’s Young Carers', isActive: false },
                { id: 'mknib', value: 'Bully Busters', isActive: false },
                { id: 'cdsfg', value: 'EDYS', isActive: false },
                { id: '7856zf', value: 'Kooth', isActive: false },
                { id: '34545ds', value: 'Merseycare 16-18', isActive: false },
                { id: 'po89767', value: 'Merseyside Youth Association', isActive: false },
                { id: '908978xczx', value: 'PSS Spinning World', isActive: false },
                { id: 'lijbxc', value: 'Venus', isActive: false },
                { id: '85fhtsewre', value: 'YPAS', isActive: false },
                { id: '0dfsu8u', value: 'Other', isActive: false },
            ],
            allAvailableService: [],
            toggleModal: false
        },
        methods: {
            onOptionChange(event) {
                var questionIdentifier = event.target.name;
                var optionsName = this.referralData;
                var formLenght = Array.from(document.forms).indexOf(event.target.form);
                if (questionIdentifier === 'support') {
                    if (optionsName.support === 'mentalHealth' || optionsName.support === 'eatingDisorder' || optionsName.support === 'bothMental&Eating') {
                        this.resetValues(event.target.form);
                    }
                } else if (questionIdentifier === 'covidReferal') {
                    if (optionsName.covid === 'unsure' || optionsName.covid === 'yes' || optionsName.covid === 'no') {
                        this.resetValues(event.target.form);
                    }
                }
                else if (questionIdentifier === 'mentalDiagnosis') {
                    if (optionsName.diagnosis === 'yes') {
                        this.resetValues(event.target.form);
                    } else {
                        this.resetValues(event.target.form);
                    }
                }
                else if (questionIdentifier === 'listDiagnosis') {
                    console.log(this.diagnosisList);
                    if (!this.diagnosisList.length) {
                        if (optionsName.diagnosisOther === '') {
                            this.resetValues(event.target.form);
                        }
                    }

                }
                else if (questionIdentifier === 'symptomOrSupport') {
                    if (optionsName.supportOrSymptoms === 'yes') {
                        this.resetValues(event.target.form);
                    }
                    else {
                        this.resetValues(event.target.form);
                    }
                }

                else if (questionIdentifier === 'listProblems') {
                    if (!this.problemsList.length) {
                        if (optionsName.problemsOther === '') {
                            this.resetValues(event.target.form);
                        }
                    }
                }

                else if (questionIdentifier === 'accessedService') {
                    if (optionsName.accessService === 'yes') {
                        this.resetValues(event.target.form);

                    } else {
                        this.resetValues(event.target.form);
                    }
                }

                else if (questionIdentifier === 'listService') {
                    if (!this.accessList.length) {
                        this.resetValues(event.target.form);
                    }
                }

                else if (questionIdentifier === 'anyService') {
                    if (optionsName.isAccessingService === 'yes') {
                        this.resetValues(event.target.form);
                    } else {
                        this.resetValues(event.target.form);
                    }
                }
            },

            //Getting values from Input
            onValueEnter(e) {
                var questionIdentifier = event.target.name;
                var optionsName = this.referralData;
                var formLenght = Array.from(document.forms).indexOf(event.target.form);
                if (questionIdentifier === 'listDiagnosis') {
                    if (!this.diagnosisList.length) {
                        if (!e.target.value) {
                            this.resetValues(event.target.form);
                        }
                    }

                } else if (questionIdentifier === 'listProblems') {
                    if (!e.target.value) {
                        this.resetValues(event.target.form);
                    }
                }
            },

            //Adding a service
            upsertService(event) {
                console.log('all service', this.allAvailableService);
                this.hasSubmittedServiceForm = true;
                var serviceForm = this.serviceData;
                if (serviceForm.name && serviceForm.professional && serviceForm.contact) {
                    this.allAvailableService.push(JSON.parse(JSON.stringify(serviceForm)));
                    this.resetModal();
                    var modal = document.getElementById('closeModal');
                    modal.setAttribute("data-dismiss", "modal");
                } else {
                    this.toggleModal = false;
                    if (!serviceForm.name) {
                        serviceForm.hasNameReqError = true;
                    }
                    if (!serviceForm.professional) {
                        serviceForm.hasProfReqError = true;
                    }
                    if (!serviceForm.contact) {
                        serviceForm.hasContactReqError = true;
                    }
                    return false;
                }
            },

            patchService(service, index) {
                console.log('all service', this.allAvailableService);
                console.log('index', index);
                var serviceForm = this.serviceData;
                serviceForm.name = service.name;
                serviceForm.professional = service.professional;
                serviceForm.contact = service.contact;
                serviceForm.index = index;
            },

            deleteService(service) {
                console.log(service);
            },

            onValueEnterService(e, type) {
                console.log(e)
                var serviceForm = this.serviceData
                if (this.hasSubmittedServiceForm) {
                    if (type === 'name') {
                        if (!e.target.value) {
                            serviceForm.hasNameReqError = true;
                        } else {
                            serviceForm.hasNameReqError = false;
                        }
                    } else if (type === 'prof') {
                        if (!e.target.value) {
                            serviceForm.hasProfReqError = true;
                        } else {
                            serviceForm.hasProfReqError = false;
                        }
                    }
                    else if (type === 'contact') {
                        if (!e.target.value) {
                            serviceForm.hasContactReqError = true;
                        } else {
                            serviceForm.hasContactReqError = false;
                        }
                    }


                }

            },

            resetModal() {
                this.hasSubmittedServiceForm = false;
                this.serviceData.name = '';
                this.serviceData.professional = '';
                this.serviceData.contact = '';
                this.serviceData.hasNameReqError = false;
                this.serviceData.hasProfReqError = false;
                this.serviceData.hasContactReqError = false;
            },

            //Reset Two-Way-Model Values
            resetValues(currentForm) {
                var allForms = Array.from(document.forms);
                var formIndex = allForms.indexOf(currentForm);
                console.log(formIndex);
                // var objectKeys = Object.keys(this.referralData);
                for (let i = 0; i < allForms.length; i++) {
                    var attributevalue = $(allForms[i]).data('options');
                    console.log("loop index.........", i, allForms.indexOf(allForms[i]), attributevalue);
                    if (formIndex < i) {
                        this.referralData[attributevalue] = '';
                    }
                    if (formIndex <= i) {
                        this.clearDependentValues(attributevalue);
                    }
                }
            },

            clearDependentValues(parentKey) {
                var foundKeyPair = this.dependent.find(function (ele) { return ele.parentKey === parentKey });
                console.log("foundKeyPair.......", parentKey, foundKeyPair);
                if (foundKeyPair) {
                    this[foundKeyPair.childKey] = [];
                }
            },

            //Reset Forms
            resetForm(form, val) {
                console.log(form, "form");
                console.log('val should be vue :: ', val)
                var forms = document.forms;
                console.log(forms.length, "forms.length===");
                for (var i = form; i < forms.length - 1; i++) {
                    console.log(i + 1, "test");
                    forms[i + 1].reset();
                }
            }
        },
    });
});


