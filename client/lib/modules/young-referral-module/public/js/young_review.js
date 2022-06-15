var API_URI = "/modules/young-referral-module";

// window.history.forward();
// function noBack() {
//     window.history.forward();
// }

$(document).ready(function () {
    var app = new Vue({
        el: '#young-review-form',
        data: {
            isToggled: true,
            userId: '',
            userMode: '',
            userRole: '',
            yourInfo: '',
            allSectionData: [],
            section5Labels: {
                aboutLabel: "",
                referralLabel: ""
            },
            refFeedbackData: {
                comments: '',
                ratings: '',
            },
            feedbackMessage: '',
            isFeedBackFormSubmitted: false,
            contact_person: '',
            legalStatusArray: [
                'Care of Parent',
                'Care of Local Authority(Liverpool)',
                'Care of Local Authority(Sefton)',
                'Care of Local Authority(Other)',
                'Section 20 Voluntary',
                'Accommodated',
                'Full Care Order',
                'Interim Care Order',
                'Care Order places at home',
                'child Protection Plan',
                'Other Carer'
            ],
            contact_person: '',
            allSectionData: [],
            section1Data: {},
            section2Data: {},
            section3Data: {},
            section4Data: {},
            prevSection1Data: {},
            prevSection2Data: {},
            prevSection3Data: {},
            prevSection4Data: {},
            payloadData: {
                needCopy: ""
            },
            contactPref: [],
            showManualAddress: "",
            showchildManualAddressSection2: "",
            showParentManualAddressSection2: "",
            showManualAddressForRole: "",
            selectProvider: 'No',
            sendRef: '',
            phoneRegex: /^\+{0,1}[0-9 ]{10,16}$/,
            landlineRegex: /^0[0-9]{10}$/,
            //phoneRegex: /(\s*\(?(0|\+44)(\s*|-)\d{4}\)?(\s*|-)\d{3}(\s*|-)\d{3}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\)?(\s*|-)\d{3}(\s*|-)\d{4}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{2}\)?(\s*|-)\d{4}(\s*|-)\d{4}\s*)|(\s*(7|8)(\d{7}|\d{3}(\-|\s{1})\d{4})\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\s\d{2}\)?(\s*|-)\d{4,5}\s*)/,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            nhsRegex: /^[0-9]{10}$/,
            isFormSubmitted: false,
            isSection1Submitted: false,
            isSection2Submitted: false,
            isSection3Submitted: false,
            isSection4Submitted: false,
            showSec1: false,
            showLoader: false,
            nameForOthers: "",
            addMoreOrg: false,
            ageFlag: null,

            //character limit helper text
            showlimitTxt1: false,
            showlimitTxt2: false,
            showlimitTxt3: false,
            showlimitTxt4: false,
            showlimitTxt5: false,
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            //  this.section5Labels = section5Labels;
            this.userRole = document.getElementById('uRole').innerHTML;
            if (this.userRole === 'young') {
                this.yourInfo = 'Young person';
                this.section5Labels.aboutLabel = "About you";
                this.section5Labels.referralLabel = "Your reason for referral";

            } else if (this.userRole === 'family') {
                this.yourInfo = 'Family/Friend';
                this.section5Labels.aboutLabel = "About your young person";
                this.section5Labels.referralLabel = "Your young person's reason for referral";

            } else if (this.userRole === 'professional') {
                this.yourInfo = 'Professional';
                this.section5Labels.aboutLabel = "About the young person";
                this.section5Labels.referralLabel = "The young person's reason for referral";

            }
            this.userId = document.getElementById('uUid').innerHTML;
            this.payloadData.userid = this.userId;
            this.payloadData.role = this.userRole;
            this.getAllSectionData(this.payloadData);

        },
        methods: {

            //Get Request to get all section's data
            getAllSectionData: function (payloadData) {
                var _self = this;
                $.ajax({
                    url: API_URI + "/fetchyoungReview/" + payloadData.userid + "&role=" + payloadData.role,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                        console.log(data)
                        _self.allSectionData = data;
                        _self.section1Data = data.section1;
                        _self.section2Data = data.section2;
                        _self.section3Data = data.section3;
                        _self.section4Data = data.section4;
                        _self.ageFlag = _self.calculateAge(data.section1.child_dob);
                        _self.section1Data.child_dob = _self.convertDate(data.section1.child_dob);

                        if (_self.section2Data.child_manual_address && _self.section2Data.child_manual_address.length) {
                            var getObjSect2child = convertArrayToObj(_self.section2Data.child_manual_address);
                            delete getObjSect2child.id;
                            delete getObjSect2child.mode;
                            _self.showchildManualAddressSection2 = dynamicSeparator(getObjSect2child, ',');
                            _self.showchildManualAddressSection2 = _self.showchildManualAddressSection2 + '.';
                        }

                        if (_self.section2Data.parent_manual_address && _self.section2Data.parent_manual_address.length) {
                            var getObjSect2Parent = convertArrayToObj(_self.section2Data.parent_manual_address);
                            delete getObjSect2Parent.id;
                            delete getObjSect2Parent.mode;
                            _self.showParentManualAddressSection2 = dynamicSeparator(getObjSect2Parent, ',');
                            _self.showParentManualAddressSection2 = _self.showParentManualAddressSection2 + '.';

                        }

                        if (_self.section1Data.professional_manual_address && _self.section1Data.professional_manual_address.length) {
                            var getObj1 = convertArrayToObj(_self.section1Data.professional_manual_address);
                            delete getObj1.id;
                            delete getObj1.mode;
                            _self.showManualAddressForRole = dynamicSeparator(getObj1, ',');
                            _self.showManualAddressForRole = _self.showManualAddressForRole + '.';
                        }

                        if (_self.section3Data.child_education_manual_address && _self.section3Data.child_education_manual_address.length) {
                            var getObj = convertArrayToObj(_self.section3Data.child_education_manual_address);
                            delete getObj.id;
                            delete getObj.mode;
                            _self.showManualAddress = dynamicSeparator(getObj, ',', true);
                            _self.showManualAddress = _self.showManualAddress + '.';

                        }

                        //Other Reasons for making referral
                        if (_self.section4Data.other_reasons_referral) {
                            if (Array.isArray(_self.section4Data.reason_for_referral)) {
                                _self.section4Data.reason_for_referral.push(_self.section4Data.other_reasons_referral);
                            } else {
                                _self.section4Data.reason_for_referral = _self.section4Data.reason_for_referral + _self.section4Data.other_reasons_referral;
                            }
                        }

                        //Other Reasons for eating difficulties
                        if (_self.section4Data.other_eating_difficulties) {
                            if (Array.isArray(_self.section4Data.eating_disorder_difficulties)) {
                                _self.section4Data.eating_disorder_difficulties.push(_self.section4Data.other_eating_difficulties);
                            } else {
                                _self.section4Data.eating_disorder_difficulties = _self.section4Data.eating_disorder_difficulties + _self.section4Data.other_eating_difficulties;
                            }
                        }

                        if (_self.section4Data.reason_for_referral) {
                            _self.section4Data.reason_for_referral = _self.section4Data.reason_for_referral.toString();
                        }
                        if (_self.section4Data.eating_disorder_difficulties) {
                            _self.section4Data.eating_disorder_difficulties = _self.section4Data.eating_disorder_difficulties.toString();
                        }
                        _self.prevSection1Data = JSON.parse(JSON.stringify(data.section1));
                        _self.prevSection2Data = JSON.parse(JSON.stringify(data.section2));
                        _self.prevSection3Data = JSON.parse(JSON.stringify(data.section3));
                        _self.prevSection4Data = JSON.parse(JSON.stringify(data.section4));

                        if (_self.section4Data.local_services) {
                            if (_self.section4Data.local_services.indexOf('Other') == -1) {
                                _self.section4Data.local_services = _self.section4Data.local_services;
                            } else {
                                var index = _self.section4Data.local_services.indexOf('Other');
                                _self.section4Data.local_services.splice(index, 1);
                                var services = _self.section4Data.services.map(function (it) {
                                    return it.name
                                });
                                _self.section4Data.local_services = _self.section4Data.local_services.concat(services);
                            }
                        }

                        $('#loader').hide();
                    },
                    error: function (error) {
                        $('#loader').hide();
                        //console.log('Something went Wrong', error)
                        showError(error.responseJSON.message, error.status);
                    }
                });
            },

            //Function to send feedback for referral form
            sendReferralFeedback: function () {
                this.isFeedBackFormSubmitted = true;
                if (this.refFeedbackData.ratings) {
                    $('#aa6a4e36-a655-4ebe-b072-2cb4d1a1f642').modal('hide');
                    $('#loader').show();
                    var feedbackObj = JSON.parse(JSON.stringify(this.refFeedbackData));
                    var successData = apiCallPost('post', '/feedback', feedbackObj);
                    if (successData && Object.keys(successData)) {
                        $('#loader').hide();
                        this.feedbackMessage = successData.message;
                        $('#refFeedbackSuccess').modal('show');
                        this.resetForm();

                    } else {
                        $('#loader').hide();
                        this.feedbackMessage = 'Something went wrong. Please try again.';
                    }
                } else {
                    scrollToInvalidInput();
                    return false;
                }
            },

            resetForm: function () {
                this.isFeedBackFormSubmitted = "";
                this.refFeedbackData.comments = "";
                this.refFeedbackData.ratings = "";
            },

            //Function to trim space entered
            trimWhiteSpace: function (event, obj, key) {
                preventWhiteSpaces(event, this, obj, key)
            },

            save: function () {
                var buttonElem = document.querySelector('#acceptBtn');
                this.isFormSubmitted = true;
                this.payloadData.contactPreference = this.contactPref;
                this.payloadData.contact_person = this.contact_person;
                if (this.userRole == 'young' || this.userRole == 'family') {
                    if (this.contact_person && this.contactPref.length) {
                        $('#loader').show();
                        if (this.section1Data.gp_school != "" && this.section1Data.gp_school != null) {
                            if (this.section1Data.gp_school === 'Liverpool') {
                                this.payloadData.referral_provider = "MHST Liverpool";
                            } else {
                                this.payloadData.referral_provider = "MHST Sefton";
                            }
                        }
                        else {
                            this.payloadData.referral_provider = "YPAS";
                        }
                        buttonElem.setAttribute('disabled', true)
                        var trimmedPayload = trimObj(this.payloadData);
                        $.ajax({
                            url: API_URI + "/saveYoungReview",
                            type: "post",
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify(trimmedPayload),
                            cache: false,
                            success: function (res) {
                                location.href = "/acknowledge";
                                this.isFormSubmitted = false;
                                //$('#loader').hide();
                            },
                            error: function (error) {
                                $('#loader').removeClass('d-block').addClass('d-none');
                                buttonElem.removeAttribute('disabled');
                                if (error) {
                                    showError(error.responseJSON.message, error.status);
                                }
                            }
                        });
                    } else {
                        buttonElem.removeAttribute('disabled');
                        return false;
                    }

                }
                else if (this.userRole == 'professional') {
                    if (this.contact_person && this.contactPref.length) {
                        $('#loader').show();
                        if (this.section1Data.gp_school != "" && this.section1Data.gp_school != null) {
                            if (this.section1Data.gp_school === 'Liverpool') {
                                this.payloadData.referral_provider = "MHST Liverpool";
                            } else {
                                this.payloadData.referral_provider = "MHST Sefton";
                            }
                        }
                        else if (this.section1Data.selected_service != "") {
                            this.payloadData.referral_provider = this.section1Data.selected_service;
                        }
                        else if (this.section1Data.selected_service == "") {
                            this.payloadData.referral_provider = "YPAS";
                        }

                        if (!this.payloadData.needCopy) {
                            return false
                        }
                        else {
                            buttonElem.setAttribute('disabled', true);
                            this.payloadData.profEmailToSend = this.allSectionData.section1.professional_email ? this.allSectionData.section1.professional_email : ''
                            var trimmedPayload = trimObj(this.payloadData);
                            $.ajax({
                                url: API_URI + "/saveYoungReview",
                                type: "post",
                                dataType: 'json',
                                contentType: 'application/json',
                                data: JSON.stringify(trimmedPayload),
                                cache: false,
                                success: function (res) {
                                    location.href = "/acknowledge";
                                    this.isFormSubmitted = false;
                                },
                                error: function (error) {
                                    $('#loader').removeClass('d-block').addClass('d-none');
                                    buttonElem.removeAttribute('disabled');
                                    if (error) {
                                        console.log(error)
                                        showError(error.responseJSON.message, error.status);
                                    }
                                }
                            });
                        }

                    } else {
                        buttonElem.removeAttribute('disabled');
                        return false;
                    }
                }
            },

            changeProvider: function (e) {
                if (e.target.value == 'Other') {
                    this.isFormSubmitted = false;
                    this.addMoreOrg = true;
                } else {
                    this.isFormSubmitted = false;
                    this.addMoreOrg = false;
                    this.nameForOthers = "";
                }

            },

            resetProvider: function () {
                this.isFormSubmitted = false;
                this.sendRef = [];
                this.addMoreOrg = false;
                this.nameForOthers = "";
            },

            preventWhiteSpaces: function (e) {
                if (e.target.value && !e.target.value.replace(/ /g, "").length) {
                    return false;
                } else {
                    return true;
                }
            },


            editAllSection: function (page) {
                this.userId = document.getElementById('uUid').innerHTML
                this.userRole = document.getElementById('uRole').innerHTML;
                //var parameter = this.userId + "&" + this.userRole + "&" + "sec5back"
                var parameter = "sec5back"
                var enCodeParameter = btoa(parameter)
                location.href = "/" + page + "?" + enCodeParameter
            },

            checkArrayLength: function (arr) {
                if (arr && Array.from(arr).length) {
                    return true;
                } else {
                    return false;
                }
            },

            toggleArrow: function (e, section, allData) {
                var ele = e.target;
                var elemId = e.target.id;
                var allToggleIcons = Array.from(document.getElementsByClassName('arrowClass'));
                allToggleIcons.filter(function (i) {
                    if (i.id == elemId) {
                        if (Array.from(ele.classList).indexOf('fa-chevron-circle-up') > -1) {
                            $(ele).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                        } else {
                            $(ele).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                        }
                    } else {
                        $(i).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                    }
                });
                this.resetValidation(section, allData);

            },

            getUrlVars: function () {
                var vars = {};
                var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                    function (m, key, value) {
                        vars[key] = value;
                    });
                return vars;
            },

            backToReferral: function () {
                var uid = this.getUrlVars()['userid'];
                var role = this.getUrlVars()['role'];
                location.href = "/referral?userid=" + uid + "&role=" + role + "&edt=1";
            },

            convertDate: function (dbDate) {
                var date = new Date(dbDate)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();

                var mmChars = mm.split('');
                var ddChars = dd.split('');
                var showDate = (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + yyyy
                // return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
                return showDate;
            },

            updateEligibility: function (updateObj) {
                $.ajax({
                    url: API_URI + "/updateReview",
                    type: 'put',
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    data: JSON.stringify(updateObj),
                    success: function (data) {
                        alert("Your Reference Number" + data.refNo);
                        //console.log(data);
                    },
                });
            },

            onValueChange: function (e) {
                //console.log(e);
                var buttonElem = document.querySelector('#sect2');
                if (JSON.stringify(this.prevSection2Data) === JSON.stringify(this.section2Data)) {
                    buttonElem.disabled = true;
                } else {
                    buttonElem.disabled = false;
                }

            },

            onDetectChange: function (e, toSection, section, key) {
                if (e.target.value && !e.target.value.replace(/ /g, "").length) {
                    this[section][key] = e.target.value.trim();
                    return false;
                }
                var buttonElem = document.querySelector('#' + toSection);
                if (toSection == "sect1") {
                    if (JSON.stringify(this.prevSection1Data) === JSON.stringify(this.section1Data)) {
                        buttonElem.setAttribute('disabled', true);
                    } else {
                        buttonElem.removeAttribute('disabled');
                    }
                }
                else if (toSection == "sect2") {
                    if (JSON.stringify(this.prevSection2Data) === JSON.stringify(this.section2Data)) {
                        buttonElem.setAttribute('disabled', true);
                    } else {
                        buttonElem.removeAttribute('disabled');
                    }
                }
                else if (toSection == "sect3") {
                    if (JSON.stringify(this.prevSection3Data) === JSON.stringify(this.section3Data)) {
                        buttonElem.setAttribute('disabled', true);
                    } else {
                        buttonElem.removeAttribute('disabled');
                    }
                }
                else if (toSection == "sect4") {
                    if (JSON.stringify(this.prevSection4Data) === JSON.stringify(this.section4Data)) {
                        buttonElem.setAttribute('disabled', true);
                    } else {
                        buttonElem.removeAttribute('disabled');
                    }
                }
            },

            updateInfo: function (e, toUpdateObj, endpoint, saveButtonId) {
                var formData = toUpdateObj;
                var beforeSaveElem = $('#' + saveButtonId);
                if (endpoint == "/user/updateAboutInfo") {
                    this.isSection2Submitted = true;
                    var dynamicRegexchild;
                    var dynamicRegexParent;
                    if (formData.child_contact_type == "mobile") {
                        dynamicRegexchild = this.phoneRegex
                    } else if (formData.child_contact_type == "landline") {
                        dynamicRegexchild = this.landlineRegex;
                    }
                    if (formData.parent_contact_type == "mobile") {
                        dynamicRegexParent = this.phoneRegex
                    } else if (formData.parent_contact_type == "landline") {
                        dynamicRegexParent = this.landlineRegex;
                    }

                    if (formData.child_name && formData.child_lastname && formData.child_contact_number &&
                        formData.child_gender && formData.parent_name && formData.parent_lastname && formData.child_parent_relationship && formData.parent_contact_number
                        && dynamicRegexchild.test(formData.child_contact_number) && dynamicRegexParent.test(formData.parent_contact_number)
                    ) {

                        if ((formData.child_NHS && !this.nhsRegex.test(formData.child_NHS))) {
                            scrollToInvalidInput('remove');
                            return false;
                        }

                        if ((formData.child_email && !this.emailRegex.test(formData.child_email))) {
                            scrollToInvalidInput('remove');
                            return false;
                        }

                        if ((formData.parent_contact_number && !dynamicRegexParent.test(formData.parent_contact_number))) {
                            scrollToInvalidInput('remove');
                            return false;
                        }


                        if ((formData.parent_email && !this.emailRegex.test(formData.parent_email))) {
                            scrollToInvalidInput('remove');
                            return false;
                        }
                        beforeSaveElem.text("Saving...");
                        this.payloadData.section2Data = JSON.parse(JSON.stringify(formData));
                        this.payloadData.role = this.userRole;
                        this.payloadData.userid = this.userId;
                        this.payloadData.endPoint = endpoint
                        if (this.userMode === 'edit') {
                            this.payloadData.userMode = 'edit';
                        } else {
                            this.payloadData.userMode = 'add';
                        }
                        this.upsertInforForm(this.payloadData, 2, e.currentTarget.id, beforeSaveElem);

                    } else {
                        scrollToInvalidInput('remove');
                        return false;
                    }
                }
                else if (endpoint == "/user/updateSec3Info") {
                    this.isSection3Submitted = true;
                    var dynamicRegexPattern;
                    if (formData.child_socialworker_contact_type == "mobile") {
                        dynamicRegexPattern = this.phoneRegex
                    } else if (formData.child_socialworker_contact_type == "landline") {
                        dynamicRegexPattern = this.landlineRegex;
                    }
                    if (formData.child_socialworker == 'yes' && formData.child_socialworker_name == "") {
                        scrollToInvalidInput('remove');
                        return false;
                    }
                    if (formData.child_socialworker == 'yes' && (formData.child_socialworker_contact && !dynamicRegexPattern.test(formData.child_socialworker_contact))) {
                        scrollToInvalidInput('remove');
                        return false;
                    }
                    beforeSaveElem.text("Saving...");
                    this.payloadData.section3Data = JSON.parse(JSON.stringify(formData));
                    this.payloadData.role = this.userRole;
                    this.payloadData.userid = this.userId;
                    this.payloadData.endPoint = endpoint
                    this.upsertInforForm(this.payloadData, 3, e.currentTarget.id, beforeSaveElem);
                }
                else if (endpoint == "/user/updateSec4Info") {
                    this.isSection4Submitted = true;
                    if (formData.referral_issues == "") {
                        scrollToInvalidInput('remove');
                        return false;
                    }
                    beforeSaveElem.text("Saving...");
                    this.payloadData.section4Data = JSON.parse(JSON.stringify(formData));
                    delete this.payloadData.section4Data.reason_for_referral;
                    delete this.payloadData.section4Data.eating_disorder_difficulties;
                    this.payloadData.role = this.userRole;
                    this.payloadData.userid = this.userId;
                    this.payloadData.endPoint = endpoint;
                    this.upsertInforForm(this.payloadData, 4, e.currentTarget.id, beforeSaveElem);
                }
                else if (endpoint == "/user/updateEligibilityInfo") {
                    this.isSection1Submitted = true;
                    var dynamicRegexPattern;
                    if (formData.professional_contact_type == "mobile") {
                        dynamicRegexPattern = this.phoneRegex
                    } else if (formData.professional_contact_type == "landline") {
                        dynamicRegexPattern = this.landlineRegex;
                    }
                    if (formData.professional_name && formData.professional_lastname && formData.professional_contact_number &&
                        dynamicRegexPattern.test(formData.professional_contact_number) && formData.professional_profession) {
                        if (formData.professional_email && !this.emailRegex.test(formData.professional_email)) {
                            scrollToInvalidInput('remove');
                            return false;
                        }
                        beforeSaveElem.text("Saving...");
                        this.payloadData.section1Data = JSON.parse(JSON.stringify(formData));
                        this.payloadData.role = this.userRole;
                        this.payloadData.userid = this.userId;
                        this.payloadData.endPoint = endpoint;
                        this.upsertInforForm(this.payloadData, 1, e.currentTarget.id, beforeSaveElem);

                    } else {
                        scrollToInvalidInput('remove');
                        return false;
                    }
                }

            },

            upsertInforForm: function (payload, section, id, saveElemId) {
                // var beforeSaveElem = document.getElementById('beforeSave');
                //var beforeSaveElem = $('#beforeSave');
                var endPoint = '/updateInfo';
                var _self = this;
                var buttonElem = document.getElementById(id);
                $.ajax({
                    url: API_URI + endPoint,
                    type: 'put',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    cache: false,
                    success: function (res) {
                        //beforeSaveElem.textContent = "Save";
                        saveElemId.text("Save");
                        buttonElem.disabled = true;
                        _self.resetFormSubmitted(section, res.data);
                        // _self.showLoader = true;
                        // buttonElem.disabled = true;
                        // setTimeout(function () {
                        //     _self.showLoader = false;
                        //     _self.resetFormSubmitted(section, res.data);
                        // }, 3000);

                    },
                    error: function (error) {
                        saveElemId.text("Save");
                        buttonElem.disabled = true;
                        if (error) {
                            showError(error.responseJSON.message, error.status);
                        }
                        // _self.showLoader = true;
                        // buttonElem.disabled = true;
                        // setTimeout(function () {
                        //     _self.showLoader = false;
                        // }, 3000);
                    }
                });
            },

            // /Prevention of entering white spaces
            preventWhiteSpaces: function (e) {
                if (e.which === 32 && e.target.selectionStart === 0) {
                    e.preventDefault();
                }
            },

            resetValidation: function (section, allData) {
                if (section == 1) {
                    this.isSection1Submitted = false;
                }
                else if (section == 2) {
                    this.isSection2Submitted = false;
                }
                else if (section == 3) {
                    this.isSection3Submitted = false;
                }
                else if (section == 4) {
                    this.isSection4Submitted = false;
                }
                //this.allSectionData = allData;

            },

            resetFormSubmitted: function (section, data) {
                //console.log(data);
                if (section == 1) {
                    this.isSection1Submitted = false;
                    this.section1Data = data;
                    this.allSectionData.section1 = data;
                    this.section1Data.child_dob = this.convertDate(data.child_dob);
                }
                else if (section == 2) {
                    this.isSection2Submitted = false;
                    this.section2Data = data;
                    this.allSectionData.section2 = data;
                }
                else if (section == 3) {
                    this.isSection3Submitted = false;
                    this.section3Data = data;
                    this.allSectionData.section3 = data;
                }
                else if (section == 4) {
                    if (data.other_reasons_referral != null) {
                        data.reason_for_referral.push(data.other_reasons_referral);
                    }

                    if (data.other_eating_difficulties != null) {
                        data.eating_disorder_difficulties.push(data.other_eating_difficulties);
                    }

                    data.reason_for_referral = data.reason_for_referral.toString();
                    data.eating_disorder_difficulties = data.eating_disorder_difficulties.toString();

                    if (data.local_services) {
                        if (data.local_services.indexOf('Other') == -1) {
                            data.local_services = data.local_services;
                        } else {
                            var index = data.local_services.indexOf('Other');
                            data.local_services.splice(index, 1);
                            var services = data.services.map(function (it) {
                                return it.name
                            });
                            data.local_services = data.local_services.concat(services);
                        }
                    }
                    this.isSection4Submitted = false;
                    this.section4Data = data;
                    this.allSectionData.section4 = data;

                }

            },

            calculateAge: function (birthDate) {
                birthDate = new Date(birthDate);
                otherDate = new Date();
                var years = (otherDate.getFullYear() - birthDate.getFullYear());
                if (otherDate.getMonth() < birthDate.getMonth() ||
                    otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
                    years--;
                }
                return years;
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
            },
        }
    })

})
