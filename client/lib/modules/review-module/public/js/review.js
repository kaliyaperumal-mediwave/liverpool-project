var API_URI = "/modules/review-module";

window.history.forward();
function noBack() {
    window.history.forward();
}

$(document).ready(function () {
    var app = new Vue({
        el: '#review-form',
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
                'Child Protection Plan',
                'Other Carer'
            ],
            mockData: [
                {
                    "id": "191afd2b-7d38-4486-b8e3-292d10961ad0",
                    "dob": "10/01/2021",
                    "mode": "add",
                    "name": "Rajkumar",
                    "randomName": "asdasgdg",
                    "profession": "DDRC SRL Diagnostics Pvt.Ltd., Near Mary Queen Church, Ark Building, N.H. Road, Panampilly Nagar, Vandanam, Kerala 682036, India",
                    "relationShip": "Parent"
                },
                {
                    "id": "191afd2b-7d38-4486-b8e3-489897897hj",
                    "dob": "15/01/2021",
                    "mode": "add",
                    "name": "RaMkumar",
                    "randomName": "87cudfjk",
                    "profession": "DDRC SRL Diagnostics Pvt.Ltd., Near Mary Queen Church, Ark Building, N.H. Road, Panampilly Nagar, Vandanam, Kerala 682036, India",
                    "relationShip": "Parent"
                }
            ],
            allSectionData: [],
            section1Data: {},
            section2Data: {},
            section3Data: {},
            section4Data: {},
            prevSection1Data: {},
            prevSection2Data: {},
            prevSection3Data: {},
            prevSection4Data: {},
            payloadData: {},
            contactPref: [],
            selectProvider: '',
            sendRef: '',
            phoneRegex: /^[0-9,-]{10,15}$|^$/,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            nhsRegex: /^[0-9]{10}$/,
            isFormSubmitted: false,
            isSection1Submitted: false,
            isSection2Submitted: false,
            isSection3Submitted: false,
            isSection4Submitted: false,
            showSec1: false,
            digArray: [],
            disableSection1Button: false,
            showLoader: false,
            nameForOthers: "",
            addMoreOrg: false,
        },

        // beforeCreate: function () {
        //     debugger
        //     let spinner = document.querySelector("#loader")
        //     if (spinner.classList.contains("blurred")) {
        //         spinner.classList.remove("blurred");
        //     } else {
        //         spinner.classList.add("blurred")
        //     }
        //     $('#loader').show();
        // },
        beforeMount: function () {
            // this.blurMe();
            $('#loader').show();
        },

        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.section5Labels = section5Labels;
            this.userRole = document.getElementById('uRole').innerHTML;
            if (this.userRole === 'child') {
                this.yourInfo = 'Child/Young person';
                this.section5Labels.aboutLabel = "About you";
                this.section5Labels.referralLabel = "Your reason for referral";

            } else if (this.userRole === 'parent') {
                this.yourInfo = 'Parent / Carer';
                this.section5Labels.aboutLabel = "About your child";
                this.section5Labels.referralLabel = "Your child's reason for referral";

            } else if (this.userRole === 'professional') {
                this.yourInfo = 'Professional';
                this.section5Labels.aboutLabel = "About the child";
                this.section5Labels.referralLabel = "The child's reason for referral";

            }
            this.userId = document.getElementById('uUid').innerHTML;
            this.payloadData.userid = this.userId;
            this.payloadData.role = this.userRole;
            //  console.log(this.payloadData);
            this.getAllSectionData(this.payloadData);

        },
        methods: {

            //Get Request to get all section's data
            getAllSectionData: function (payloadData) {
               // console.log()
                var _self = this;
                $.ajax({
                    url: API_URI + "/fetchReview/" + payloadData.userid + "&role=" + payloadData.role,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    cache: false,
                    success: function (data) {
                            //console.log(data)
                        _self.allSectionData = data;
                        _self.section1Data = data.section1;
                        _self.section2Data = data.section2;
                        _self.section3Data = data.section3;
                        _self.section4Data = data.section4;
                        _self.section1Data.child_dob = _self.convertDate(data.section1.child_dob);

                        if (_self.section4Data.other_reasons_referral) {
                            if (Array.isArray(_self.section4Data.reason_for_referral)) {
                                _self.section4Data.reason_for_referral.push(_self.section4Data.other_reasons_referral);
                            } else {
                                _self.section4Data.reason_for_referral = _self.section4Data.reason_for_referral + _self.section4Data.other_reasons_referral;
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
                        console.log('Something went Wrong', error)
                        showError(error.responseJSON.message, error.status);
                    }
                });
            },

            blurMe: function () {
                let spinner = document.querySelector("#loader")
                if (spinner.classList.contains("blurred")) {
                    spinner.classList.remove("blurred");
                } else {
                    spinner.classList.add("blurred")
                }
            },

            save: function () {
                this.isFormSubmitted = true;
                this.payloadData.contactPreference = this.contactPref;
                if (this.userRole == 'child' || this.userRole == 'parent') {
                    if (this.contactPref.length) {
                        this.payloadData.referral_provider = "";
                        var successData = apiCallPost('post', '/saveReview', this.payloadData);
                        console.log(successData);
                        if (Object.keys(successData)) {
                            location.href = "/acknowledge";
                            this.isFormSubmitted = false;
                        } else {
                            console.log('empty response')
                        }
                    } else {
                        scrollToInvalidInput();
                        return false;
                    }

                } else {
                    if (this.contactPref.length && this.selectProvider && this.selectProvider == 'No') {
                        this.payloadData.referral_provider = "";
                        var successData = apiCallPost('post', '/saveReview', this.payloadData);
                        console.log(successData);
                        if (Object.keys(successData)) {
                            location.href = "/acknowledge";
                            this.isFormSubmitted = false;
                        } else {
                            console.log('empty response')
                        }
                    } else if (this.contactPref.length && this.selectProvider && this.selectProvider == 'Yes') {
                        if (this.sendRef && (this.sendRef == 'YPAS' || this.sendRef == 'Venus' || this.sendRef == 'IAPTUS')) {
                            this.payloadData.referral_provider = this.sendRef;
                            var successData = apiCallPost('post', '/saveReview', this.payloadData);
                            if (Object.keys(successData)) {
                                location.href = "/acknowledge";
                                this.isFormSubmitted = false;
                            } else {
                                console.log('empty response')
                            }

                        } else if (this.sendRef && this.sendRef == 'Other') {
                            if (this.nameForOthers) {
                                this.payloadData.referral_provider = this.nameForOthers;
                                var successData = apiCallPost('post', '/saveReview', this.payloadData);
                                if (Object.keys(successData)) {
                                    location.href = "/acknowledge";
                                    this.isFormSubmitted = false;
                                } else {
                                    console.log('empty response')
                                }
                            } else {
                                scrollToInvalidInput();
                                return false;
                            }

                        } else {
                            scrollToInvalidInput();
                            return false;
                        }

                    }
                    else {
                        scrollToInvalidInput();
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
                    data: JSON.stringify(updateObj),
                    success: function (data) {
                        alert("Your Reference Number" + data.refNo);
                        console.log(data);
                    },
                });


            },

            onValueChange: function (e) {
                console.log(e);
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
                        buttonElem.disabled = true;
                    } else {
                        buttonElem.disabled = false;
                    }
                }
                else if (toSection == "sect2") {
                    if (JSON.stringify(this.prevSection2Data) === JSON.stringify(this.section2Data)) {
                        buttonElem.disabled = true;
                    } else {
                        buttonElem.disabled = false;
                    }
                }
                else if (toSection == "sect3") {
                    if (JSON.stringify(this.prevSection3Data) === JSON.stringify(this.section3Data)) {
                        buttonElem.disabled = true;
                    } else {
                        buttonElem.disabled = false;
                    }
                }
                else if (toSection == "sect4") {
                    if (JSON.stringify(this.prevSection4Data) === JSON.stringify(this.section4Data)) {
                        buttonElem.disabled = true;
                    } else {
                        buttonElem.disabled = false;
                    }
                }
            },

            updateInfo: function (e, toUpdateObj, endpoint) {
                //  debugger
                var formData = toUpdateObj;
                if (endpoint == "/user/updateAboutInfo") {
                    this.isSection2Submitted = true;
                    if (formData.child_name && formData.child_contact_number &&
                        formData.child_gender && formData.parent_name && formData.child_parent_relationship && formData.parent_contact_number
                        && this.phoneRegex.test(formData.child_contact_number) && this.phoneRegex.test(formData.parent_contact_number)
                    ) {

                        if ((formData.child_NHS && !this.nhsRegex.test(formData.child_NHS))) {
                            scrollToInvalidInput();
                            return false;
                        }

                        if ((formData.child_email && !this.emailRegex.test(formData.child_email))) {
                            scrollToInvalidInput();
                            return false;
                        }

                        if ((formData.parent_contact_number && !this.phoneRegex.test(formData.parent_contact_number))) {
                            scrollToInvalidInput();
                            return false;
                        }


                        if ((formData.parent_email && !this.emailRegex.test(formData.parent_email))) {
                            scrollToInvalidInput();
                            return false;
                        }

                        this.payloadData.section2Data = JSON.parse(JSON.stringify(formData));
                        this.payloadData.role = this.userRole;
                        this.payloadData.userid = this.userId;
                        this.payloadData.endPoint = endpoint
                        // if (this.editPatchFlag) {
                        //     this.payloadData.editFlag = this.paramValues[2]
                        // }

                        if (this.userMode === 'edit') {
                            this.payloadData.userMode = 'edit';
                        } else {
                            this.payloadData.userMode = 'add';
                        }
                        this.upsertInforForm(this.payloadData, 2, e.currentTarget.id);

                    } else {
                        scrollToInvalidInput();
                        return false;
                    }
                }
                else if (endpoint == "/user/updateSec3Info") {
                    this.isSection3Submitted = true;
                    if (formData.child_socialworker == 'yes' && formData.child_socialworker_name == "") {
                        scrollToInvalidInput();
                        return false;
                    }
                    if (formData.child_socialworker == 'yes' && (formData.child_socialworker_contact && !this.phoneRegex.test(formData.child_socialworker_contact))) {
                        scrollToInvalidInput();
                        return false;
                    }
                    this.payloadData.section3Data = JSON.parse(JSON.stringify(formData));
                    this.payloadData.role = this.userRole;
                    this.payloadData.userid = this.userId;
                    this.payloadData.endPoint = endpoint
                    this.upsertInforForm(this.payloadData, 3, e.currentTarget.id);
                }
                else if (endpoint == "/user/updateSec4Info") {
                    this.isSection4Submitted = true;
                    if (formData.referral_issues == "") {
                        scrollToInvalidInput();
                        return false;
                    }

                    this.payloadData.section4Data = JSON.parse(JSON.stringify(formData));
                    delete this.payloadData.section4Data.reason_for_referral;
                    delete this.payloadData.section4Data.eating_disorder_difficulties;
                    this.payloadData.role = this.userRole;
                    this.payloadData.userid = this.userId;
                    this.payloadData.endPoint = endpoint;
                    this.upsertInforForm(this.payloadData, 4, e.currentTarget.id);
                }
                else if (endpoint == "/user/updateEligibilityInfo") {
                    this.isSection1Submitted = true;
                    if (formData.professional_name && formData.professional_contact_number &&
                        this.phoneRegex.test(formData.professional_contact_number) && formData.professional_profession) {
                        if (formData.professional_email && !this.emailRegex.test(formData.professional_email)) {
                            scrollToInvalidInput();
                            return false;
                        }
                        this.payloadData.section1Data = JSON.parse(JSON.stringify(formData));
                        this.payloadData.role = this.userRole;
                        this.payloadData.userid = this.userId;
                        this.payloadData.endPoint = endpoint;
                        this.upsertInforForm(this.payloadData, 1, e.currentTarget.id);

                    } else {
                        scrollToInvalidInput();
                        return false;
                    }
                }

            },

            upsertInforForm: function (payload, section, id) {
                var endPoint = '/updateInfo';
                var _self = this;
                var buttonElem = document.getElementById(id);
                $.ajax({
                    url: API_URI + endPoint,
                    type: 'put',
                    dataType: 'json',
                    async: false,
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    cache: false,
                    success: function (res) {
                        _self.showLoader = true;
                        buttonElem.disabled = true;
                        // $(document.body).css('pointer-events', 'none');
                        setTimeout(function () {
                            _self.showLoader = false;
                            _self.resetFormSubmitted(section, res.data);
                            //  $(document.body).css('pointer-events', 'all');
                        }, 3000);

                    },
                    error: function (error) {
                        _self.showLoader = true;
                        buttonElem.disabled = true;
                        setTimeout(function () {
                            _self.showLoader = false;
                        }, 3000);
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
                console.log(data);
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

            }

        }
    })

})