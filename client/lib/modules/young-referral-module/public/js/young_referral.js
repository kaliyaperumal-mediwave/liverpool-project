var API_URI = "/modules/young-referral-module";
$(document).ready(function () {
    var app = new Vue({
        el: '#young-referral-form',

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.isFormSubmitted = false;
            this.paramValues = getParameter(location.href)
            this.userId = document.getElementById('uUid').innerHTML;
            this.userRole = document.getElementById('uRole').innerHTML;
            this.userMode = this.paramValues;
            this.dynamicLabels = getDynamicLabels(this.userRole, undefined, 4);
            this.fetchSavedData();
            $('#loader').hide();
        },
        data: {
            referralData: {
                support: '',
                covid: '',
                dailyIntakes: '',
                height: '',
                weight: '',
                otherEatingDifficulties: '',
                otherReasonsReferral: '',
                referralInfo: '',
                hasAnythingInfo: '',
                triggerInfo: '',
                disabilityOrDifficulty: '',
                accessService: '',
                listService: '',
                about_our_service: ''
            },
            dependent: [
                // {
                //     parentKey: 'diagnosis',
                //     youngKey: 'diagnosisList'
                // },
                {
                    parentKey: 'covid',
                    youngKey: 'eatingDifficulties'
                },
                // {
                //     parentKey: 'supportOrSymptoms',
                //     youngKey: 'problemsList'
                // },
                {
                    parentKey: 'accessService',
                    youngKey: 'accessList'
                }
            ],
            serviceData: {
                name: null,
                profFirstName: null,
                profLastName: null,
                contact: null,
                contactMode: 'mobile'
            },
            currentSection: 'referral',
            phoneRegex: /^\+{0,1}[0-9 ]{10,16}$/,
            // phoneRegex: /(\s*\(?(0|\+44)(\s*|-)\d{4}\)?(\s*|-)\d{3}(\s*|-)\d{3}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\)?(\s*|-)\d{3}(\s*|-)\d{4}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{2}\)?(\s*|-)\d{4}(\s*|-)\d{4}\s*)|(\s*(7|8)(\d{7}|\d{3}(\-|\s{1})\d{4})\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\s\d{2}\)?(\s*|-)\d{4,5}\s*)/,
            dynamicLabels: {},
            isFormSubmitted: false,
            serviceOthers: [],
            showAddOtherService: false,
            showMoreOrLess: true,
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
            openShowMoreOrLessFlag: true,
            storeDeleteData: null,
            subDataForMakingReferral: {
                trouble_concentrating: "",
                feel_nervous: "",
                trouble_socialising: "",
                bullying: "",
                hard_to_control: "",
                sad_unhappy: {
                    ans: "",
                    last_harmed: "",
                    more_details: "",
                    think_about_self_harming: "",
                    more_about_self_harming: ""
                },
                trouble_read: "",
                drinking_drugs: "",
                clumsy_uncoordinated: "",
                issues_food_diet: "",
                problem_with_family: "",
                problem_self_identity: "",
                compulsive_behaviour: "",
                panic_attack: "",
                scared_anxious: "",
                seeing_hearing_things: "",
                traumatic_experience: "",
                hurt_myself: {
                    ans: "",
                    last_harmed: "",
                    more_details: "",
                    think_about_self_harming: "",
                    more_about_self_harming: ""
                },
                self_harming: {
                    ans: "",
                    last_harmed: "",
                    more_details: "",
                    think_about_self_harming: "",
                    more_about_self_harming: ""
                },

                pullying_hair: "",
                trouble_sleeping: "",
                feel_stressed: "",
                unwant_to_live: "",
                uncontrolled_movements: "",
                wetting_soiling_myself: "",
                low_self_esteem: "",
                lack_confidence: ""
            },
            subQuestionOfReason: [],
            listOfEatingDifficulties: [
                { id: '4937fd43-79ae-4974-90d9-601966a9d3fb', value: 'Restricting food intake' },
                { id: 'bd8efbb4-6491-4520-aea7-8ab35f38a261', value: 'Restricting fluid intake' },
                { id: '6d31681e-a9b9-4cbe-a7e1-26bcbd17d9c3', value: 'Fear of being fat' },
                { id: '14568ba7-78b0-4bca-aed3-560bdba83060', value: 'Increased preoccupation with weight and shape' },
                { id: '73257df0-9c00-4125-8238-fe096bac4253', value: 'Excessive exercising' },
                { id: '4714dbea-340d-42c5-a183-d54e9522aadb', value: 'Binging/ Purging' },
                { id: '48443ca2-47a0-4a8f-be63-59324c509558', value: 'Recent excessive loss of weight' },
                { id: 'fb8c41e3-922e-4332-867a-d67e2bb292fc', value: 'Blackouts' },
                { id: '4ca2d04b-b507-4ef9-ba82-323f4ff665ac', value: 'Dizziness' },
                { id: 'c652572a-2610-434c-9e2a-96cdfefe292d', value: 'Feeling weak and cold' },
                { id: '68066f83-1aca-45f4-97ee-84da1485d02b', value: 'Low mood' },
                { id: '3b568128-10a1-4e5a-a2e5-9fa4a0163de5', value: 'Anxiety' },
                { id: '33cd1600-037f-45d6-a226-1d093d821cb5', value: 'Obsessive behaviour or thoughts' },
                { id: 'ad07ea21-e0c4-488b-b6b0-2e39046fbb92', value: 'Loss of periods' },
            ],
            reasonForReferralList: [
                { id: '4bc26bf2-d79b-4b83-912f-e83300efb10e', value: 'Trouble concentrating', modelKey: 'trouble_concentrating', hasMultiLevel: false },
                { id: 'ac1d34e8-5443-4286-8be2-c964430356c0', value: 'Feeling nervous or on edge', modelKey: 'feel_nervous', hasMultiLevel: false },
                { id: 'e22e6ab1-9b56-490d-8afd-6fcce1969989', value: 'Trouble socialising', modelKey: 'trouble_socialising', hasMultiLevel: false },
                { id: '01386494-4f30-4bc5-907d-1d77b5b59540', value: 'Bullying', modelKey: 'bullying', hasMultiLevel: false },
                { id: '864dc606-6954-4855-ad30-a923c1214b01', value: 'Find it hard to control myself', modelKey: 'hard_to_control', hasMultiLevel: false },
                { id: 'e2e9e23c-7802-4e5b-959e-438a612516ec', value: 'Feeling sad, unhappy or hopeless', modelKey: 'sad_unhappy', hasMultiLevel: true, },
                { id: 'e647a2a8-3240-46cb-8c89-6376e73db296', value: 'Trouble reading and writing', modelKey: 'trouble_read', hasMultiLevel: false },
                { id: '22b1ac46-71c2-460f-93e3-f672ca73116c', value: 'Drinking and drugs', modelKey: 'drinking_drugs', hasMultiLevel: false },
                { id: 'ac03479d-ac0f-4977-a431-d8a350b4d254', value: 'Feeling clumsy and uncoordinated', modelKey: 'clumsy_uncoordinated', hasMultiLevel: false },
                { id: '2a51c85a-8bc6-4107-bc5a-e76d68fb6be6', value: 'Issues with food, diet or eating', modelKey: 'issues_food_diet', hasMultiLevel: false },
                { id: '64740f8f-70c1-4cc6-9222-3f56880a426b', value: 'Problems with family', modelKey: 'problem_with_family', hasMultiLevel: false },
                { id: 'ea72e4b5-f325-41c6-9958-116aa8780a4d', value: 'Problems with self identity', modelKey: 'problem_self_identity', hasMultiLevel: false },
                { id: 'cb57d9e4-43a4-469f-9bb7-5949e7b686da', value: 'Compulsive behaviour', modelKey: 'compulsive_behaviour', hasMultiLevel: false },
                { id: 'bb60f501-a346-44fd-860c-3a815ce4ca73', value: 'Panic attacks', modelKey: 'panic_attack', hasMultiLevel: false },
                { id: '6b4eb776-4287-4296-ab2c-7599939e1c5b', value: 'Feeling scared or anxious', modelKey: 'scared_anxious', hasMultiLevel: false },
                { id: '7a95930e-db58-4bbd-99c8-842dd965c1be', value: 'Seeing or hearing things', modelKey: 'seeing_hearing_things', hasMultiLevel: false },
                { id: '12837896-732c-4a98-be65-f8213728ab73', value: 'Had a traumatic experience', modelKey: 'traumatic_experience', hasMultiLevel: false },
                { id: '21eaed08-af51-4115-b6c0-e376eedd9a92', value: 'Feeling that I want to hurt myself', modelKey: 'hurt_myself', hasMultiLevel: true },
                { id: '42496c57-6c92-45f1-97d9-ed763843b53b', value: 'Self-harming', modelKey: 'self_harming', hasMultiLevel: true },
                { id: 'f3834f7c-b227-4069-af8a-ee6703bbf393', value: 'Pulling hair out', modelKey: 'pullying_hair', hasMultiLevel: false },
                { id: 'f053d058-678f-4182-aaf7-0b95fedbf1db', value: 'Trouble sleeping', modelKey: 'trouble_sleeping', hasMultiLevel: false },
                { id: '9c4fa623-f374-49d6-b774-dfda8a1a9f33', value: 'Feeling stressed', modelKey: 'feel_stressed', hasMultiLevel: false },
                { id: '5bea946d-5632-40ef-8d15-523aeb5b747e', value: 'Feeling that I don’t want to live', modelKey: 'unwant_to_live', hasMultiLevel: false },
                { id: 'a1373df9-a335-46f5-a530-53b157b64d58', value: 'Uncontrolled movements', modelKey: 'uncontrolled_movements', hasMultiLevel: false },
                { id: 'ba1df932-b6af-4971-b61f-a57895506548', value: 'Wetting or soiling myself', modelKey: 'wetting_soiling_myself', hasMultiLevel: false },
                { id: '97caac9e-057f-4df2-8a94-a972e6cae5b3', value: 'Low self esteem', modelKey: 'low_self_esteem', hasMultiLevel: false },
                { id: '8676c899-f721-4ebe-9276-7294a64adabd', value: 'Lacking confidence in myself', modelKey: 'lack_confidence', hasMultiLevel: false },

            ],
            reasonForReferralCopyList: [
                { id: 'cc33ecc3-f082-4f88-9a0f-e9128d7253cf', value: 'Trouble concentrating' },
                { id: 'fe9ae124-521a-48a0-bd5d-135590a533ea', value: 'Feeling nervous or on edge', },
                { id: '61cfb384-859e-4577-918b-4d4a82d17bbd', value: 'Trouble socialising' },
                { id: 'deaa6970-5eee-49c6-9aa0-79b875b6f8cc', value: 'Bullying' },
                { id: '8ac8f99a-c19a-45c0-af4c-e8dcd9a0c1c1', value: 'Find it hard to control myself' },
                { id: '723986a5-72f2-4b6b-81af-a5048b670c34', value: 'Feeling sad, unhappy or hopeless' },
                { id: '2c16a95a-22b7-48dd-b5b2-6f6ab96f6353', value: 'Trouble reading and writing' },
                { id: '12cd71b2-416b-4712-8c9f-383b63709455', value: 'Drinking and drugs' },
                { id: '271a505c-cf25-4d9e-b8a7-c0163fca0e77', value: 'Feeling clumsy and uncoordinated' },
                { id: 'e3879609-e6cf-4d96-9aef-63722902e250', value: 'Issues with food, diet or eating' },
                { id: '127c4331-ac2b-4f57-a16e-20cadd8e515a', value: 'Problems with family' },
                { id: '89588dea-0a75-4df3-92c4-37b7a38812f2', value: 'Problems with self identity' },
                { id: '2690556e-b164-4183-aace-39b0deb290b3', value: 'Compulsive behaviour' },
                { id: 'df4ddfce-cbb6-4809-801a-f28ae74524bd', value: 'Panic attacks' },
                { id: 'da157fc2-0538-4e7a-a1fb-4b7c643cfaaa', value: 'Feeling scared or anxious' },
                { id: 'a67ed3d0-ee18-4b9f-bb2d-06d979fe22d1', value: 'Seeing or hearing things' },
                { id: '9166f3e1-c522-4ddb-abd8-321365627b23', value: 'Had a traumatic experience' },
                { id: '275ec9ca-8b29-404a-86d8-31faf9178516', value: 'Feeling that I want to hurt myself' },
                { id: '3b2edbcf-3736-4db8-8585-424c38878ef5', value: 'Self-harming' },
                { id: 'ccaa1f4e-eee1-47f2-99eb-83a163e5fb2b', value: 'Pulling hair out' },
                { id: 'a1e9cbf0-a438-4257-abc9-03c46bcb049d', value: 'Trouble sleeping' },
                { id: '243942fb-ad41-46d8-9271-45187e38bb7a', value: 'Feeling stressed' },
                { id: '07a87460-f4f3-44e6-99e6-d4c2773cff11', value: 'Feeling that I don’t want to live' },
                { id: 'a13f73d4-2033-49da-96fb-2ff6fc170f5c', value: 'Uncontrolled movements' },
                { id: '16a98d68-8d81-4830-b2d9-656e8fe08e3f', value: 'Wetting or soiling myself' },
                { id: '1b13cb77-7403-4b6f-bf40-4549af79deea', value: 'Low self esteem' },
                { id: 'f8a1ca04-c60e-407e-ad6a-afbcc746e6a1', value: 'Lacking confidence in myself' },

            ],
            listOfAvailableService: [
                { id: '3346efa5-661f-4112-9caf-1fa12c98504e', value: 'Advanced Solutions' },
                { id: '45d6204e-c1e1-46c1-8168-60ea04c70390', value: 'ADHD Foundation' },
                { id: 'f44a383f-1952-4db4-b2e2-11b6cf11ba9a', value: 'Alder Hey CAHMS' },
                { id: 'bda7d546-1452-4ae7-9e01-1e96c8a7991d', value: 'Barnado’s Young Carers' },
                { id: 'd7f13aaa-64c7-4225-9dec-c669dd4a2d4e', value: 'Bully Busters' },
                { id: 'bf1b464e-dcc5-48e0-811b-53855a5435c7', value: 'EDYS' },
                { id: '9b39fa57-98da-41fa-93a7-4c2c4b191c89', value: 'Kooth' },
                { id: '652b84d6-3ff4-42ca-8e35-deaf80e2115e', value: 'Merseycare 16-25' },
                { id: '3d6c3a7e-1948-4eb9-86c8-8177dd132bc0', value: 'Merseyside Youth Association' },
                { id: '016b2e91-6872-4a5d-a49e-5e3a75cc7521', value: 'Spinning World' },
                { id: 'e293c060-2cc4-4288-a941-b6bb56ac8ad4', value: 'Venus' },
                { id: 'e116e2a3-4623-4c01-af34-bbe9ccb8a829', value: 'YPAS' },
                { id: 'fefa3e54-a2ad-43a7-88cc-3fe4abe06533', value: 'Other' },
            ],
            paramValues: [],
            updateFlag: false,
            landlineRegex: /^0[0-9]{10}$/,
            dynamicRegexPattern: /^\+{0,1}[0-9 ]{10,16}$/,

            //character limit helper text
            showlimitTxt1: false,
            showlimitTxt2: false,
            showlimitTxt3: false,
            showlimitTxt4: false,
            showlimitTxt5: false,
            showlimitTxt6: false,
            showlimitTxt7: false,
            showlimitTxt8: false,
            charLimitScenerio1: "",
            charLimitScenerio2: ""
        },
        methods: {


            //validations check logic
            checkValidation: function () {

                var _self = this;
                var flag = [];
                if (this.subQuestionOfReason) {
                    this.subQuestionOfReason.map(function (i) {
                        if (typeof (_self.subDataForMakingReferral[i.modelKey]) == "string" && _self.subDataForMakingReferral[i.modelKey]) {
                            flag.push(true);
                        } else if (typeof (_self.subDataForMakingReferral[i.modelKey]) == "object" && _self.subDataForMakingReferral[i.modelKey]) {
                            if (_self.subDataForMakingReferral[i.modelKey]["ans"] && (_self.subDataForMakingReferral[i.modelKey]["ans"] == "yes" && _self.subDataForMakingReferral[i.modelKey]["last_harmed"] && _self.subDataForMakingReferral[i.modelKey]["think_about_self_harming"] && _self.subDataForMakingReferral[i.modelKey]["more_about_self_harming"]) ||
                                (_self.subDataForMakingReferral[i.modelKey]["ans"] == "no" && _self.subDataForMakingReferral[i.modelKey]["think_about_self_harming"] && _self.subDataForMakingReferral[i.modelKey]["more_about_self_harming"])) {
                                flag.push(true);

                            } else {
                                flag.push(false);
                            }

                        }
                        else {
                            flag.push(false);
                        }
                    });
                    var condition = flag.every(function (i) {
                        return i;
                    })
                    return condition;
                }

            },

            //Options changing logic
            onOptionChange: function (event, data) {

                if (data) {

                    if (event.target.checked) {
                        this.subQuestionOfReason.push(data)
                    } else {
                        this.subQuestionOfReason = this.subQuestionOfReason.filter(function (i) {
                            return i.id != data.id;
                        });
                    }

                    if (typeof (this.subDataForMakingReferral[data.modelKey]) == "string") {
                        this.subDataForMakingReferral[data.modelKey] = "";
                    } else if ((typeof (this.subDataForMakingReferral[data.modelKey]) == "object")) {
                        this.subDataForMakingReferral[data.modelKey]["ans"] = "";
                        this.subDataForMakingReferral[data.modelKey]["last_harmed"] = "";
                        this.subDataForMakingReferral[data.modelKey]["more_details"] = "";
                        this.subDataForMakingReferral[data.modelKey]["think_about_self_harming"] = "";
                        this.subDataForMakingReferral[data.modelKey]["more_about_self_harming"] = "";

                    }



                }

                var questionIdentifier = event.target.name;
                var optionsName = this.referralData;

                if (questionIdentifier == 'support' || questionIdentifier == 'covidReferal') {
                    var allCheckbox = Array.from(document.getElementsByClassName('checkLogic'));
                    allCheckbox.map(function (input) {
                        $(input).removeAttr("data-selected")
                        var mainElem = input.parentElement.parentElement.parentElement;
                        $(mainElem).removeClass('d-none').addClass('d-flex').css('pointer-events', '').removeAttr("data-selected");
                        $('#showMoreOrLessText').removeClass('d-block').addClass('d-none').text('');
                    });
                    resetValues(event.target.form, this, 'referralData');
                    this.subQuestionOfReason = [];
                    this.reasonForReferral = [];
                    this.resetDependentQuestionValues();
                }
                else if (questionIdentifier == 'accessedService') {
                    resetValues(event.target.form, this, 'referralData');
                }
                else if (questionIdentifier === 'eatingDisorder') {
                    if (!this.eatingDifficulties.length) {
                        if (optionsName.otherEatingDifficulties === '') {
                            resetValues(event.target.form, this, 'referralData');
                            this.reasonForReferral = [];
                            this.resetDependentQuestionValues();
                        }
                        // resetValues(event.target.form, this, 'referralData');
                        // this.reasonForReferral = [];
                    }
                }
                else if (questionIdentifier === 'listReasonsForReferral') {
                    if (event.target.checked) {
                        event.currentTarget.setAttribute('data-selected', 'selected')
                    } else {
                        event.currentTarget.setAttribute('data-selected', 'unselected')
                    }

                    if (!this.reasonForReferral.length) {
                        $('#showMoreOrLessText').removeClass('d-block').addClass('d-none').text('');
                        if (optionsName.otherReasonsReferral === '') {
                            resetValues(event.target.form, this, 'referralData');
                            this.reasonForReferral = [];
                        }
                        $('#8791f0c9-468a-44ea-92b4-57b96d260392').removeClass('d-block').addClass('d-none');
                    } else {
                        $('#8791f0c9-468a-44ea-92b4-57b96d260392').removeClass('d-none').addClass('d-block');
                        //this.setDynamicReadyOnlyState();
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
            onValueEnter: function (event, condition) {
                if (event.target.value && !event.target.value.replace(/ /g, "").length) {
                    if (condition == "intake") {
                        this.referralData.dailyIntakes = event.target.value.trim();
                    } else if (condition == "other") {
                        this.referralData.otherReasonsReferral = event.target.value.trim();
                    }
                    else if (condition == "otherEating") {
                        this.referralData.otherEatingDifficulties = event.target.value.trim();
                    }
                    return false;
                }
                var questionIdentifier = event.target.name;
                if (questionIdentifier === 'listReasonsForReferral') {
                    if (!event.target.value) {
                        if (!this.reasonForReferral.length) {
                            resetValues(event.target.form, this, 'referralData');
                        }
                    }
                } else if (questionIdentifier === 'eatingDisorder') {
                    if (!event.target.value) {
                        if (!this.eatingDifficulties.length) {
                            resetValues(event.target.form, this, 'referralData');
                        }
                    }
                }
                else if (questionIdentifier === 'briefOutlineInfo') {
                    if (!event.target.value) {
                        resetValues(event.target.form, this, 'referralData');
                        this.reasonForReferral = [];
                    }
                }
            },

            //reset dependent questions
            resetDependentQuestion: function (subData) {


                // this.subDataForMakingReferral[subData.modelKey]["ans"] = "";
                this.subDataForMakingReferral[subData.modelKey]["last_harmed"] = "";
                this.subDataForMakingReferral[subData.modelKey]["more_details"] = "";
                this.subDataForMakingReferral[subData.modelKey]["think_about_self_harming"] = "";
                this.subDataForMakingReferral[subData.modelKey]["more_about_self_harming"] = "";
            },

            //Edit Api call
            fetchSavedData: function () {
                var payload = {};
                payload.userid = this.userId;
                payload.role = this.userRole;
                var successData = apiCallPost('post', '/fetchYoungReferral', payload);
                if (successData && Object.keys(successData)) {

                    this.patchValue(successData);
                    $('#loader').hide();
                } else {
                    //console.error('error');
                    $('#loader').hide();

                }
            },

            resetDependentQuestionValues: function () {
                this.subQuestionOfReason = [];
                this.subDataForMakingReferral = {
                    trouble_concentrating: "",
                    feel_nervous: "",
                    trouble_socialising: "",
                    bullying: "",
                    hard_to_control: "",
                    sad_unhappy: {
                        ans: "",
                        last_harmed: "",
                        more_details: "",
                        think_about_self_harming: "",
                        more_about_self_harming: ""
                    },
                    trouble_read: "",
                    drinking_drugs: "",
                    clumsy_uncoordinated: "",
                    issues_food_diet: "",
                    problem_with_family: "",
                    problem_self_identity: "",
                    compulsive_behaviour: "",
                    panic_attack: "",
                    scared_anxious: "",
                    seeing_hearing_things: "",
                    traumatic_experience: "",
                    hurt_myself: {
                        ans: "",
                        last_harmed: "",
                        more_details: "",
                        think_about_self_harming: "",
                        more_about_self_harming: ""
                    },
                    self_harming: {
                        ans: "",
                        last_harmed: "",
                        more_details: "",
                        think_about_self_harming: "",
                        more_about_self_harming: ""
                    },

                    pullying_hair: "",
                    trouble_sleeping: "",
                    feel_stressed: "",
                    unwant_to_live: "",
                    uncontrolled_movements: "",
                    wetting_soiling_myself: "",
                    low_self_esteem: "",
                    lack_confidence: ""
                }
            },


            //Form Submission of Section-4(Referral) with validation logic
            saveAndContinue: function () {
                this.isFormSubmitted = true;
                var formData = this.referralData;
                this.charLimitScenerio1 = this.referralData.otherReasonsReferral ? (this.reasonForReferral.toString() + ' ' + this.referralData.otherReasonsReferral) : "";
                this.charLimitScenerio2 = this.referralData.otherEatingDifficulties ? (this.eatingDifficulties.toString() + ' ' + this.referralData.otherEatingDifficulties) : "";
                if (formData.referralInfo && this.checkValidation()) {
                    this.payloadData.referralData = JSON.parse(JSON.stringify(this.referralData));
                    this.payloadData.role = this.userRole;
                    this.payloadData.userid = this.userId;
                    this.payloadData.reasonForReferral = this.reasonForReferral;
                    this.payloadData.eatingDifficulties = this.eatingDifficulties;
                    this.payloadData.accessList = this.accessList;
                    this.payloadData.allAvailableService = this.allAvailableService;
                    if (this.updateFlag != false) {
                        this.payloadData.editFlag = this.updateFlag;
                    }
                    this.payloadData.id = this.referralId;
                    if (this.userMode === 'edit') {
                        this.payloadData.userMode = 'edit';
                    } else {
                        this.payloadData.userMode = 'add';
                    }
                    if (this.charLimitScenerio1.length > 950) {
                        delayedScrollToInvalidInput();
                        return false;
                    } else if (this.charLimitScenerio2.length > 950) {
                        delayedScrollToInvalidInput();
                        return false;
                    }
                    if (this.showAddOtherService && (this.allAvailableService && !this.allAvailableService.length)) {
                        scrollToInvalidInput();
                        return false;
                    }
                    $('#loader').show();
                    this.upsertReferralForm(this.payloadData);

                } else {
                    scrollToInvalidInput();
                    return false;
                }

            },

            //Function to trim space entered
            trimWhiteSpaceOfNestedObj: function (event, mainObj, nestObj, key) {

                preventWhiteSpacesOfNestedObj(event, this, mainObj, nestObj, key)

            },

            //Function to trim space entered
            trimWhiteSpace: function (event, obj, key, hasShowLess) {
                preventWhiteSpaces(event, this, obj, key);
                // if (hasShowLess) {
                //     var allCheckbox = Array.from(document.getElementsByClassName('checkLogic'));
                //     var checkBoxCon = document.getElementsByClassName('checkboxWrapper');
                //     if (event.target.value) {
                //         if (this.reasonForReferral.length) {
                //             allCheckbox.map(function (input) {
                //                 if (input.getAttribute('data-selected') && input.getAttribute('data-selected') == 'selected') {
                //                     var mainElem = input.parentElement.parentElement.parentElement;
                //                     $(mainElem).removeClass('d-block').addClass('d-flex').css('pointer-events', 'none');
                //                     $('#showMoreOrLessText').removeClass('d-none').addClass('d-block').html('<u>Click here to view full list & change the answer</u>');
                //                     checkBoxCon[0].scrollIntoView();

                //                 } else {
                //                     var mainElem = input.parentElement.parentElement.parentElement;
                //                     $(mainElem).removeClass('d-flex').addClass('d-none').css('pointer-events', 'none').removeAttr("data-selected");
                //                     $('#showMoreOrLessText').removeClass('d-none').addClass('d-block').html('<u>Click here to view full list & change the answer</u>');
                //                 }
                //             });
                //             checkBoxCon[0].scrollIntoView();

                //         } else {
                //             allCheckbox.map(function (input) {
                //                 $(input).removeAttr("data-selected");
                //                 var mainElem = input.parentElement.parentElement.parentElement;
                //                 $(mainElem).removeClass('d-block').addClass('d-flex').css('pointer-events', '').removeAttr("data-selected");
                //                 $('#showMoreOrLessText').removeClass('d-block').addClass('d-none').text('');
                //                 checkBoxCon[0].scrollIntoView();
                //             });
                //         }
                //     } else {
                //         allCheckbox.map(function (input) {
                //             var mainElem = input.parentElement.parentElement.parentElement;
                //             $(mainElem).removeClass('d-block').addClass('d-flex').css('pointer-events', '');
                //             $('#showMoreOrLessText').removeClass('d-block').addClass('d-none').text('');
                //         });
                //     }

                // }
            },

            showMoreOrLessList: function (event) {
                var allCheckbox = Array.from(document.getElementsByClassName('checkLogic'));
                var targetElem = event.target;
                if (Array.from(targetElem.classList).indexOf('fa-chevron-circle-down') > -1) {
                    $(targetElem).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                    if (this.reasonForReferral.length) {
                        allCheckbox.map(function (input) {
                            if (input.getAttribute('data-selected') && input.getAttribute('data-selected') == 'selected') {
                                var mainElem = input.parentElement.parentElement.parentElement;
                                var seondElem = input.parentElement.parentElement;
                                $(mainElem).removeClass('d-block');
                                $(seondElem).css('pointer-events', 'none');
                                $('#showMoreOrLessText').removeClass('d-none').addClass('d-block').html('<u>Click here to view full list & change the answer</u>');

                            } else {
                                var mainElem = input.parentElement.parentElement.parentElement;
                                var seondElem = input.parentElement.parentElement;
                                $(mainElem).removeClass('d-block').addClass('d-none').removeAttr("data-selected");
                                $(seondElem).css('pointer-events', 'none');
                                $('#showMoreOrLessText').removeClass('d-none').addClass('d-block').html('<u>Click here to view full list & change the answer</u>');
                            }
                        });
                    } else {
                        allCheckbox.map(function (input) {
                            $(input).removeAttr("data-selected");
                            var mainElem = input.parentElement.parentElement.parentElement;
                            var seondElem = input.parentElement.parentElement;
                            $(mainElem).removeClass('d-block').css('pointer-events', '').removeAttr("data-selected");
                            $(seondElem).css('pointer-events', '');
                            $('#showMoreOrLessText').removeClass('d-block').addClass('d-none').text('');
                        });
                    }
                } else if (Array.from(targetElem.classList).indexOf('fa-chevron-circle-up') > -1) {
                    $(targetElem).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                    allCheckbox.map(function (input) {
                        var mainElem = input.parentElement.parentElement.parentElement;
                        var seondElem = input.parentElement.parentElement;
                        $(mainElem).removeClass('d-none').addClass('d-block').css('pointer-events', '');
                        $(seondElem).css('pointer-events', '');
                    });
                    $('#showMoreOrLessText').removeClass('d-none').addClass('d-block').html('<u>Show less list</u>');
                }

            },

            toggleList: function (event) {
                var arrowElem = $('#toggleIconSect2');
                var allCheckbox = Array.from(document.getElementsByClassName('checkLogic'));
                if (event.target.textContent === 'Click here to view full list & change the answer') {
                    allCheckbox.map(function (input) {
                        var mainElem = input.parentElement.parentElement.parentElement;
                        var seondElem = input.parentElement.parentElement;
                        $(mainElem).removeClass('d-none').css('pointer-events', '');
                        $(seondElem).css('pointer-events', '');
                    });
                    $(arrowElem).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                    $('#showMoreOrLessText').removeClass('d-none').addClass('d-block').html('<u>Show less list</u>');
                } else if (event.target.textContent === 'Show less list') {
                    allCheckbox.map(function (input) {
                        if (input.getAttribute('data-selected') && input.getAttribute('data-selected') == 'selected') {
                            var mainElem = input.parentElement.parentElement.parentElement;
                            var seondElem = input.parentElement.parentElement;
                            $(mainElem).removeClass('d-none');
                            $(seondElem).css('pointer-events', 'none');

                        } else {
                            var mainElem = input.parentElement.parentElement.parentElement;
                            var seondElem = input.parentElement.parentElement;
                            $(mainElem).removeClass('d-block').addClass('d-none');
                            $(seondElem).css('pointer-events', 'none');
                        }
                    });
                    $(arrowElem).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                    $('#showMoreOrLessText').html('<u>Click here to view full list & change the answer</u>');
                }

            },

            //Section 4(Referral) Save and Service call with navigation Logic
            upsertReferralForm: function (payload) {
                payload.referralData.subDataForMakingReferral = [{ options: "test young", description: "test professional" }, { options: "sample", description: "sample1" }]
                payload.referralData.referral_reason_details = this.subDataForMakingReferral
                payload.referralData.referral_reason_questions = this.subQuestionOfReason
                var responseData = apiCallPost('post', '/saveYoungReferral', payload);
                if (responseData && Object.keys(responseData)) {
                    $('#loader').hide();
                    location.href = redirectUrl(location.href, "/young-referral/review", this.userId, this.userRole);
                    if (this.paramValues != undefined) {
                        if (this.paramValues[0] == "sec5back") {
                            location.href = "/young-referral/review";
                        }
                        else {
                            var url = location.href;
                            location.href = "/young-referral/review?" + url.substring(url.indexOf("?") + 1);
                        }
                    }
                    else {
                        location.href = "/young-referral/review";
                    }
                    this.storeDeleteData = null;
                } else {
                    $('#loader').hide();
                    //console.log('empty response')
                }
            },

            //Patching the value logic
            patchValue: function (data) {
                var _self = this;
                if (data.status != "fail") {
                    this.eatingDifficulties = data.eating_disorder_difficulties;
                    this.reasonForReferral = data.reason_for_referral;
                    this.accessList = data.local_services;
                    // this.subDataForMakingReferral= data.referral_reason_details 
                    // this.subQuestionOfReason= data.referral_reason_questions 
                    this.referralId = data.id;
                    this.updateFlag = true;
                    if (this.accessList.indexOf("Other") > -1) {
                        this.showAddOtherService = true;
                    } else {
                        this.showAddOtherService = false;
                    }
                    this.allAvailableService = data.services;
                    Vue.set(this.referralData, "support", data.referral_type);
                    Vue.set(this.referralData, "covid", data.is_covid);

                    Vue.set(this.referralData, "otherEatingDifficulties", data.other_eating_difficulties);
                    Vue.set(this.referralData, "dailyIntakes", data.food_fluid_intake);
                    Vue.set(this.referralData, "height", data.height);
                    Vue.set(this.referralData, "weight", data.weight);
                    Vue.set(this.referralData, "otherReasonsReferral", data.other_reasons_referral);
                    Vue.set(this.referralData, "referralInfo", data.referral_issues);
                    Vue.set(this.referralData, "hasAnythingInfo", data.has_anything_helped);
                    Vue.set(this.referralData, "triggerInfo", data.any_particular_trigger);
                    Vue.set(this.referralData, "disabilityOrDifficulty", data.disabilities);
                    Vue.set(this.referralData, "accessService", data.any_other_services);
                    Vue.set(this.referralData, "about_our_service", data.about_our_service);

                    Vue.set(this, "subQuestionOfReason", data.referral_reason_questions ? data.referral_reason_questions : this.subQuestionOfReason);
                    Vue.set(this, "subDataForMakingReferral", data.referral_reason_details ? data.referral_reason_details : this.subDataForMakingReferral);
                }
                setTimeout(function () {
                    if (_self.reasonForReferral.length)
                        _self.patchCheck();
                }, 200)

            },

            patchCheck: function () {
                var _self = this;
                $('#8791f0c9-468a-44ea-92b4-57b96d260392').removeClass('d-none').addClass('d-block');
                var arrowElem = $('#toggleIconSect2');
                $(arrowElem).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                var allCheckbox = Array.from(document.getElementsByClassName('checkLogic'));
                allCheckbox.map(function (input) {
                    if (_self.reasonForReferral.indexOf(input.value) != -1) {
                        input.setAttribute('data-selected', 'selected')
                        var mainElem = input.parentElement.parentElement.parentElement;
                        var seondElem = input.parentElement.parentElement;
                        $(mainElem).removeClass('d-none')
                        $(seondElem).css('pointer-events', 'none');
                        $('#showMoreOrLessText').removeClass('d-none').addClass('d-block').html('<u>Click here to view full list & change the answer</u>');

                    } else {
                        input.setAttribute('data-selected', 'unselected')
                        var mainElem = input.parentElement.parentElement.parentElement;
                        var seondElem = input.parentElement.parentElement;
                        $(mainElem).removeClass('d-block').addClass('d-none').removeAttr("data-selected");
                        $(seondElem).css('pointer-events', 'none');
                        $('#showMoreOrLessText').removeClass('d-none').addClass('d-block').html('<u>Click here to view full list & change the answer</u>');
                    }
                });
            },


            //Adding and Updating  a service logic
            upsertService: function () {
                this.hasSubmittedServiceForm = true;
                var serviceForm = this.serviceData;
                var modal = document.getElementById('closeModal');
                if (serviceForm.contactMode == "mobile") {
                    this.dynamicRegexPattern = this.phoneRegex
                } else if (serviceForm.contactMode == "landline") {
                    this.dynamicRegexPattern = this.landlineRegex;
                }
                if (serviceForm.name) {
                    if (serviceForm.contact && !this.dynamicRegexPattern.test(serviceForm.contact)) {
                        modal.removeAttribute("data-dismiss", "modal");
                        return;
                    } else {
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
                    }
                } else {
                    modal.removeAttribute("data-dismiss", "modal");
                    return;
                }

            },

            //Patching the service logic
            patchService: function (service) {
                var serviceForm = this.serviceData;
                serviceForm.name = service.name;
                serviceForm.profFirstName = service.profFirstName;
                serviceForm.profLastName = service.profLastName;
                serviceForm.contact = service.contact;
                serviceForm.id = service.id;
                serviceForm.contactMode = service.contactMode;
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
                this.serviceData.profFirstName = '';
                this.serviceData.profLastName = '';
                this.serviceData.contact = '';
                //this.serviceData.contactMode = '';
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
                    this[foundKeyPair.youngKey] = [];
                }
            },

            //Back to previous page
            backToEducation: function () {
                backToPreviousPage('/education?', this.userId, this.userRole)
                // backToPreviousPage('/education')
            },

            checkCharacterLength: function (ev, helperFlag) {
                var curElem = ev.currentTarget;
                var curVal = ev.target.value;
                var curLen = curVal.length;
                var maxlength = curElem.getAttribute("maxlength");
                if (maxlength && Number(curLen) >= Number(maxlength)) {
                    this[helperFlag] = true;
                } else {
                    this[helperFlag] = false;
                }
                this.charLimitScenerio1 = this.referralData.otherReasonsReferral ? (this.reasonForReferral.toString() + ' ' + this.referralData.otherReasonsReferral) : "";
                this.charLimitScenerio2 = this.referralData.otherEatingDifficulties ? (this.eatingDifficulties.toString() + ' ' + this.referralData.otherEatingDifficulties) : "";
            },


            checkCharacterLengthForReasonRef: function (ev) {
                var curElem = ev.currentTarget;
                var helperTxtElem = curElem.nextElementSibling
                var curVal = ev.target.value;
                var curLen = curVal.length;
                var maxlength = curElem.getAttribute("maxlength");
                if (maxlength && Number(curLen) >= Number(maxlength)) {
                    $(helperTxtElem).addClass("d-block").removeClass("d-none");
                } else {
                    $(helperTxtElem).addClass("d-none").removeClass("d-block");
                }
            },

        },
    });
});
