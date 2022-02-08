//const apiUrl = "/user/eligibility"
var API_URI = "/modules/role-module";
$(document).ready(function () {

    Vue.component('date-picker', VueBootstrapDatetimePicker);
    Vue.component('vue-multiselect', window.VueMultiselect.default)
    var _self = this;
    var app = new Vue({
        el: '#role-form',
        components: { Multiselect: window.VueMultiselect.default },
        data: {
            showLoadingSpinner: "",
            isUserLoggedIn: document.getElementById('loginUserFlag').innerHTML == "true" ? true : false,
            //dateMask: "##/##/####",
            optionsProxy: [],
            selectedResources: [],
            addressOptions: [],
            gpListShow: [],
            gpListJson: [],
            gpListJsonPostCode: [],
            elgibilityObj: {
                role: '',
                interpreter: '',
                tostInterYes: '',
                childDob: '',
                contactParent: '',
                contactParentNo: '',
                belowAgeLimit: 'no',
                aboveLimit: 'no',
                isInformation: '',
                isInformationNo: '',
                regGpTxt: '',
                submitFormTrue: '',
                underLimit: '',
                toastIsInformation: '',
                submitForm: '',
                submitProfForm: '',
                profBelowAgeLimit: '',
                profaboveLimit: '',
                parentConcernInformation: '',
                childConcernInformation: '',
                contactProfParent: '',
                regProfGpTxt: '',
                profEmail: '',
                profFirstName: '',
                proflastName: '',
                profContactNumber: '',
                profAddress: '',
                profProfession: '',
                disableRole: false,
                contact_parent_camhs: '',
                reason_contact_parent_camhs: '',
                gpNotCovered: false,
                gpNotCoveredProf: false,
                profDirectService: '',
                liverpoolService: '',
                seftonService: '',
                gpSchool: '',
                professional_contact_type: "mobile",
                registered_gp_postcode: '',
                profRegistered_gp_postcode: '',
                referral_mode: 1
            },
            professionalManualAddress: [],
            addressData: {
                addressLine1: '',
                addressLine2: '',
                city: '',
                country: '',
                postCode: ''
            },
            date: null,
            dateWrap: true,
            showInputLoader: false,
            showLoadingSpinner: false,
            showInputLoaderProf: false,
            options: {
                //format: 'YYYY/MM/DD',
                format: 'DD/MM/YYYY',
                dayViewHeaderFormat: 'MMMM YYYY',
                useCurrent: false,
                allowInputToggle: true,
                minDate: new Date(1950, 10, 25),
                maxDate: moment().endOf('day').add(1, 'sec'),
            },
            hasNameReqError: false,
            hasContactReqError: false,
            hasNameInvalidError: false,
            hasContactInvalidError: false,
            hasEmailInvalidError: false,
            isSubmitted: false,
            isAddressFormSubmitted: false,
            edFlag: false,
            sendObj: {},
            maxDate: "",
            gpListName: [],
            gpListPost: [],
            gpProfListName: [],
            gpProfListPost: [],
            loadGpName: true,
            loadGbPost: true,
            selectedGpObj: {},
            paramValues: [],
            patchFlag: false,
            gpFlag: false,
            date: '',
            dateFmt: '',
            addressList: [],
            //phoneRegex: /^[0-9,-]{10,15}$|^$/,
            phoneRegex: /^\+{0,1}[0-9 ]{10,16}$/,
            landlineRegex: /^0[0-9]{10}$/,
            postCodeRegex: /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})$/,
            //phoneRegex: /(\s*\(?(0|\+44)(\s*|-)\d{4}\)?(\s*|-)\d{3}(\s*|-)\d{3}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\)?(\s*|-)\d{3}(\s*|-)\d{4}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{2}\)?(\s*|-)\d{4}(\s*|-)\d{4}\s*)|(\s*(7|8)(\d{7}|\d{3}(\-|\s{1})\d{4})\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\s\d{2}\)?(\s*|-)\d{4,5}\s*)/,
            emailRegex: /^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i,
            dateArr: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
            monthArr: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            yearArr: [],
            dateVal: "",
            monthVal: "",
            yearVal: "",
            dateRegex: /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
            dynamicRegexPattern: /^\+{0,1}[0-9 ]{10,16}$/,
            duplicateYearArray: '',
            formatter: '',
            hasValidDate: false
        },

        computed: {
            dateMask: function () {
                return '##/##/####'
            }
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            var date = new Date().getFullYear();
            console.log(date)
            for (var i = date; i > 1989; i--) {
                this.yearArr.push(i);
            }
            this.isSubmitted = false;
            var disableChild = document.getElementById('1752a966-f49a-4443-baae-ed131ebb477b').lastElementChild;
            var disableParent = document.getElementById('398a82d9-59fe-459c-8d1e-85f803d0319c').lastElementChild;
            var disableProfessional = document.getElementById('96dda9ca-9328-47e8-ac1a-8cdc972df4d0').lastElementChild;
            var profData = document.getElementById('prof_data').innerHTML;
            // try{
            //     profData = JSON.parse(JSON.stringify(profData));
            //     alert(profData)
            // }
            // catch(e){
            //     alert(e)
            // }
            var userRole = document.getElementById('uRole').innerHTML;
            if (userRole) {
                this.elgibilityObj.role = userRole;
                $('input[name=role]').attr("disabled", true);
                $('#loader').hide();
                if (userRole == 'child') {
                    disableParent.style.opacity = '0.6';
                    disableProfessional.style.opacity = '0.6';

                } else if (userRole == 'parent') {
                    disableChild.style.opacity = '0.6';
                    disableProfessional.style.opacity = '0.6';

                } else if (userRole == 'professional') {
                    disableChild.style.opacity = '0.6';
                    disableParent.style.opacity = '0.6';

                }
            }
            this.elgibilityObj.uuid = document.getElementById('uUid').innerHTML;
            //console.log(this.elgibilityObj.uuid)
            this.fetchSavedData();
            //this.initMaps();
            // console.log(fetchJSONFile('/modules/role-module/js/data/gplist.json',undefined))
            this.paramValues = getParameter(location.href);
            $('#loader').hide();
            var gpArray = [];
            // this.getJsonGP();
            // this.getJsonGPPostCode();
            // console.log(this.gpListJson)
            // fetchJSONFile('/modules/role-module/js/data/gplist.json', function(data){
            //     // do something with your data
            //     console.log(data);
            //     gpArray = data
            // });

            // async function asyncCall() {
            //    await  fetchJSONFile('/modules/role-module/js/data/gplist.json', function(data){
            //     // do something with your data
            //     console.log(data);
            //     gpArray = data
            // });
            //   }

            //  console.log(asyncCall())
            //  console.log(gpArray)
        },

        methods: {
            initMaps: function () {
                var availableTutorials = [
                    "ActionScript",
                    "Bootstrap",
                    "C",
                    "C++",
                ];
                $("#automplete-1").autocomplete({
                    source: availableTutorials
                });
            },
            fetchSavedData: function () {
                this.sendObj.uuid = document.getElementById('uUid').innerHTML;
                this.sendObj.role = document.getElementById('uRole').innerHTML;
                if ((this.sendObj.uuid != undefined && this.sendObj.uuid != "") && (this.sendObj.role != undefined && this.sendObj.role != "")) {
                    $.ajax({
                        //  url: API_URI + "/fetchEligibility",
                        url: API_URI + "/fetchEligibility/" + this.sendObj.uuid + "&role=" + this.sendObj.role,
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json',
                        cache: false,
                        // data: JSON.stringify(this.sendObj),
                        success: function (data) {
                            app.setValues(data);
                            $('#loader').hide();
                        },
                        error: function (error) {
                            $('#loader').hide();
                            if (error) {
                                showError(error.responseJSON.message, error.status);
                            }
                            ////console.log(error.responseJSON.message)
                        }
                    });
                } else {
                    if (this.sendObj.role && this.sendObj.role == 'professional' && document.getElementById('prof_data').innerHTML) {
                        var profData = document.getElementById('prof_data').innerHTML;
                        var profData1;
                        try {
                            profData1 = JSON.parse(profData);
                            //alert(profData1)
                        }
                        catch (e) {
                            // alert(e)
                        }
                        //  console.log(profData.professional_manual_address);
                        Vue.set(this.elgibilityObj, "profFirstName", profData1.first_name);
                        Vue.set(this.elgibilityObj, "proflastName", profData1.last_name);
                        Vue.set(this.elgibilityObj, "profEmail", profData1.email);
                        Vue.set(this.elgibilityObj, "profContactNumber", profData1.contact_number);
                        Vue.set(this.elgibilityObj, "profAddress", profData1.address);
                        Vue.set(this.elgibilityObj, "profProfession", profData1.profession);
                        Vue.set(this.elgibilityObj, "professional_contact_type", profData1.professional_contact_type);

                        if (profData1.professional_manual_address && profData1.professional_manual_address.length) {
                            Vue.set(this, "professionalManualAddress", profData1.professional_manual_address);
                            this.setReadonlyState(true);
                        }
                    }
                }
            },
            setValues: function (data) {
                var roleType = document.getElementById('uRole').innerHTML;
                this.patchFlag = true;
                console.log(data)
                if (roleType == "child") {
                    Vue.set(this.elgibilityObj, "role", roleType);
                    Vue.set(this.elgibilityObj, "interpreter", data.need_interpreter);
                    Vue.set(this.elgibilityObj, "childDob", this.convertDate(data.child_dob));
                    this.fetchAgeLogic(data.child_dob, roleType)
                    Vue.set(this.elgibilityObj, "contactParent", data.contact_parent);
                    Vue.set(this.elgibilityObj, "isInformation", data.consent_child);
                    Vue.set(this.elgibilityObj, "contact_parent_camhs", data.contact_parent_camhs);
                    Vue.set(this.elgibilityObj, "reason_contact_parent_camhs", data.reason_contact_parent_camhs);
                    //Vue.set(this.elgibilityObj, "regGpTxt", this.bindGpAddress(data.registered_gp));
                    if (data.registered_gp_postcode) { // bind postcode column for new referrals
                        Vue.set(this.elgibilityObj, "regGpTxt", this.bindGpAddress(data.registered_gp + ',' + data.registered_gp_postcode));
                    }
                    else {// leave postcode column for old referrals
                        Vue.set(this.elgibilityObj, "regGpTxt", this.bindGpAddress(data.registered_gp));
                    }
                    if (data.gp_school) {
                        Vue.set(this.elgibilityObj, "gpSchool", data.gp_school);
                        //Vue.set(this.elgibilityObj, "gpNotCovered",true);
                        this.elgibilityObj.gpNotCovered = true;
                    }


                    $('input[name=role]').attr("disabled", true);
                    this.elgibilityObj.editFlag = "editFlag";
                }
                else if (roleType == "parent") {

                    Vue.set(this.elgibilityObj, "role", roleType);
                    Vue.set(this.elgibilityObj, "interpreter", data[0].need_interpreter);
                    Vue.set(this.elgibilityObj, "childDob", this.convertDate(data[0].parent[0].child_dob));
                    this.fetchAgeLogic(data[0].parent[0].child_dob)
                    Vue.set(this.elgibilityObj, "contactParent", data[0].consent_child);
                    Vue.set(this.elgibilityObj, "isInformation", data[0].consent_child);
                    //Vue.set(this.elgibilityObj, "regGpTxt", this.bindGpAddress(data[0].parent[0].registered_gp, roleType));
                    if (data[0].parent[0].registered_gp_postcode) { // bind postcode column for new referrals
                        Vue.set(this.elgibilityObj, "regGpTxt", this.bindGpAddress(data[0].parent[0].registered_gp + ',' + data[0].parent[0].registered_gp_postcode, roleType));
                    }
                    else {// leave postcode column for old referrals
                        Vue.set(this.elgibilityObj, "regGpTxt", this.bindGpAddress(data[0].parent[0].registered_gp, roleType));
                    }

                    if (data[0].parent[0].gp_school) {
                        Vue.set(this.elgibilityObj, "gpSchool", data[0].parent[0].gp_school);
                        //Vue.set(this.elgibilityObj, "gpNotCovered",true);
                        this.elgibilityObj.gpNotCovered = true;
                    }
                    $('input[name=role]').attr("disabled", true);
                    this.elgibilityObj.editFlag = "editFlag";
                }
                else if (roleType == "professional") {
                    Vue.set(this.elgibilityObj, "role", roleType);
                    Vue.set(this.elgibilityObj, "profDirectService", data[0].service_location);
                    if (data[0].service_location == 'liverpool') {
                        Vue.set(this.elgibilityObj, "liverpoolService", data[0].selected_service);
                    }
                    else {
                        Vue.set(this.elgibilityObj, "seftonService", data[0].selected_service);
                    }
                    Vue.set(this.elgibilityObj, "profFirstName", data[0].professional_firstname);
                    Vue.set(this.elgibilityObj, "proflastName", data[0].professional_lastname);
                    Vue.set(this.elgibilityObj, "profEmail", data[0].professional_email);
                    Vue.set(this.elgibilityObj, "professional_contact_type", data[0].professional_contact_type);
                    Vue.set(this.elgibilityObj, "profContactNumber", data[0].professional_contact_number);
                    Vue.set(this.elgibilityObj, "profChildDob", this.convertDate(data[0].professional[0].child_dob));
                    this.duplicateYearArray = this.elgibilityObj.profChildDob.slice(this.elgibilityObj.profChildDob.length - 4);
                    this.fetchAgeLogic(data[0].professional[0].child_dob, roleType)
                    Vue.set(this.elgibilityObj, "contactProfParent", data[0].consent_parent);
                    Vue.set(this.elgibilityObj, "parentConcernInformation", data[0].consent_child);

                    if (data[0].selected_service == 'Alder Hey - Liverpool CAMHS' || data[0].selected_service == 'Alder Hey - Liverpool EDYS' || data[0].selected_service == 'Alder Hey - Sefton CAMHS' || data[0].selected_service == 'Alder Hey - Sefton EDYS') {
                        Vue.set(this.elgibilityObj, "referral_mode", data[0].referral_mode);
                    }


                    if (data[0].professional_manual_address && data[0].professional_manual_address.length) {
                        Vue.set(this, "professionalManualAddress", data[0].professional_manual_address);
                        this.setReadonlyState(true);
                    }
                    //Vue.set(this.elgibilityObj, "profAddress", data[0].professional_address);
                    console.log(data[0].professional_address_postcode)
                    if (data[0].professional_address_postcode) { // bind postcode column for new referrals
                        Vue.set(this.elgibilityObj, "profAddress", data[0].professional_address + ' ,' + data[0].professional_address_postcode);
                    }
                    else {// leave postcode column for old referrals
                        Vue.set(this.elgibilityObj, "profAddress", data[0].professional_address);
                    }
                    Vue.set(this.elgibilityObj, "profProfession", data[0].professional_profession);
                    //Vue.set(this.elgibilityObj, "regProfGpTxt", this.bindGpAddress(data[0].professional[0].registered_gp, roleType));
                    if (data[0].professional[0].registered_gp_postcode) { // bind postcode column for new referrals
                        Vue.set(this.elgibilityObj, "regProfGpTxt", this.bindGpAddress(data[0].professional[0].registered_gp + ',' + data[0].professional[0].registered_gp_postcode, roleType));
                    }
                    else {// leave postcode column for old referrals
                        Vue.set(this.elgibilityObj, "regProfGpTxt", this.bindGpAddress(data[0].professional[0].registered_gp, roleType));
                    }
                    if (data[0].professional[0].gp_school) {
                        Vue.set(this.elgibilityObj, "gpSchool", data[0].professional[0].gp_school);
                        Vue.set(this.elgibilityObj, "gpNotCoveredProf", true);

                    }

                    $('input[name=role]').attr("disabled", true);
                    this.elgibilityObj.submitProfForm = "true";
                    this.elgibilityObj.editFlag = "editFlag";
                }
                //this.elgibilityObj.editFlag = "true";

            },

            // Getting Manual Address
            getManualAddress: function () {
                $('#roleManualAddressModal').modal('show');
                this.resetAddressModalValues();
            },

            //Adding and Updating a address logic
            upsertAddress: function () {
                manualAddressLogic(this, 'addressData', 'professionalManualAddress', 'roleManualAddressModal', false, 'child');
                this.elgibilityObj.profAddress = "";
                document.getElementById('3ef3160e-50f7-43de-9a6a-842512adad96').style.pointerEvents = "none";
                document.getElementById('3ef3160e-50f7-43de-9a6a-842512adad96').style.opacity = 0.7;
                document.getElementById('c80236ab-b7d6-4ae8-9c0d-89c24c3c763a').style.pointerEvents = "none";
                document.getElementById('c80236ab-b7d6-4ae8-9c0d-89c24c3c763a').style.opacity = 0.5;
            },

            setReadonlyState: function (iDisabled) {
                var textEle = document.getElementById('3ef3160e-50f7-43de-9a6a-842512adad96');
                var buttElem = document.getElementById('c80236ab-b7d6-4ae8-9c0d-89c24c3c763a')
                if (iDisabled) {
                    textEle.style.pointerEvents = "none";
                    textEle.style.opacity = 0.7;
                    buttElem.style.pointerEvents = "none";
                    buttElem.style.opacity = 0.5;
                } else {
                    textEle.style.pointerEvents = "auto";
                    textEle.style.opacity = 1;
                    buttElem.style.pointerEvents = "auto";
                    buttElem.style.opacity = 1;
                }

            },

            //Patching the HouseHold logic
            patchAddress: function (address) {
                patchManualAddress(this, 'addressData', address, 'professionalManualAddress');
                this.prevAddressData = JSON.parse(JSON.stringify(this.professionalManualAddress));
            },

            //Delete manual address logic
            deleteSect3ManualAddress: function () {
                deleteLogicManualAddress(this.professionalManualAddress, this.addressData, this, 'professionalManualAddress',
                    '3ef3160e-50f7-43de-9a6a-842512adad96', 'c80236ab-b7d6-4ae8-9c0d-89c24c3c763a');
                $('#deleteAddressSect1Modal').modal('hide');
            },

            //Resetting the modal values of service data
            resetAddressModalValues: function () {
                this.isAddressFormSubmitted = false;
                this.addressData.addressLine1 = '';
                this.addressData.addressLine2 = '';
                this.addressData.city = '';
                this.addressData.country = '';
                this.addressData.postCode = '';
                this.addressData.mode = '';
            },

            resetAddressValue: function () {
                if (this.addressData.mode && this.addressData.mode === 'add') {
                    this.resetAddressModalValues();
                } else if (this.addressData.mode && this.addressData.mode === 'update') {
                    var prevAddressObj = convertArrayToObj(this.prevAddressData);
                    if (this.addressData.mode === 'update') {
                        if (_.isEqual(this.addressData, prevAddressObj)) {
                            this.addressData = this.addressData;
                        } else {
                            this.professionalManualAddress = [];
                            this.professionalManualAddress.push(prevAddressObj);
                            this.isAddressFormSubmitted = false;
                        }
                        return true;
                    } else {
                        this.resetAddressModalValues();
                    }
                } else {
                    this.isAddressFormSubmitted = false;
                    this.setReadonlyState(false);
                }
            },

            //Function to trim space entered
            trimWhiteSpace: function (event, obj, key) {
                preventWhiteSpaces(event, this, obj, key)
            },

            onChange: function (event) {
                var questionIdentifier = event.target.name;
                var optionValue = event.target.value;
                if (questionIdentifier == "role" || questionIdentifier == "directServices") {
                    this.professionalManualAddress = [];
                    //  this.elgibilityObj.profaboveLimit = "";
                    this.hasValidDate = false;
                    this.setReadonlyState(false);
                    this.resetValues(event.target.form);
                    if (!document.getElementById('prof_data').innerHTML) {
                        this.elgibilityObj.profFirstName = "";
                        this.elgibilityObj.profEmail = "";
                        this.elgibilityObj.profContactNumber = "";
                        this.elgibilityObj.profChildDob = "";
                        this.elgibilityObj.proflastName = "";
                        this.elgibilityObj.profAddress = "";
                        this.elgibilityObj.profProfession = "";
                    }

                }
                if (questionIdentifier != "role" && questionIdentifier == "interpreter" && optionValue == "yes") {
                    this.resetValues(event.target.form);
                    this.hasValidDate = false;
                }
                else if (questionIdentifier == "interpreter" && optionValue == "yes") {
                    this.resetValues(event.target.form);
                }
                else if (questionIdentifier == "belowAgeParent" && optionValue == "no") {
                    this.resetValues(event.target.form);
                    this.elgibilityObj.contactParent = optionValue;
                }
                else if (questionIdentifier == "reasonParentContact" && optionValue == "no") {
                    this.resetValues(event.target.form);
                    this.elgibilityObj.contact_parent_camhs = optionValue;
                }
                else if (questionIdentifier == "reasonParentContact" && optionValue == "yes") {
                    this.elgibilityObj.regGpTxt = "";
                }
                else if (questionIdentifier == "camhsSelect" && optionValue == "no") {
                    this.resetValues(event.target.form);
                    this.elgibilityObj.isInformation = optionValue;
                }
                //for professional
                else if (questionIdentifier == "contactProfParent" && optionValue == "no") {
                    this.resetValues(event.target.form);
                    this.elgibilityObj.contactProfParent = optionValue;
                }
                else if (questionIdentifier == "parentConcernSelect" && optionValue == "no") {
                    this.resetValues(event.target.form);
                    this.elgibilityObj.parentConcernInformation = optionValue;
                }
                else if (questionIdentifier == "directServices") {
                    if (!this.elgibilityObj.profAddress && this.professionalManualAddress.length) {
                        this.setReadonlyState(true);
                    } else {
                        this.setReadonlyState(false);
                    }
                    this.resetValues(event.target.form);
                    this.elgibilityObj.profDirectService = optionValue;
                }
                else if (questionIdentifier == "liverpoolService" || questionIdentifier == "seftonService") {
                    this.resetValues(event.target.form);
                    if (!this.elgibilityObj.profAddress && this.professionalManualAddress.length) {
                        this.setReadonlyState(true);
                    } else {
                        this.setReadonlyState(false);
                    }
                    this.elgibilityObj.profChildDob = "";
                    this.hasValidDate = false;
                }
            },

            resetValues: function (currentForm) {
                var allForms = Array.from(document.forms);
                var formIndex = allForms.indexOf(currentForm);
                for (let i = 0; i < allForms.length; i++) {
                    var attributeValue = $(allForms[i]).data('options');
                    ////console.log(attributeValue + ',' + formIndex + ',' + i)
                    if (formIndex < i) {
                        this.elgibilityObj[attributeValue] = "";
                    }
                    if (formIndex <= i) {
                        this.elgibilityObj.regGpTxt = "";
                        this.elgibilityObj.regProfGpTxt = "";
                    }
                }
                this.isSubmitted = false;
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

            getAddress: function (e) {
                if (e.target.value && !e.target.value.replace(/ /g, "").length) {
                    this.elgibilityObj.regGpTxt = e.target.value.trim();
                    return false;
                }
                if (e && e.isTrusted) {
                    var nameData;
                    var _self = this;
                    var searchTxt = e.target.value;
                    app.elgibilityObj.gpNotCovered = false;
                    //app.elgibilityObj.submitForm = "true";
                    if (searchTxt.length > 2) {
                        var gpLink = API_URI + "/getGpByName/" + searchTxt;
                        $('#showInputLoaderProf').removeClass("d-none").addClass("d-block");
                        $('#addOpacityProf').css('opacity', '0.2');
                        $.ajax({
                            url: gpLink,
                            type: 'get',
                            async: false,
                            success: function (response) {
                                console.log(response)
                                _self.gpListName = [];
                                //app.elgibilityObj.gpErrMsg = "";
                                _self.gpListShow = response;
                                if (response.length <= 0) {
                                    var gpLink = API_URI + "/getGpByPostCode/" + searchTxt;
                                    $.ajax({
                                        url: gpLink,
                                        type: 'get',
                                        async: false,
                                        success: function (response) {
                                            console.log(response)
                                            _self.gpListName = [];
                                            //app.elgibilityObj.gpErrMsg = "";
                                            _self.gpListShow = response
                                            for (i = 0; i < _self.gpListShow.length; i++) {
                                                // //console.log(_self.gpListShow[i].PostCode)
                                                // if (_self.validatePostCode(_self.gpListShow[i].PostCode)) // find postcode fall in within range
                                                _self.gpListName.push(_self.gpListShow[i].Name + "," + _self.gpListShow[i].Postcode);
                                            }
                                            if (_self.gpListName.length == 0) {
                                                app.elgibilityObj.gpErrMsg = "";
                                                // app.elgibilityObj.gpErrLink = "https://www.nhs.uk/Service-Search/other-services/Child%20and%20adolescent%20mental%20health%20services%20(CAMHS)/LocationSearch/2157";
                                                $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                                                $('#addOpacityProf').css('opacity', '1');
                                            }
                                            else {
                                                payload = _self.remove_duplicates(_self.gpListName);
                                                $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                                                $('#addOpacityProf').css('opacity', '1');
                                                $("#gpLocation").autocomplete({
                                                    source: payload,
                                                    select: function (event, ui) {
                                                        _self.elgibilityObj.regGpTxt = ui.item.value;
                                                        // //console.log(app.elgibilityObj.gpNotCovered)
                                                        app.elgibilityObj.gpNotCovered = _self.validatePostCode(_self.elgibilityObj.regGpTxt.substring(_self.elgibilityObj.regGpTxt.indexOf(',') + 1, _self.elgibilityObj.regGpTxt.length))
                                                        if (!app.elgibilityObj.gpNotCovered) {
                                                            _self.gpFlag = true;
                                                            app.elgibilityObj.submitForm = "true";
                                                            app.elgibilityObj.gpErrMsg = "";
                                                            app.elgibilityObj.gpSchool = "";
                                                        }
                                                        else {
                                                            app.elgibilityObj.gpSchool = '';
                                                            app.elgibilityObj.gpErrMsg = "";
                                                            app.elgibilityObj.submitForm = "true";
                                                        }

                                                    },
                                                    close: function () {
                                                        _self.gpFlag = true;
                                                    }
                                                });
                                            }
                                        },
                                        error: function (err) {
                                            $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                                            $('#addOpacityProf').css('opacity', '1');
                                            app.elgibilityObj.gpErrMsg = err.responseJSON.errorText;
                                            app.elgibilityObj.gpErrMsg = "Please enter valid GP address or postcode";
                                            app.elgibilityObj.submitForm = "false";
                                        },
                                    })

                                }
                                else {
                                    _self.gpListShow = response;
                                    for (i = 0; i < _self.gpListShow.length; i++) {
                                        //  if (_self.validatePostCode(_self.gpListShow[i].PostCode)) // find postcode fall in within range
                                        _self.gpListName.push(_self.gpListShow[i].Name + "," + _self.gpListShow[i].Postcode);
                                    }
                                    if (_self.gpListName.length == 0) {
                                        app.elgibilityObj.gpErrMsg = "";
                                        //  app.elgibilityObj.gpErrLink = "https://www.nhs.uk/Service-Search/other-services/Child%20and%20adolescent%20mental%20health%20services%20(CAMHS)/LocationSearch/2157";
                                        $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                                        $('#addOpacityProf').css('opacity', '1');
                                    }
                                    else {
                                        nameData = _self.remove_duplicates(_self.gpListName);
                                        $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                                        $('#addOpacityProf').css('opacity', '1');
                                        $("#gpLocation").autocomplete({
                                            source: nameData,
                                            select: function (event, ui) {
                                                //     //console.log(app.elgibilityObj.gpNotCovered)
                                                _self.elgibilityObj.regGpTxt = ui.item.value;
                                                app.elgibilityObj.gpNotCovered = _self.validatePostCode(_self.elgibilityObj.regGpTxt.substring(_self.elgibilityObj.regGpTxt.indexOf(',') + 1, _self.elgibilityObj.regGpTxt.length))
                                                if (!app.elgibilityObj.gpNotCovered) {
                                                    _self.gpFlag = true;
                                                    app.elgibilityObj.submitForm = "true";
                                                    app.elgibilityObj.gpErrMsg = "";
                                                }
                                                else {
                                                    app.elgibilityObj.gpErrMsg = "";
                                                    app.elgibilityObj.gpSchool = "";
                                                    app.elgibilityObj.submitForm = "true";
                                                }
                                            },
                                            close: function () {
                                                _self.gpFlag = true;
                                            }
                                        });
                                    }
                                }

                            },
                            error: function (err) {
                                $('#showInputLoaderProf').removeClass("d-block").addClass("d-none");
                                $('#addOpacityProf').css('opacity', '1');
                                //app.elgibilityObj.gpErrMsg = err.responseJSON.errorText;
                                app.elgibilityObj.gpErrMsg = "Please enter valid GP address or postcode";
                                app.elgibilityObj.submitForm = "false";
                            },
                        })


                    }
                    else {
                        app.elgibilityObj.gpErrMsg = 'Please enter valid GP address or postcode';
                        app.elgibilityObj.gpSchool = "";
                        app.elgibilityObj.submitForm = "false";
                        $("#gpLocation").autocomplete({
                            source: [],
                            select: function (event, ui) {

                            },
                            close: function () {
                                //
                            }
                        });
                    }
                }
            },

            gpSubmit: function (e) {
                if (e) {
                    e.preventDefault();
                }
            },

            getStringLength: function (str) {
                return str.length;
            },

            setAutocompletePostCode: function (data, postCode) {
                var _self = this;
                $("#gpLocation").autocomplete({
                    source: data,
                    select: function (event, ui) {
                        ////console.log(ui);
                    },
                    response: function (event, ui) {
                        if (ui.content.length == 0) {
                            _self.gpSearchArea(postCode);

                        } else {
                        }
                    }
                });
            },

            gpSearchArea: function (data) {

                var payload;
                var gpLink = "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PostCode=" + postCode;
                $.ajax({
                    url: gpLink,
                    type: 'get',
                    async: false,
                    success: function (response) {
                        _self.gpListShow = response.Organisations;
                        for (i = 0; i < _self.gpListShow.length; i++) {
                            _self.gpListName.push(_self.gpListShow[i].Name + "," + _self.gpListShow[i].PostCode);
                        }
                        payload = _self.gpListName;
                        ////console.log(payload);
                        $("#gpLocation").autocomplete({
                            source: payload,
                            select: function (event, ui) {
                                ////console.log(ui);
                            },
                        });


                    },
                    error: function (err) {
                        // ////console.log(err)
                    },
                })
            },
            getProfAddress: function (e) {
                if (e.target.value && !e.target.value.replace(/ /g, "").length) {
                    this.elgibilityObj.regProfGpTxt = e.target.value.trim();
                    return false;
                }
                if (e && e.isTrusted) {
                    var nameData;
                    var _self = this;
                    var searchTxt = e.target.value;
                    app.elgibilityObj.gpNotCoveredProf = false;
                    //app.elgibilityObj.submitProfForm = "true";
                    if (searchTxt.length > 2) {
                        $('#showInputLoader').removeClass("d-none").addClass("d-block");
                        $('#addOpacity').css('opacity', '0.2');
                        var gpLink = API_URI + "/getGpByName/" + searchTxt;
                        $.ajax({
                            url: gpLink,
                            type: 'get',
                            async: false,
                            success: function (response) {
                                _self.gpListShow = [];
                                _self.gpProfListName = [];
                                //app.elgibilityObj.gpErrMsg = "";
                                _self.gpListShow = response;
                                if (response.length <= 0) {
                                    var gpLink = API_URI + "/getGpByPostCode/" + searchTxt;
                                    $.ajax({
                                        url: gpLink,
                                        type: 'get',
                                        async: false,
                                        success: function (response) {
                                            _self.gpListShow = [];
                                            _self.gpProfListName = [];
                                            // app.elgibilityObj.gpErrMsg = "";
                                            _self.gpListShow = response;
                                            for (i = 0; i < _self.gpListShow.length; i++) {
                                                // if (_self.validatePostCode(_self.gpListShow[i].PostCode)) // find postcode fall in within range
                                                _self.gpProfListName.push(_self.gpListShow[i].Name + ',' + _self.gpListShow[i].Postcode);
                                            }
                                            if (_self.gpProfListName.length == 0) {
                                                app.elgibilityObj.gpErrMsg = "Please enter valid GP address or postcode";
                                                // app.elgibilityObj.gpErrLinkProf = "https://www.nhs.uk/Service-Search/other-services/Child%20and%20adolescent%20mental%20health%20services%20(CAMHS)/LocationSearch/2157";
                                                $('#showInputLoader').removeClass("d-block").addClass("d-none");
                                                $('#addOpacity').css('opacity', '1');
                                            }
                                            else {
                                                //app.elgibilityObj.gpErrLinkProf = "";
                                                payload = _self.remove_duplicates(_self.gpProfListName);
                                                $('#showInputLoader').removeClass("d-block").addClass("d-none");
                                                $('#addOpacity').css('opacity', '1');
                                                $("#gpProfLocation").autocomplete({
                                                    source: payload,
                                                    select: function (event, ui) {
                                                        app.elgibilityObj.regProfGpTxt = ui.item.label;
                                                        app.elgibilityObj.gpNotCoveredProf = _self.validatePostCode(_self.elgibilityObj.regProfGpTxt.substring(_self.elgibilityObj.regProfGpTxt.indexOf(',') + 1, _self.elgibilityObj.regProfGpTxt.length))
                                                        if (!app.elgibilityObj.gpNotCoveredProf) {
                                                            _self.gpFlag = true;
                                                            app.elgibilityObj.submitProfForm = "true";
                                                            app.elgibilityObj.gpErrMsg = "";
                                                        }
                                                        else {
                                                            app.elgibilityObj.submitProfForm = "true";
                                                            app.elgibilityObj.gpSchool = '';
                                                            app.elgibilityObj.gpErrMsg = "";
                                                        }

                                                    },
                                                });
                                            }
                                        },
                                        error: function (err) {

                                            //console.log(err)
                                            $('#showInputLoader').removeClass("d-block").addClass("d-none");
                                            $('#addOpacity').css('opacity', '1');
                                            app.elgibilityObj.gpErrMsg = "Please enter valid GP address or postcode";
                                            app.elgibilityObj.submitProfForm = "false";
                                        },
                                    })

                                }
                                else {
                                    _self.gpListShow = response;
                                    if (_self.gpListShow.length > 0) {
                                        for (i = 0; i < _self.gpListShow.length; i++) {
                                            // if (_self.validatePostCode(_self.gpListShow[i].PostCode)) // find postcode fall in within range
                                            _self.gpProfListName.push(_self.gpListShow[i].Name + ',' + _self.gpListShow[i].Postcode);
                                        }
                                        if (_self.gpProfListName.length == 0) {
                                            app.elgibilityObj.gpErrMsg = "";
                                            //app.elgibilityObj.gpErrLinkProf = "https://www.nhs.uk/Service-Search/other-services/Child%20and%20adolescent%20mental%20health%20services%20(CAMHS)/LocationSearch/2157";
                                            $('#showInputLoader').removeClass("d-block").addClass("d-none");
                                            $('#addOpacity').css('opacity', '1');
                                        }
                                        else {
                                            nameData = _self.remove_duplicates(_self.gpProfListName);
                                            $('#showInputLoader').removeClass("d-block").addClass("d-none");
                                            $('#addOpacity').css('opacity', '1');
                                            $("#gpProfLocation").autocomplete({
                                                source: nameData,
                                                select: function (event, ui) {
                                                    app.elgibilityObj.regProfGpTxt = ui.item.label;
                                                    app.elgibilityObj.gpNotCoveredProf = _self.validatePostCode(_self.elgibilityObj.regProfGpTxt.substring(_self.elgibilityObj.regProfGpTxt.indexOf(',') + 1, _self.elgibilityObj.regProfGpTxt.length))
                                                    if (!app.elgibilityObj.gpNotCoveredProf) {
                                                        _self.gpFlag = true;
                                                        app.elgibilityObj.submitProfForm = "true";
                                                        app.elgibilityObj.gpErrMsg = "";
                                                    }
                                                    else {
                                                        app.elgibilityObj.submitProfForm = "true";
                                                        app.elgibilityObj.gpSchool = '';
                                                        app.elgibilityObj.gpErrMsg = "";
                                                    }
                                                },
                                            });
                                        }
                                    }

                                }

                            },
                            error: function (err) {
                                //console.log(err)
                                $('#showInputLoader').removeClass("d-block").addClass("d-none");
                                $('#addOpacity').css('opacity', '1');
                                app.elgibilityObj.gpErrMsg = "Please enter valid GP address or postcode";
                                app.elgibilityObj.submitProfForm = "false";
                            },
                        })

                    } else {
                        app.elgibilityObj.gpErrMsg = 'Please enter valid GP address or postcode';
                        app.elgibilityObj.gpSchool = "";
                        app.elgibilityObj.submitProfForm = "false";
                        $("#gpProfLocation").autocomplete({
                            source: [],
                            select: function (event, ui) {

                            },
                            close: function () {
                                //
                            }
                        });
                    }
                }
            },

            selectGp: function () {
                ////console.log("erer")
            },

            getDob: function () {
                var selectedDate = this.dateVal + '/' + this.monthVal + '/' + this.yearVal
                // console.log(selectedDate)
                // console.log(this.dateRegex.test(selectedDate));
                if (this.dateRegex.test(selectedDate)) {
                    this.elgibilityObj.childDob = selectedDate;
                    this.changeDob("", selectedDate)
                }
            },

            changeDob: function (e, date) {
                console.log(date)
                if (date != null) {
                    var today = new Date();
                    this.dateFmt = this.setDate(date)
                    var selectedDate = new Date(this.dateFmt);
                    var age = this.diff_years(today, selectedDate);
                    // //console.log(age)
                    ////console.log(age > 19)
                    var roleText = this.elgibilityObj.role;
                    console.log(roleText)
                    if (this.elgibilityObj.isInformation != undefined) {
                        this.elgibilityObj.isInformation = "";
                    }

                    //   ////console.log(age);
                    if (roleText == 'child') {
                        if (age < 14) {
                            this.elgibilityObj.belowAgeLimit = "yes";
                            this.elgibilityObj.aboveLimit = "no";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.contact_parent_camhs = "";
                            this.elgibilityObj.reason_contact_parent_camhs = ""
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.regGpTxt = "";
                        }
                        else if (age > 18) {
                            this.elgibilityObj.aboveLimit = "yes";
                            this.elgibilityObj.belowAgeLimit = "no";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.contact_parent_camhs = "";
                            this.elgibilityObj.reason_contact_parent_camhs = ""
                            this.elgibilityObj.regGpTxt = "";
                        }
                        else {
                            ////console.log("343")
                            this.elgibilityObj.contactParent = "yes";
                            this.elgibilityObj.belowAgeLimit = "no";
                            this.elgibilityObj.aboveLimit = "no";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.regGpTxt = "";
                            this.elgibilityObj.contact_parent_camhs = "";
                            this.elgibilityObj.reason_contact_parent_camhs = ""
                        }
                    }
                    else if (roleText == 'professional') {
                        if (age < 15) {
                            this.elgibilityObj.profBelowAgeLimit = "yes";
                            this.elgibilityObj.profaboveLimit = "";
                            this.elgibilityObj.parentConcern = "";
                            this.elgibilityObj.contactProfParent = "";
                            this.elgibilityObj.parentConcernInformation = "";
                            this.elgibilityObj.childConcernInformation = "";
                            this.elgibilityObj.submitProfForm = "false";
                            this.elgibilityObj.regProfGpTxt = "";
                        }
                        else if (age > 18) {
                            this.elgibilityObj.profaboveLimit = "yes";
                            this.elgibilityObj.profBelowAgeLimit = "";
                            this.elgibilityObj.parentConcern = "";
                            this.elgibilityObj.contactProfParent = "";
                            this.elgibilityObj.parentConcernInformation = "";
                            this.elgibilityObj.childConcernInformation = "";
                            this.elgibilityObj.submitProfForm = "false";
                            this.elgibilityObj.regProfGpTxt = "";
                        }
                        else {
                            this.elgibilityObj.parentConcern = "show";
                            this.elgibilityObj.contactProfParent = "yes";
                            this.elgibilityObj.profBelowAgeLimit = "";
                            this.elgibilityObj.profaboveLimit = "";
                            this.elgibilityObj.parentConcernInformation = "";
                            this.elgibilityObj.childConcernInformation = "";
                            this.elgibilityObj.submitProfForm = "false";
                            this.elgibilityObj.regProfGpTxt = "";
                        }
                    }

                    else if (roleText == 'parent') {
                        console.log(age)
                        if (age > 18) {
                            this.elgibilityObj.aboveLimit = "yes";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.regGpTxt = "";
                        }
                        else {
                            this.elgibilityObj.contactParent = "yes";
                            this.elgibilityObj.belowAgeLimit = "";
                            this.elgibilityObj.aboveLimit = "";
                            this.elgibilityObj.submitForm = "false";
                            this.elgibilityObj.regGpTxt = "";
                        }

                    }
                }
                else {
                    this.patchFlag = true;
                }

            },

            resetFlag: function (e) {
                e.currentTarget.firstElementChild.setAttribute('inputmode', 'none');
                e.currentTarget.firstElementChild.setAttribute('autocomplete', 'off');
                var dynamicHeight;
                var mainWidth = document.getElementById('dobRoleCal').clientWidth;
                if (mainWidth <= 350) {
                    dynamicHeight = e.currentTarget.clientWidth + 10;
                } else {
                    dynamicHeight = e.currentTarget.clientWidth - 10;
                }
                var dob = document.getElementsByClassName('bootstrap-datetimepicker-widget');
                dob[0].style.width = '' + dynamicHeight + 'px';
                this.patchFlag = false;
            },

            changeGP: function () {
                this.submitForm = "true";
            },

            onVaueChange: function (e, type, section, key) {
                // if (isNaN(e.target.value)) {
                //     if (e.target.value.match(/\d+/)) {
                //         e.target.value = e.target.value.match(/\d+/)[0];
                //         this[section][key] = e.target.value;
                //         return false;
                //     } else {
                //         this[section][key] = e.target.value;
                //         return false;
                //     }
                // }
                if (e.target.value && !e.target.value.replace(/ /g, "").length) {
                    this[section][key] = e.target.value.trim();
                    return false;
                }
                if (this.isSubmitted) {
                    var phoneRegex = /(\s*\(?(0|\+44)(\s*|-)\d{4}\)?(\s*|-)\d{3}(\s*|-)\d{3}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\)?(\s*|-)\d{3}(\s*|-)\d{4}\s*)|(\s*\(?(0|\+44)(\s*|-)\d{2}\)?(\s*|-)\d{4}(\s*|-)\d{4}\s*)|(\s*(7|8)(\d{7}|\d{3}(\-|\s{1})\d{4})\s*)|(\s*\(?(0|\+44)(\s*|-)\d{3}\s\d{2}\)?(\s*|-)\d{4,5}\s*)/;
                    var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
                    var emailRegex = new RegExp(/^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i);
                    if (type === 'firstName') {
                        if (e.target.value.length === 0) {
                            this.hasNameReqError = true;
                        } else {
                            if (!nameRegex.test(e.target.value)) {
                                this.hasNameInvalidError = true;
                            } else {
                                this.hasNameInvalidError = false;
                            }
                            this.hasNameReqError = false;
                        }

                    } else if (type === 'email') {
                        if (e.target.value.length === 0) {
                            this.hasEmailInvalidError = false;
                        } else {
                            if (emailRegex.test(e.target.value)) {
                                this.hasEmailInvalidError = false;
                            } else {
                                this.hasEmailInvalidError = true;
                            }
                            //this.hasNameReqError = false;
                        }
                    }

                    else if (type === 'contact') {
                        if (e.target.value.length === 0) {
                            this.hasContactReqError = true;
                            this.hasContactInvalidError = false;
                        } else {
                            if (!phoneRegex.test(e.target.value)) {
                                this.hasContactInvalidError = true;
                            } else {
                                this.hasContactInvalidError = false;
                            }
                            this.hasContactReqError = false;
                        }

                    }
                    else if (type === 'lastName') {
                        if (e.target.value.length === 0) {
                            this.hasNameReqError = true;
                        } else {
                            if (!nameRegex.test(e.target.value)) {
                                this.hasNameInvalidError = true;
                            } else {
                                this.hasNameInvalidError = false;
                            }
                            this.hasNameReqError = false;
                        }

                    }
                }
            },

            save: function () {
                // this.elgibilityObj.login_id = "4218d0fb-59df-4454-9908-33c564802059";
                var emailRegex = new RegExp(/^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i);
                this.isSubmitted = true;
                //var dynamicRegexPattern;
                if (this.elgibilityObj.professional_contact_type == "mobile") {
                    this.dynamicRegexPattern = this.phoneRegex
                } else if (this.elgibilityObj.professional_contact_type == "landline") {
                    this.dynamicRegexPattern = this.landlineRegex;
                }
                var role = this.elgibilityObj.role;
                if (role === 'professional') {
                    this.elgibilityObj.profregistered_gp = this.elgibilityObj.regProfGpTxt;
                    if (this.elgibilityObj.profFirstName && this.elgibilityObj.proflastName && this.elgibilityObj.profContactNumber && this.dynamicRegexPattern.test(this.elgibilityObj.profContactNumber) && this.elgibilityObj.profProfession) {
                        if (this.elgibilityObj.profAddress || this.professionalManualAddress.length) {
                            this.elgibilityObj.professionalManualAddress = this.professionalManualAddress;
                            if (this.elgibilityObj.profEmail) {
                                if (emailRegex.test(this.elgibilityObj.profEmail)) {
                                    $('#loader').show();
                                    var gpArray = (this.elgibilityObj.regProfGpTxt).split(",");
                                    this.elgibilityObj.profRegistered_gp_postcode = gpArray[1]
                                    this.elgibilityObj.profregistered_gp = gpArray[0];

                                    if (this.elgibilityObj.profAddress) {
                                        var profAddresArray = (this.elgibilityObj.profAddress).split(",");
                                        this.elgibilityObj.profAddress_postcode = profAddresArray[profAddresArray.length-1];
                                        var addToSave= this.elgibilityObj.profAddress
                                        var result =  addToSave.substring(0, (addToSave).lastIndexOf(","));
                                        this.elgibilityObj.profAddress = result;
                                    }

                                    if (this.elgibilityObj.childDob) {
                                        this.elgibilityObj.childDob = this.elgibilityObj.childDob.replace(/\s/g, "");
                                    }
                                    if (this.elgibilityObj.profChildDob) {
                                        this.elgibilityObj.profChildDob = this.elgibilityObj.profChildDob.replace(/\s/g, "");
                                    }

                                    if (this.elgibilityObj.liverpoolService != 'Alder Hey - Liverpool CAMHS' && this.elgibilityObj.liverpoolService != 'Alder Hey - Liverpool EDYS' && this.elgibilityObj.seftonService != 'Alder Hey - Sefton CAMHS' && this.elgibilityObj.seftonService != 'Alder Hey - Sefton EDYS') {
                                        this.elgibilityObj.referral_mode = null;
                                    }


                                    this.apiRequest(this.elgibilityObj, role);
                                } else {
                                    scrollToInvalidInput();
                                    return false;
                                }
                            } else {
                                $('#loader').show();
                                if (this.elgibilityObj.childDob) {
                                    this.elgibilityObj.childDob = this.elgibilityObj.childDob.replace(/\s/g, "");
                                }
                                if (this.elgibilityObj.profChildDob) {
                                    this.elgibilityObj.profChildDob = this.elgibilityObj.profChildDob.replace(/\s/g, "");
                                }

                                if (this.elgibilityObj.liverpoolService != 'Alder Hey - Liverpool CAMHS' && this.elgibilityObj.liverpoolService != 'Alder Hey - Liverpool EDYS' && this.elgibilityObj.seftonService != 'Alder Hey - Sefton CAMHS' && this.elgibilityObj.seftonService != 'Alder Hey - Sefton EDYS') {
                                    this.elgibilityObj.referral_mode = null;
                                }
                                this.apiRequest(this.elgibilityObj, role);
                            }
                        }
                        else {
                            scrollToInvalidInput();
                            return false;
                        }
                    } else {
                        scrollToInvalidInput();
                        return false;
                    }
                } else if (role === 'parent') {
                    if (this.elgibilityObj.childDob) {
                        this.elgibilityObj.childDob = this.elgibilityObj.childDob.replace(/\s/g, "");
                    }
                    if (this.elgibilityObj.profChildDob) {
                        this.elgibilityObj.profChildDob = this.elgibilityObj.profChildDob.replace(/\s/g, "");
                    }

                    var gpArray = (this.elgibilityObj.regGpTxt).split(",");
                    this.elgibilityObj.registered_gp_postcode = gpArray[1]
                    this.elgibilityObj.registered_gp = gpArray[0];
                    //console.log(this.elgibilityObj);
                    this.apiRequest(this.elgibilityObj, role);
                }
                else if (role === 'child') {
                    if (this.elgibilityObj.childDob) {
                        this.elgibilityObj.childDob = this.elgibilityObj.childDob.replace(/\s/g, "");
                    }
                    if (this.elgibilityObj.profChildDob) {
                        this.elgibilityObj.profChildDob = this.elgibilityObj.profChildDob.replace(/\s/g, "");
                    }
                    var gpArray = (this.elgibilityObj.regGpTxt).split(",");
                    this.elgibilityObj.registered_gp_postcode = gpArray[1]
                    this.elgibilityObj.registered_gp = gpArray[0];
                    //this.elgibilityObj.registered_gp = this.elgibilityObj.regGpTxt;
                    this.apiRequest(this.elgibilityObj, role);
                }
            },

            selectContactTypeProfessional: function (type) {
                if (type == "mobile") {
                    this.dynamicRegexPattern = this.phoneRegex
                } else if (type == "landline") {
                    this.dynamicRegexPattern = this.landlineRegex;
                }
            },

            checkValue: function (str, max) {
                if (str.charAt(0) !== '0' || str == '00') {
                    var num = parseInt(str);
                    if (isNaN(num) || num <= 0 || num > max) num = 1;
                    str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
                };
                return str;
            },

            preventRefresh: function (e) {
                if (e.which == 32) {
                    e.preventDefault();
                }
                stopRefresh(e);
            },

            isValidDate: function (sText) {
                var reDate = /(?:0[1-9]|[12][0-9]|3[01])\/(?:0[1-9]|1[0-2])\/(?:19|20\d{2})/;
                return reDate.test(sText);
            },

            isFutureDate: function (idate) {
                var today = new Date().getTime(),
                    idate = idate.split("/");
                idate = new Date(idate[2], idate[1] - 1, idate[0]).getTime();
                return (today - idate) < 0 ? true : false;
            },

            checkValidDateMine: function (e) {
                if (e.target.value.length >= 10) {
                    if (this.isValidDate(e.target.value)) {
                        var dateValue = e.target.value;
                        var dateFormat = "DD/MM/YYYY"
                        var utc = moment(dateValue, dateFormat, true)
                        var isUtc = utc.isValid();
                        console.log(isUtc)
                        var currentYear = new Date().getFullYear();
                        var setYearValue = dateValue.split('/');
                        var getYearValue = setYearValue[2];
                        if (currentYear >= Number(getYearValue) && Number(getYearValue) > 1900) {
                            if (this.isFutureDate(e.target.value) || !isUtc) {
                                this.hasValidDate = true;
                                if (this.elgibilityObj.role == 'professional') {
                                    this.elgibilityObj.profBelowAgeLimit = "";
                                    this.elgibilityObj.profaboveLimit = "";
                                    this.elgibilityObj.parentConcern = "";
                                    this.elgibilityObj.contactProfParent = "";
                                    this.elgibilityObj.parentConcernInformation = "";
                                    this.elgibilityObj.childConcernInformation = "";
                                    this.elgibilityObj.submitProfForm = "";
                                    this.elgibilityObj.regProfGpTxt = "";
                                }
                                else if (this.elgibilityObj.role == 'child') {
                                    this.elgibilityObj.belowAgeLimit = "";
                                    this.elgibilityObj.aboveLimit = "";
                                    this.elgibilityObj.contactParent = "";
                                    this.elgibilityObj.contact_parent_camhs = "";
                                    this.elgibilityObj.reason_contact_parent_camhs = ""
                                    this.elgibilityObj.submitForm = "";
                                    this.elgibilityObj.regGpTxt = "";
                                    this.elgibilityObj.isInformation = "";
                                }
                                else {
                                    this.elgibilityObj.aboveLimit = "";
                                    this.elgibilityObj.contactParent = "";
                                    this.elgibilityObj.submitForm = "";
                                    this.elgibilityObj.belowAgeLimit = "";
                                    this.elgibilityObj.regGpTxt = "";
                                    this.elgibilityObj.isInformation = "";
                                }
                            } else {
                                this.hasValidDate = false;
                                this.changeDob("", dateValue)
                            }

                        } else {
                            this.hasValidDate = true;
                            if (this.elgibilityObj.role == 'professional') {
                                this.elgibilityObj.profBelowAgeLimit = "";
                                this.elgibilityObj.profaboveLimit = "";
                                this.elgibilityObj.parentConcern = "";
                                this.elgibilityObj.contactProfParent = "";
                                this.elgibilityObj.parentConcernInformation = "";
                                this.elgibilityObj.childConcernInformation = "";
                                this.elgibilityObj.submitProfForm = "";
                                this.elgibilityObj.regProfGpTxt = "";
                            }
                            else if (this.elgibilityObj.role == 'child') {
                                this.elgibilityObj.belowAgeLimit = "";
                                this.elgibilityObj.aboveLimit = "";
                                this.elgibilityObj.contactParent = "";
                                this.elgibilityObj.contact_parent_camhs = "";
                                this.elgibilityObj.reason_contact_parent_camhs = ""
                                this.elgibilityObj.submitForm = "";
                                this.elgibilityObj.regGpTxt = "";
                                this.elgibilityObj.isInformation = "";
                            }
                            else {
                                this.elgibilityObj.aboveLimit = "";
                                this.elgibilityObj.contactParent = "";
                                this.elgibilityObj.submitForm = "";
                                this.elgibilityObj.belowAgeLimit = "";
                                this.elgibilityObj.regGpTxt = "";
                                this.elgibilityObj.isInformation = "";
                            }
                        }

                    } else {
                        this.hasValidDate = true;
                        if (this.elgibilityObj.role == 'professional') {
                            this.elgibilityObj.profBelowAgeLimit = "";
                            this.elgibilityObj.profaboveLimit = "";
                            this.elgibilityObj.parentConcern = "";
                            this.elgibilityObj.contactProfParent = "";
                            this.elgibilityObj.parentConcernInformation = "";
                            this.elgibilityObj.childConcernInformation = "";
                            this.elgibilityObj.submitProfForm = "";
                            this.elgibilityObj.regProfGpTxt = "";
                        }
                        else if (this.elgibilityObj.role == 'child') {
                            this.elgibilityObj.belowAgeLimit = "";
                            this.elgibilityObj.aboveLimit = "";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.contact_parent_camhs = "";
                            this.elgibilityObj.reason_contact_parent_camhs = ""
                            this.elgibilityObj.submitForm = "";
                            this.elgibilityObj.regGpTxt = "";
                            this.elgibilityObj.isInformation = "";
                        }
                        else {
                            this.elgibilityObj.aboveLimit = "";
                            this.elgibilityObj.contactParent = "";
                            this.elgibilityObj.submitForm = "";
                            this.elgibilityObj.belowAgeLimit = "";
                            this.elgibilityObj.regGpTxt = "";
                            this.elgibilityObj.isInformation = "";
                        }

                    }
                } else {
                    this.hasValidDate = false;
                    if (this.elgibilityObj.role == 'professional') {
                        this.elgibilityObj.profBelowAgeLimit = "";
                        this.elgibilityObj.profaboveLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.elgibilityObj.contactProfParent = "";
                        this.elgibilityObj.parentConcernInformation = "";
                        this.elgibilityObj.childConcernInformation = "";
                        this.elgibilityObj.submitProfForm = "";
                        this.elgibilityObj.regProfGpTxt = "";
                    }
                    else if (this.elgibilityObj.role == 'child') {
                        this.elgibilityObj.belowAgeLimit = "";
                        this.elgibilityObj.aboveLimit = "";
                        this.elgibilityObj.contactParent = "";
                        this.elgibilityObj.contact_parent_camhs = "";
                        this.elgibilityObj.reason_contact_parent_camhs = ""
                        this.elgibilityObj.submitForm = "";
                        this.elgibilityObj.regGpTxt = "";
                        this.elgibilityObj.isInformation = "";
                    }
                    else {
                        this.elgibilityObj.aboveLimit = "";
                        this.elgibilityObj.contactParent = "";
                        this.elgibilityObj.submitForm = "";
                        this.elgibilityObj.belowAgeLimit = "";
                        this.elgibilityObj.regGpTxt = "";
                        this.elgibilityObj.isInformation = "";
                    }

                }
            },

            checkValidDate: function (id, obj, key, e) {
                var dateElement = document.querySelector(id);
                var input = dateElement.value;
                if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);
                var values = input.split('/').map(function (v) {
                    return v.replace(/\D/g, '')
                });
                var currentDate = {
                    year: new Date().getFullYear(),
                    month: parseInt(new Date().getMonth()) + 1,
                    date: new Date().getDate()
                }
                if ((values[2] && values[2] > 2021) || (parseInt(values[2]) === 0)) {
                    values[2] = 2021;
                } else if (values[2] && values[2].length == 4 && values[2] < 1900) {
                    values[2] = 1900;
                }
                if (values[1]) {
                    if (values[2]) {
                        values[1] = (values[1] > currentDate.month && values[2] >= currentDate.year) ? currentDate.month : values[1];
                        values[1] = ("0" + values[1]).slice(-2)
                    }
                    values[1] = this.checkValue(values[1], 12);
                }
                if (values[0]) {
                    if (values[2]) {
                        values[0] = (values[0] > currentDate.date && values[1] >= currentDate.month && values[2] >= currentDate.year) ? currentDate.date : values[0];
                        values[0] = ("0" + values[0]).slice(-2)
                    }
                    values[0] = this.checkValue(values[0], 31);
                }
                var output = values.map(function (v, i) {
                    return v.length == 2 && i < 2 ? v + ' / ' : v;
                });
                copyOutput = JSON.parse(JSON.stringify(values)).map(function (v, i) {
                    return v.length == 2 && i < 2 ? v + '/' : v;
                });
                dateElement.value = output.join('').substr(0, 14);
                this[obj][key] = output.join('').substr(0, 14);
                this.formatter = copyOutput.join('').substr(0, 14);
                if (this.dateRegex.test(this.formatter)) {
                    this.changeDob("", this.formatter)
                }
                else {
                    if (this.elgibilityObj.role == 'professional') {
                        this.elgibilityObj.profBelowAgeLimit = "";
                        this.elgibilityObj.profaboveLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.elgibilityObj.contactProfParent = "";
                        this.elgibilityObj.parentConcernInformation = "";
                        this.elgibilityObj.childConcernInformation = "";
                        this.elgibilityObj.submitProfForm = "";
                        this.elgibilityObj.regProfGpTxt = "";
                    }
                    else if (this.elgibilityObj.role == 'child') {
                        this.elgibilityObj.belowAgeLimit = "";
                        this.elgibilityObj.aboveLimit = "";
                        this.elgibilityObj.contactParent = "";
                        this.elgibilityObj.contact_parent_camhs = "";
                        this.elgibilityObj.reason_contact_parent_camhs = ""
                        this.elgibilityObj.submitForm = "";
                        this.elgibilityObj.regGpTxt = "";
                        this.elgibilityObj.isInformation = "";
                    }
                    else {
                        this.elgibilityObj.aboveLimit = "";
                        this.elgibilityObj.contactParent = "";
                        this.elgibilityObj.submitForm = "";
                        this.elgibilityObj.belowAgeLimit = "";
                        this.elgibilityObj.regGpTxt = "";
                        this.elgibilityObj.isInformation = "";
                    }

                }

            },

            apiRequest: function (payload, role) {
                if (role == "professional") {
                    payload.prof_ChildDob = this.dateFmt;
                    if (payload.liverpoolService == "") {
                        payload.selectedService = payload.seftonService;
                    }
                    else {
                        payload.selectedService = payload.liverpoolService;
                    }
                }
                else {
                    payload.child_Dob = this.dateFmt;
                }
                console.log(payload)
                var _self = this;
                $.ajax({
                    url: API_URI + "/eligibility",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    cache: false,
                    success: function (data) {
                        _self.isSubmitted = false;
                        if (role === 'professional') {
                            _self.resetValidation();
                        }
                        if (_self.paramValues != undefined) {
                            if (_self.paramValues[0] == "sec5back") {
                                location.href = "/review";
                            }
                            else {
                                var url = location.href;
                                ////console.log(url.substring(req.url.indexOf("?") + 1));
                                location.href = "/about?" + url.substring(url.indexOf("?") + 1);
                            }
                        }
                        else {
                            location.href = "/about";
                        }

                        //location.href = redirectUrl(url, "about", data.userid, role);
                        // if (_self.paramValues != undefined && _self.paramValues[0] == "loginFlag") {
                        //     var url = window.location.href.split('?')[0];
                        //     location.href = redirectUrl(url, "about", data.userid, role);
                        // }
                        // else {
                        //     location.href = redirectUrl(location.href, "about", data.userid, role);
                        // }

                    },
                    error: function (error) {
                        $('#loader').hide();
                        if (error) {
                            //console.log(error.responseJSON.message)
                            showError(error.responseJSON.message, error.status);
                        }
                    }
                });
            },


            resetValidation: function () {
                this.hasNameInvalidError = false;
                this.hasNameReqError = false;
                this.hasEmailInvalidError = false;
                this.hasContactInvalidError = false;
                this.hasContactReqError = false;
            },

            diff_years: function (dt2, dt1) {
                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                // return Math.abs(Math.round(diff / 365.25));
                return Math.abs(diff / 365.25);
            },

            convertDate: function (dbDate) {
                var date = new Date(dbDate)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();

                var mmChars = mm.split('');
                var ddChars = dd.split('');
                var showDate = (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + yyyy
                this.dateFmt = yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0])
                return showDate;
            },

            setDate: function (dbDate) {
                var dateArray = dbDate.split("/");
                var toOldFmt = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
                var date = new Date(toOldFmt)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();

                var mmChars = mm.split('');
                var ddChars = dd.split('');
                var showDate = (ddChars[1] ? dd : "0" + ddChars[0]) + '/' + (mmChars[1] ? mm : "0" + mmChars[0]) + '/' + yyyy
                return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
            },

            fetchAgeLogic: function (dbdob, roleText) {
                var today = new Date();
                var selectedDate = new Date(dbdob);
                // console.log(selectedDate)
                this.formatDateToString(selectedDate)
                var age = this.diff_years(today, selectedDate);
                console.log(age)
                if (roleText == 'child') {
                    if (age < 14) {

                        this.elgibilityObj.belowAgeLimit = "yes";
                        this.elgibilityObj.aboveLimit = "no";
                        this.elgibilityObj.camhs = "";
                        this.elgibilityObj.submitForm = "false";
                    }
                    else if (age > 19) {
                        this.elgibilityObj.boveLimit = "yes";
                        this.elgibilityObj.belowAgeLimit = "no";
                        this.elgibilityObj.camhs = "";
                        this.elgibilityObj.submitForm = "false";
                    }
                    else {
                        this.elgibilityObj.camhs = "show";
                        this.elgibilityObj.belowAgeLimit = "no";
                        this.elgibilityObj.aboveLimit = "no";
                        this.elgibilityObj.submitForm = "false";
                    }
                }
                else if (roleText == 'professional') {
                    if (age < 15) {
                        this.elgibilityObj.profBelowAgeLimit = "yes";
                        this.elgibilityObj.profaboveLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.elgibilityObj.submitProfForm = "false";
                    }
                    else if (age > 18) {
                        this.elgibilityObj.profaboveLimit = "yes";
                        this.elgibilityObj.profBelowAgeLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.elgibilityObj.submitProfForm = "false";
                    }
                    else {
                        this.elgibilityObj.parentConcern = "show";
                        this.elgibilityObj.profBelowAgeLimit = "";
                        this.elgibilityObj.profaboveLimit = "";
                        this.elgibilityObj.submitProfForm = "false";
                    }
                }

                else if (roleText == 'parent') {
                    if (age > 18) {
                        this.elgibilityObj.aboveLimit = "yes";
                        this.elgibilityObj.camhs = "";
                        this.elgibilityObj.submitForm = "false";
                    }
                    else {
                        this.elgibilityObj.camhs = "show";
                        this.elgibilityObj.belowAgeLimit = "";
                        this.elgibilityObj.aboveLimit = "";
                        this.elgibilityObj.submitForm = "false";
                    }

                }



            },

            formatDateToString: function (inputdate) {
                //  console.log(inputdate)
                var date = new Date(inputdate)
                // console.log(date)
                // 01, 02, 03, ... 29, 30, 31
                this.dateVal = (date.getDate() < 10 ? '0' : '') + date.getDate();
                // 01, 02, 03, ... 10, 11, 12
                this.monthVal = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
                // 1970, 1971, ... 2015, 2016, ...
                this.yearVal = date.getFullYear();

                // create the format you want
                //return (dd + "-" + MM + "-" + yyyy);
            },

            bindGpAddress: function (gpAddress, role) {
                if (role == "professional") {
                    if (gpAddress != undefined || gpAddress != "") {
                        this.submitProfForm = "true";
                        return gpAddress;
                    }
                }
                else {
                    if (gpAddress != undefined || gpAddress != "") {
                        this.elgibilityObj.submitForm = "true";
                        return gpAddress;
                    }
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

            restrictDate: function () {

                var dtToday = new Date();

                var month = dtToday.getMonth() + 1;
                var day = dtToday.getDate();
                var year = dtToday.getFullYear();

                if (month < 10)
                    month = '0' + month.toString();
                if (day < 10)
                    day = '0' + day.toString();

                var currentDate = year + '-' + month + '-' + day;

                return currentDate;

            },

            remove_duplicates: function (arr) {
                var obj = {};
                var ret_arr = [];
                for (var i = 0; i < arr.length; i++) {
                    obj[arr[i]] = true;
                }
                for (var key in obj) {
                    ret_arr.push(key);
                }
                return ret_arr;
            },

            clearGP: function (e) {
                if (e.target.value && !e.target.value.replace(/ /g, "").length) {
                    this.elgibilityObj.reason_contact_parent_camhs = e.target.value.trim();
                    return false;
                }
                var reasonCamhs = e.target.value;
                if (reasonCamhs.length == 0) {
                    this.elgibilityObj.regGpTxt = "";

                }
            },

            validatePostCode: function (postCode) {
                var isRange = true;
                if (postCode) {
                    var index = ((postCode).substring(0, postCode.indexOf(' '))).replace(/\D/g, '');
                    if ((postCode.substring(0, 1) == "L" && (postCode.substring(0, 1) == "L" && (postCode.substring(1, 2).toLowerCase() == postCode.substring(1, 2).toUpperCase()))) && (index >= 1 && index <= 38)) {
                        isRange = false;
                        if (index == 26 || index == 28 || index == 32 || index == 33 || index == 34 || index == 35 || index == 36) {
                            isRange = true;
                        }
                    }
                    else if (postCode.substring(0, 2) == "PR" && (index == 8 || index == 9)) {
                        isRange = false
                    }
                }
                if (postCode && postCode == 'L14 0JE') {
                    var isRange = true;
                }
                return isRange;
            },

            changePrevAns: function (attributeValue, inputId) {
                this.elgibilityObj[attributeValue] = "";
                document.getElementById(inputId).focus();
            },

            getAddressPostcode: function (e) {
                var searchPostCode = e.target.value;
                // console.log(this.getStringLength(searchPostCode))
                if (searchPostCode.length > 0);
                {
                    var _self = this;
                    var addressApi = "https://api.getAddress.io/autocomplete/"+searchPostCode+"?api-key=T6dpcGc28kOgJgJxd03Qhw34224"
                    $.ajax({
                        url: addressApi,
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (data) {
                            console.log(data)
                            // _self.addressList = [];
                            // for (i = 0; i < data.Summaries.length; i++) {
                            //     console.log(data.Summaries[i].StreetAddress + ',' + searchPostCode)
                            //     _self.addressList.push(data.Summaries[i].StreetAddress + ',' + searchPostCode);
                            // }
                            // // var addList=[];
                            // addList = _self.addressList;
                            // console.log(addList)
                            // if (addList > 0) {
                            //     $("#postCodeAddress").autocomplete({
                            //         source: addList,
                            //         select: function (event, ui) {
                            //             console.log(event)
                            //         },
                            //         close: function () {

                            //         }
                            //     });
                            // }
                        },
                        error: function (error) {
                        }
                    });
                }
            },

            customLabel: function (option) {
                return option;
            },

            updateSelected: function (value) {
                if (value & value.length) {
                    this.selectedResources.push(resource);
                }
                this.optionsProxy = []
            },

            cdnRequest: function (value) {
                this.addressOptions = [];
                if (value && this.postCodeRegex.test(value)) {
                    var _self = this;
                    _self.addressList = [];
                    _self.showLoadingSpinner = true;
                    var addressApi = "https://api.getAddress.io/autocomplete/"+value+"?api-key=T6dpcGc28kOgJgJxd03Qhw34224&all=true"
                    $.ajax({
                        url: addressApi,
                        type: 'get',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (data) {
                        console.log("🚀 ~ file: role.js ~ line 1835 ~ data", data)
                            if (data.Error && Object.keys(data.Error).length) {
                                _self.showLoadingSpinner = false;
                                return false;
                            }
                            if (data.suggestions && data.suggestions.length) {
                                for (i = 0; i < data.suggestions.length; i++) {
                                    _self.addressList.push(data.suggestions[i].address+ ',' + value);
                                }
                                _self.addressOptions = _self.addressList;
                                _self.showLoadingSpinner = false;
                            } else {
                                _self.showLoadingSpinner = false;
                            }
                        },
                        error: function (error) {
                            _self.showLoadingSpinner = false;
                        }
                    });
                }

            },

            searchQuery: function (value) {
                this.cdnRequest(value)
            },

            removeDependency: function (index) {
                this.selectedResources.splice(index, 1)
            },

            // getJsonGP: function (refObj) {
            //     var _self = this;
            //     ////console.log(refObj);
            //     $.ajax({
            //         url: API_URI + "/getGpByName/liv",
            //         type: 'get',
            //         dataType: 'json',
            //         contentType: 'application/json',
            //         cache: false,
            //         success: function (data) {
            //             console.log(data)
            //             _self.gpListJson = data;
            //         },
            //         error: function (error) {
            //             if (error) {
            //                 console.log(error)
            //                 showError(error.responseJSON.message, error.status);
            //             }
            //         }
            //     });
            // },
            // getJsonGPPostCode: function (refObj) {
            //     var _self = this;
            //     ////console.log(refObj);
            //     $.ajax({
            //         url: API_URI + "/getGpByPostCode/L20",
            //         type: 'get',
            //         dataType: 'json',
            //         contentType: 'application/json',
            //         cache: false,
            //         success: function (data) {
            //             console.log(data)
            //             _self.gpListJsonPostCode = data;
            //         },
            //         error: function (error) {
            //             if (error) {
            //                 console.log(error)
            //                 showError(error.responseJSON.message, error.status);
            //             }
            //         }
            //     });
            // },
        }
    })

});