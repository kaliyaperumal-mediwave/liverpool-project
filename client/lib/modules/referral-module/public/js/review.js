var API_URI = "/modules/review-module";
$(document).ready(function () {

    var app = new Vue({
        el: '#review-form',
        data: {
            isToggled: true,
            userId: '',
            userMode: '',
            userRole: '',
            yourInfo: '',
            allSectionData: {},
            section5Labels: {
                aboutLabel: "",
                referralLabel: ""
            },
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
            phoneRegex: /^\+{0,1}[0-9 ]{10,16}$/,
            //phoneRegex: /^[0-9,-]{10,15}$|^$/,
            //phoneRegex: /(\s*\(?(0|\+44)(\s*|-)\d{4}\)?(\s*|-)\d{3}(\s*|-)\d{3}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\)?(\s*|-)\d{3}(\s*|-)\d{4}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{2}\)?(\s*|-)\d{4}(\s*|-)\d{4}\s*)|(\s*(7|8)(\d{7}|\d{3}(\-|\s{1})\d{4})\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\s\d{2}\)?(\s*|-)\d{4,5}\s*)/,
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
            showLoader: false
        },
        mounted: function () {
            this.paramValues = getParameter(location.href)
            this.section5Labels = section5Labels;
            this.userRole = this.paramValues[1];
            if (this.userRole === 'child') {
                this.yourInfo = 'Child / Young Person';
                this.section5Labels.aboutLabel = "About You";
                this.section5Labels.referralLabel = "Your reason for referral";

            } else if (this.userRole === 'parent') {
                this.yourInfo = 'Parent / Carer';
                this.section5Labels.aboutLabel = "About Your Child";
                this.section5Labels.referralLabel = "Your child's reason for referral";

            } else if (this.userRole === 'professional') {
                this.yourInfo = 'Professional';
                this.section5Labels.aboutLabel = "About The Child";
                this.section5Labels.referralLabel = "The child's reason for referral";

            }
            this.userId = this.paramValues[0];
            this.payloadData.userid = this.userId;
            this.payloadData.role = this.userRole;
            console.log(this.payloadData);
            this.getAllSectionData(this.payloadData);
        },
        methods: {

            //Get Request to get all section's data
            getAllSectionData: function (payloadData) {
                var _self = this;
                $.ajax({
                    url: API_URI + "/fetchReview/" + payloadData.userid + "&role=" + payloadData.role,
                    type: 'get',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data) {

                        _self.section1Data = data.section1;
                        _self.section2Data = data.section2;
                        _self.section3Data = data.section3;
                        _self.section4Data = data.section4;

                        _self.section1Data.child_dob = convertDate(data.section1.child_dob);
                        if (_self.section4Data.diagnosis_other != "")
                            _self.section4Data.diagnosis.push(_self.section4Data.diagnosis_other)
                        if (_self.section4Data.symptoms_other != "")
                            _self.section4Data.symptoms.push(_self.section4Data.symptoms_other)
                        _self.section4Data.diagnosis = _self.section4Data.diagnosis.toString();
                        _self.section4Data.symptoms = _self.section4Data.symptoms.toString();
                        _self.section4Data.local_services = _self.section4Data.local_services.toString();

                        _self.prevSection1Data = JSON.parse(JSON.stringify(data.section1));
                        _self.prevSection2Data = JSON.parse(JSON.stringify(data.section2));
                        _self.prevSection3Data = JSON.parse(JSON.stringify(data.section3));
                        _self.prevSection4Data = JSON.parse(JSON.stringify(data.section4));

                        //self.section4Data.local_services =  _self.section4Data.local_services
                        //  Vue.set(this.section1Data,data);
                    },
                    error: function (error) {
                        console.log('Something went Wrong', error)
                        showError(error.responseJSON.message, error.status);
                    }
                });
            },

            save: function () {
                this.isFormSubmitted = true;
                this.payloadData.contactPreference = this.contactPref;
                if (this.contactPref.length) {
                    var successData = apiCallPost('post', '/saveReview', this.payloadData);
                    console.log(successData);
                    if (Object.keys(successData)) {
                        location.href = redirectUrl(location.href, "acknowledge", this.paramValues[0], this.paramValues[1]);
                        this.isFormSubmitted = false;
                    } else {
                        console.log('empty response')
                    }
                } else {
                    return false;
                }
            },

            editAllSection: function (page) {
                this.userId = this.paramValues[0];
                this.userRole = this.paramValues[1];
                var parameter = this.userId + "&" + this.userRole + "&" + "sec5back"
                var enCodeParameter = btoa(parameter)
                location.href = "/" + page + "?" + enCodeParameter
            },

            toggleArrow: function (e) {
                var ele = e.target;
                var classList = Array.from(e.target.classList)
                if (classList.indexOf('fa-chevron-circle-up') > -1) {
                    $(ele).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                } else {
                    $(ele).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                }
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

                return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
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

            onDetectChange: function (e, toSection) {
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
                        if (this.editPatchFlag) {
                            this.payloadData.editFlag = this.paramValues[2]
                        }

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
                    if (formData.has_anything_helped == '') {
                        scrollToInvalidInput();
                        return false;
                    }
                    if (formData.any_particular_trigger == '') {
                        scrollToInvalidInput();
                        return false;
                    }
                    if (formData.disabilities == '') {
                        scrollToInvalidInput();
                        return false;
                    }

                    this.payloadData.section4Data = JSON.parse(JSON.stringify(formData));
                    this.payloadData.role = this.userRole;
                    this.payloadData.userid = this.userId;
                    this.payloadData.endPoint = endpoint
                    this.upsertInforForm(this.payloadData, 4, e.currentTarget.id);
                }
                else if (endpoint == "/user/updateEligibilityInfo") {
                    this.isSection1Submitted = true;
                    if (formData.professional_name && formData.professional_contact_number &&
                        this.phoneRegex.test(formData.professional_contact_number)) {
                        if (formData.professional_email && !this.emailRegex.test(formData.professional_email)) {
                            scrollToInvalidInput();
                            return false;
                        }
                        this.payloadData.section1Data = JSON.parse(JSON.stringify(formData));
                        this.payloadData.role = this.userRole;
                        this.payloadData.userid = this.userId;
                        this.payloadData.endPoint = endpoint
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
                    success: function (res) {
                        console.log(res)
                        _self.showLoader = true;
                        buttonElem.disabled = true;
                        setTimeout(function () {
                            _self.showLoader = false;
                            _self.resetFormSubmitted(section);
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

            resetFormSubmitted: function (section) {
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

            }

        }
    })

})