var API_URI = "/modules/referral-module";
$(document).ready(function () {
    var _self = this;
    var app = new Vue({
        el: '#referral-form',
        mounted: function () {
            this.dynamicLabels = allLabels;
            this.userMode = this.getQueryStringValue('mode');
            this.userRole = this.getQueryStringValue('role');
            this.userId = this.getQueryStringValue('userId');
            console.log('role', this.userRole);
            if (this.userMode === 'edit') {
                this.patchValue();
            }
            if (this.getUrlVars()['edt'] == 1) {
                this.fetchSavedData()
            }
            else {
                console.log("if else")
            }
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
            dynamicLabels: {},
            requiredFields: {
                hasInfoReqError: false,
                hasAnythingReqError: false,
                hasTriggersReqError: false,
                hasHistoryReqError: false,
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
                hasNameReqError: false,
                hasProfReqError: false,
                hasContactReqError: false,
                hasContactInvalidError: false
            },
            isFormSubmitted: false,
            serviceOthers: [],
            showAddOtherService: false,
            userRole: '',
            userMode: '',
            payloadData: {},
            diagnosisList: [],
            problemsList: [],
            accessList: [],
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
            allAvailableService: [],
            sendObj: {},
            referralId: ""
        },
        methods: {
            fetchSavedData: function () {
                console.log("if")
                this.sendObj.userid = this.getUrlVars()['userid'];
                this.sendObj.role = this.getUrlVars()['role'];
                console.log(this.sendObj);
                //     var roleType=new URL(location.href).searchParams.get('role')
                $.ajax({
                    url: API_URI + "/fetchReferral",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        //alert("section 1 saved.");
                        //  console.log(data);
                        app.patchValue(data);

                    },
                });
            },
            patchValue(data) {
                console.log(data);
                this.diagnosisList = data.diagnosis;
                this.problemsList = data.diagnosis;
                this.accessList = data.local_services;
                this.referralId = data.id
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
                // Vue.set(this.referralData, "accessService", 'yes');
            },

            onOptionChange(event) {
                var questionIdentifier = event.target.name;
                var optionsName = this.referralData;
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

            //Adding and Updating  a service logic
            upsertService(event, type) {
                console.log('all service', this.allAvailableService);
                this.hasSubmittedServiceForm = true;
                var serviceForm = this.serviceData;
                var phoneRegex = /^[0-9,-]{10,15}$|^$/;
                if (serviceForm.mode === 'update') {
                    if (serviceForm.name && serviceForm.professional && serviceForm.contact) {
                        if (!phoneRegex.test(this.professionObj.socialWorkerContactNumber)) {
                            this.hasContactInvalidError = true;
                            return false;
                        } else {
                            this.hasContactInvalidError = false;
                        }
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
                        console.log('after added service', this.allAvailableService);
                        this.resetModalValues();
                        serviceForm.mode == ''
                        var modal = document.getElementById('closeModal');
                        modal.setAttribute("data-dismiss", "modal");
                        return false;
                    } else {
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
                }
                if (type === 'add') {
                    serviceForm.id = this.uuidV4();
                    serviceForm.mode = 'add';
                }
                if (serviceForm.name && serviceForm.professional && serviceForm.contact) {
                    if (!phoneRegex.test(serviceForm.contact)) {
                        serviceForm.hasContactInvalidError = true;
                        return false;
                    } else {
                        this.hasContactInvalidError = false;
                    }
                    this.allAvailableService.push(JSON.parse(JSON.stringify(serviceForm)));
                    console.log('after added service', this.allAvailableService);
                    this.resetModalValues();
                    var modal = document.getElementById('closeModal');
                    modal.setAttribute("data-dismiss", "modal");
                    serviceForm.mode == ''
                } else {
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

            resetModalValues() {
                this.serviceData.name = '';
                this.serviceData.professional = '';
                this.serviceData.contact = '';
                this.serviceData.hasNameReqError = false;
                this.serviceData.hasProfReqError = false;
                this.serviceData.hasContactReqError = false;
            },

            resetModal(e, type) {
                console.log(this.serviceData);
                if (type === 'add') {
                    this.hasSubmittedServiceForm = false;
                    this.serviceData.name = '';
                    this.serviceData.mode = '';
                    this.serviceData.professional = '';
                    this.serviceData.contact = '';
                    this.serviceData.hasNameReqError = false;
                    this.serviceData.hasProfReqError = false;
                    this.serviceData.hasContactReqError = false;
                } else {
                    if (this.serviceData.mode === 'update') {
                        return true;

                    } else {
                        this.hasSubmittedServiceForm = false;
                        this.serviceData.name = '';
                        this.serviceData.professional = '';
                        this.serviceData.contact = '';
                        this.serviceData.hasNameReqError = false;
                        this.serviceData.hasProfReqError = false;
                        this.serviceData.hasContactReqError = false;
                    }
                }


            },

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

            deleteService(service) {
                this.findIndex(this.allAvailableService, service);
            },

            //VALIDATION LOGIC FOR SERVICE MODAL WHILE ENTERING VALUES ON INPUT FILEDS
            validateServiceOnValueEnter(e, type) {
                console.log(e)
                var serviceForm = this.serviceData;
                var phoneRegex = /^[0-9,-]{10,15}$|^$/;
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
                            serviceForm.hasContactInvalidError = false;
                        } else {
                            if (!phoneRegex.test(e.target.value)) {
                                serviceForm.hasContactInvalidError = true;
                            } else {
                                serviceForm.hasContactInvalidError = false;
                            }
                            serviceForm.hasContactReqError = false;
                        }
                    }


                }

            },

            //Validation logic for all required fields on entering values in input fields
            validationOnValueEnter(e, type) {
                if (this.isFormSubmitted) {
                    if (type === 'info') {
                        if (e.target.value.length === 0) {
                            this.requiredFields.hasInfoReqError = true;
                        } else {
                            this.requiredFields.hasInfoReqError = false;
                        }

                    } else if (type === 'anything') {
                        if (e.target.value.length === 0) {
                            this.requiredFields.hasAnythingReqError = true;
                        } else {

                            this.requiredFields.hasAnythingReqError = false;
                        }

                    } else if (type === 'triggers') {
                        if (e.target.value.length === 0) {
                            this.requiredFields.hasTriggersReqError = true;
                        } else {

                            this.requiredFields.hasTriggersReqError = false;
                        }

                    } else if (type === 'disabilities') {
                        if (e.target.value.length === 0) {
                            this.requiredFields.hasHistoryReqError = true;
                        } else {

                            this.requiredFields.hasHistoryReqError = false;
                        }

                    }
                }
            },

            //Reset Two-Way-Model Values
            resetValues(currentForm) {
                var allForms = Array.from(document.forms);
                var formIndex = allForms.indexOf(currentForm);
                for (let i = 0; i < allForms.length; i++) {
                    var attributeValue = $(allForms[i]).data('options');
                    if (formIndex < i) {
                        this.referralData[attributeValue] = '';
                    }
                    if (formIndex <= i) {
                        this.clearDependentValues(attributeValue);
                    }
                }
                this.showAddOtherService = false;
                this.allAvailableService = [];
            },

            clearDependentValues(parentKey) {
                var foundKeyPair = this.dependent.filter(function (ele) { return ele.parentKey === parentKey })[0];
                if (foundKeyPair) {
                    this[foundKeyPair.childKey] = [];
                }
            },

            //Random UUID Generator
            uuidV4() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },

            //Find Index Utility Function for IE 11
            findIndex(arr, value) {
                var index;
                arr.some(function (e, i) {
                    if (e.id == value.id) {
                        index = i;
                        return true;
                    }
                });
                this.allAvailableService.splice(index, 1)
            },

            // Get Query Params value
            getQueryStringValue(key) {
                return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
            },


            //Section 4 Save Logic
            save() {
                this.isFormSubmitted = true;
                var formData = this.referralData;
                var reqFields = this.requiredFields;
                var roleType = this.getUrlVars()["role"];
                var userid = this.getUrlVars()["userid"];
                if (formData.referralInfo && formData.hasAnythingInfo && formData.triggerInfo && formData.disabilityOrDifficulty) {
                    this.payloadData.referralData = JSON.parse(JSON.stringify(this.referralData));
                    this.payloadData.role = roleType;
                    this.payloadData.userid = userid;
                    this.payloadData.diagnosisList = this.diagnosisList;
                    this.payloadData.problemsList = this.problemsList;
                    this.payloadData.accessList = this.accessList;
                    this.payloadData.allAvailableService = this.allAvailableService;
                    this.payloadData.editFlag = this.getUrlVars()['edt'];
                    this.payloadData.id = this.referralId;
                    if (this.userMode === 'edit') {
                        this.payloadData.userMode = 'edit';
                    } else {
                        this.payloadData.userMode = 'add';
                    }
                    this.upsertReferralForm(this.payloadData);

                } else {
                    if (!formData.referralInfo) {
                        reqFields.hasInfoReqError = true;

                    } else {
                        reqFields.hasInfoReqError = false;
                    }
                    if (!formData.hasAnythingInfo) {
                        reqFields.hasAnythingReqError = true;

                    } else {
                        reqFields.hasAnythingReqError = false;
                    }
                    if (!formData.triggerInfo) {
                        reqFields.hasTriggersReqError = true;

                    } else {
                        reqFields.hasTriggersReqError = false;
                    }
                    if (!formData.disabilityOrDifficulty) {
                        reqFields.hasHistoryReqError = true;

                    } else {
                        reqFields.hasHistoryReqError = false;
                    }
                    this.scrollToInvalidInput();
                    return false;
                }

            },

            upsertReferralForm(payload) {
                console.log(payload);
                var _self = this;
                $.ajax({
                    url: API_URI + "/saveReferral",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    success: function (data) {
                    //    alert("section 4 saved.");
                        console.log(data);
                        location.href = "/review?userid=" + data.userid + "&role=" + data.role;
                        if (_self.getUrlVars()["edt"] == null) {
                            location.href = "/review?userid=" + data.userid + "&role=" + role;
                        }
                        else {
                            history.back();
                        }
                        //  app.setValues(data);
                    },
                });
            },

            backToEducation: function () {
                var uid = this.getUrlVars()['userid'];
                var role = this.getUrlVars()['role'];
                location.href = "/education?userid=" + uid + "&role=" + role + "&edt=1";
            },

            //Scroll to top for an Invalid Inputs
            scrollToInvalidInput() {
                var errorElements = $('.invalid-fields');
                window.scroll({
                    top: this.getTopOffset(errorElements[0].parentElement.parentElement),
                    left: 0,
                    behavior: "smooth"
                });
            },

            getTopOffset(controlEl) {
                var labelOffset = 50;
                return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
            },
            getUrlVars: function () {
                var vars = {};
                var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                    function (m, key, value) {
                        vars[key] = value;
                    });


                return vars;
            },

        },
    });
});

