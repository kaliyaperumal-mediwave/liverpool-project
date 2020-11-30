var API_URI = "/modules/about-module";
$(document).ready(function () {

    var app = new Vue({
        el: '#about-form',
        data: {
            labelToDisplay: "",
            aboutObj: {},
            childDob: "",
            showBelowAge: "",
            submitForm: "",
            selectedChildAddress: "",
            selectedParentAddress: "",
            empClgSchool: "",
            saveAndCont: "",
            headerToDisplay: "",
            edFlag: false,
            sendObj: {},
            sec2dynamicLabel: {},
            houseHoldData: {
                name: '',
                relationShip: '',
                dob: '',
                profession: ''
            },
            allHouseHoldMembers: [],
            isHouseHoldFormSubmitted: false
        },
        mounted: function () {
            debugger;
            var _self = this;
            $('#houseHoldDate').datepicker({

                dateFormat: 'yy-mm-dd',
                duration: "fast",
                changeMonth: true,
                changeYear: true,
                autoSize: true,
                gotoCurrent: true,
                // showOptions: {
                //      direction: "down" 
                //     },
                // showOn: "both",
                // showButtonPanel:true,
                // showAnim: "slideDown",
                setDate: new Date(),
                minDate: new Date(1950, 10 - 1, 25),
                maxDate: '+30Y',
                yearRange: '1950:c',
                onSelect: function (dateText) {
                    debugger;
                    // $(this)[0].dispatchEvent(new Event('input', { 'bubbles': true }))
                    _self.houseHoldData.dob = dateText
                },
            },
            );
            this.sec2dynamicLabel = section2Labels;
            var roleType = _self.getUrlVars()["role"]
            _self.headerToDisplay = roleType;
            _self.labelToDisplay = roleType;

            google.maps.event.addDomListener(window, 'load', _self.initialize);

            if (_self.getUrlVars()['edt'] == 1) {
                _self.fetchSavedData()
            }
            else {


                console.log("if else")
            }


        },
        methods: {
            clearDate: function (e) {
                if (e.keyCode == 8 || e.keyCode == 46) {
                    $('#houseHoldDate').datepicker('setDate', null);
                    // $('input.hasDatepicker').val('');
                    this.houseHoldData.dob = "";
                }
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

            setMaxDate: function () {
                var roleType = this.getUrlVars()["role"]
                var today = this.restrictDate();
                if (roleType == "child") {
                    console.log("--------------")
                    document.getElementById("txtHseDobChild").setAttribute("max", today);
                }
                else if (roleType == "parent") {
                    document.getElementById("txtHseDobParent").setAttribute("max", today);
                }
                else if (roleType == "professional") {
                    document.getElementById("txtHseDobProf").setAttribute("max", today);
                }
            },
            fetchSavedData: function () {
                console.log("if")
                this.sendObj.uuid = this.getUrlVars()['userid'];
                this.sendObj.role = this.getUrlVars()['role'];
                console.log(this.sendObj);
                // var roleType=new URL(location.href).searchParams.get('role')
                $.ajax({
                    url: API_URI + "/fetchAbout",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        //    alert("section 1 saved.");
                        //   console.log(data);
                        app.setValues(data);

                    },
                });
            },

            setValues: function (data) {
                //console.log(data);
                var roleType = this.getUrlVars()["role"]
                if (roleType == "child") {
                    Vue.set(this.aboutObj, "childNHS", data.child_NHS);
                    Vue.set(this.aboutObj, "childName", data.child_name);
                    Vue.set(this.aboutObj, "childEmail", data.child_email);
                    Vue.set(this.aboutObj, "childContactNumber", data.child_contact_number);
                    Vue.set(this.aboutObj, "childAddress", data.child_address);
                    Vue.set(this.aboutObj, "sendPost", data.can_send_post);
                    Vue.set(this.aboutObj, "childGender", data.child_gender);
                    Vue.set(this.aboutObj, "childGenderBirth", data.child_gender_birth);
                    Vue.set(this.aboutObj, "childSexualOrientation", data.child_sexual_orientation);
                    Vue.set(this.aboutObj, "childEthnicity", data.child_ethnicity);
                    Vue.set(this.aboutObj, "houseHoldName", data.child_household_name);
                    Vue.set(this.aboutObj, "houseHoldRelationship", data.child_household_relationship);
                    Vue.set(this.aboutObj, "childHouseHoldDob", this.convertDate(data.child_household_dob));
                    this.fetchAgeLogic(data.child_household_dob);
                    Vue.set(this.aboutObj, "houseHoldProfession", data.child_household_profession);
                    Vue.set(this.aboutObj, "childCareAdult", data.child_care_adult);
                    Vue.set(this.aboutObj, "houseHoldName", data.child_household_name);
                    Vue.set(this.aboutObj, "parentName", data.parent[0].parent_name);
                    Vue.set(this.aboutObj, "parentContactName", data.parent[0].responsibility_parent_name);
                    Vue.set(this.aboutObj, "parentialResponsibility", data.parent[0].parential_responsibility);
                    Vue.set(this.aboutObj, "childParentRelationship", data.parent[0].child_parent_relationship);
                    Vue.set(this.aboutObj, "parentContactNumber", data.parent[0].parent_contact_number);
                    Vue.set(this.aboutObj, "parentEmail", data.parent[0].parent_email);
                    Vue.set(this.aboutObj, "parentSameHouse", data.parent[0].parent_same_house);
                    Vue.set(this.aboutObj, "selectedParentAddress", data.parent[0].parent_address);
                    Vue.set(this.aboutObj, "legalCareStatus", data.parent[0].legal_care_status);
                    document.getElementById("showAdToast").style.display = "block";
                    document.getElementById("showAdBtn").style.display = "block";


                }
                else if (roleType == "parent") {

                    Vue.set(this.aboutObj, "childNHS", data[0].parent[0].child_NHS);
                    Vue.set(this.aboutObj, "childName", data[0].parent[0].child_name);
                    Vue.set(this.aboutObj, "childEmail", data[0].parent[0].child_email);
                    Vue.set(this.aboutObj, "childContactNumber", data[0].parent[0].child_contact_number);
                    Vue.set(this.aboutObj, "childAddress", data[0].parent[0].child_address);
                    Vue.set(this.aboutObj, "sendPost", data[0].parent[0].can_send_post);
                    Vue.set(this.aboutObj, "childGender", data[0].parent[0].child_gender);
                    Vue.set(this.aboutObj, "childGenderBirth", data[0].parent[0].child_gender_birth);
                    Vue.set(this.aboutObj, "childSexualOrientation", data[0].parent[0].child_sexual_orientation);
                    Vue.set(this.aboutObj, "childEthnicity", data[0].parent[0].child_ethnicity);
                    Vue.set(this.aboutObj, "houseHoldName", data[0].parent[0].child_household_name);
                    Vue.set(this.aboutObj, "houseHoldRelationship", data[0].parent[0].child_household_relationship);
                    Vue.set(this.aboutObj, "childHouseHoldDob", this.convertDate(data[0].parent[0].child_household_dob));
                    this.fetchAgeLogic(data[0].parent[0].child_household_dob);
                    Vue.set(this.aboutObj, "houseHoldProfession", data[0].parent[0].child_household_profession);
                    Vue.set(this.aboutObj, "childCareAdult", data[0].parent[0].child_care_adult);
                    Vue.set(this.aboutObj, "houseHoldName", data[0].parent[0].child_household_name);
                    Vue.set(this.aboutObj, "parentName", data[0].parent_name);
                    Vue.set(this.aboutObj, "parentContactName", data[0].responsibility_parent_name);
                    Vue.set(this.aboutObj, "parentialResponsibility", data[0].parential_responsibility);
                    Vue.set(this.aboutObj, "childParentRelationship", data[0].child_parent_relationship);
                    Vue.set(this.aboutObj, "parentContactNumber", data[0].parent_contact_number);
                    Vue.set(this.aboutObj, "parentEmail", data[0].parent_email);
                    Vue.set(this.aboutObj, "parentSameHouse", data[0].parent_same_house);
                    Vue.set(this.aboutObj, "selectedParentAddress", data[0].parent_address);
                    Vue.set(this.aboutObj, "legalCareStatus", data[0].legal_care_status);
                    document.getElementById("showAdToast").style.display = "block";
                    document.getElementById("showAdBtn").style.display = "block";

                }

                else if (roleType == "professional") {
                    Vue.set(this.aboutObj, "childNHS", data[0].parent[0].child_NHS);
                    Vue.set(this.aboutObj, "childName", data[0].parent[0].child_name);
                    Vue.set(this.aboutObj, "childEmail", data[0].parent[0].child_email);
                    Vue.set(this.aboutObj, "childContactNumber", data[0].parent[0].child_contact_number);
                    Vue.set(this.aboutObj, "childAddress", data[0].parent[0].child_address);
                    Vue.set(this.aboutObj, "sendPost", data[0].parent[0].can_send_post);
                    Vue.set(this.aboutObj, "childGender", data[0].parent[0].child_gender);
                    Vue.set(this.aboutObj, "childGenderBirth", data[0].parent[0].child_gender_birth);
                    Vue.set(this.aboutObj, "childSexualOrientation", data[0].parent[0].child_sexual_orientation);
                    Vue.set(this.aboutObj, "childEthnicity", data[0].parent[0].child_ethnicity);
                    Vue.set(this.aboutObj, "houseHoldName", data[0].parent[0].child_household_name);
                    Vue.set(this.aboutObj, "houseHoldRelationship", data[0].parent[0].child_household_relationship);
                    Vue.set(this.aboutObj, "childHouseHoldDob", this.convertDate(data[0].parent[0].child_household_dob));
                    this.fetchAgeLogic(data[0].parent[0].child_household_dob);
                    Vue.set(this.aboutObj, "houseHoldProfession", data[0].parent[0].child_household_profession);
                    Vue.set(this.aboutObj, "childCareAdult", data[0].parent[0].child_care_adult);
                    Vue.set(this.aboutObj, "houseHoldName", data[0].parent[0].child_household_name);
                    Vue.set(this.aboutObj, "parentName", data[0].parent_name);
                    Vue.set(this.aboutObj, "parentContactName", data[0].responsibility_parent_name);
                    Vue.set(this.aboutObj, "parentialResponsibility", data[0].parential_responsibility);
                    Vue.set(this.aboutObj, "childParentRelationship", data[0].child_parent_relationship);
                    Vue.set(this.aboutObj, "parentContactNumber", data[0].parent_contact_number);
                    Vue.set(this.aboutObj, "parentEmail", data[0].parent_email);
                    Vue.set(this.aboutObj, "parentSameHouse", data[0].parent_same_house);
                    Vue.set(this.aboutObj, "selectedParentAddress", data[0].parent_address);
                    Vue.set(this.aboutObj, "legalCareStatus", data[0].legal_care_status);
                    Vue.set(this.aboutObj, "parentUUID", data[0].uuid);
                    document.getElementById("showAdToast").style.display = "block";
                    document.getElementById("showAdBtn").style.display = "block";
                }
            },
            backElgibility: function () {
                var uid = this.getUrlVars()['userid'];
                var role = this.getUrlVars()['role'];
                location.href = "/role?userid=" + uid + "&role=" + role + "&edt=1";
            },
            initialize: function () {
                var _self = this;
                var autoCompleteChild;
                var houseAddress;
                autoCompleteChild = new google.maps.places.Autocomplete((document.getElementById('txtChildAddress')), {
                    types: ['geocode'],
                });
                houseAddress = new google.maps.places.Autocomplete((document.getElementById('educLocation')), {
                    types: ['geocode'],
                });
                google.maps.event.addListener(autoCompleteChild, 'place_changed', function () {
                    console.log('place chnaged ', autoCompleteChild.getPlace().formatted_address)
                    _self.selectedChildAddress = autoCompleteChild.getPlace().formatted_address;
                    _self.aboutObj.childAddress = _self.selectedChildAddress;
                    console.log(_self.selectedChildAddress)
                    console.log('========')
                });
                var autoCompleteParent;
                autoCompleteParent = new google.maps.places.Autocomplete((document.getElementById('txtParentAddress')), {
                    types: ['geocode'],
                });
                google.maps.event.addListener(autoCompleteParent, 'place_changed', function () {
                    _self.selectedParentAddress = autoCompleteParent.getPlace().formatted_address;
                    _self.aboutObj.selectedParentAddress = _self.selectedParentAddress;
                    document.getElementById("showAdToast").style.display = "block";
                    document.getElementById("showAdBtn").style.display = "block";
                });

                google.maps.event.addListener(houseAddress, 'place_changed', function () {
                    debugger;
                    _self.houseHoldData.profession = houseAddress.getPlace().formatted_address;
                });




                // this.setMaxDate();
                // var autoCompleteSchClg;
                // autoCompleteSchClg = new google.maps.places.Autocomplete((document.getElementById('txtEmpClg')), {
                //     types: ['geocode'],
                // });
                // google.maps.event.addListener(autoCompleteSchClg, 'place_changed', function () {
                //     _self.empClgSchool = autoCompleteSchClg.getPlace().formatted_address;
                // });
                _self.setMaxDate();
            },

            onChange: function (event) {
                var optionTxt = event.target.name;

                console.log(optionTxt);

                if (optionTxt == "sendPost") {
                    this.setMaxDate();
                }

                if (optionTxt == "parentialResponsibility") {
                    this.aboutObj.parentContactName = "";
                    this.aboutObj.childParentRelationship = "";
                    this.aboutObj.parentContactNumber = "";
                    this.aboutObj.parentEmail = "";
                }

                if (optionTxt == "parentialResponsibility" && this.aboutObj.parentSameHouse != undefined) {
                    this.aboutObj.parentSameHouse = "";
                    this.aboutObj.legalCareStatus = "";
                    this.saveAndCont = 'false';
                    document.getElementById("showAdToast").style.display = "none";
                    document.getElementById("showAdBtn").style.display = "none";
                    document.getElementById('txtParentAddress').value = "";
                }
                if (optionTxt == "parentSameHouseYes") {
                    document.getElementById("showAdToast").style.display = "none";
                    document.getElementById("showAdBtn").style.display = "none";
                    document.getElementById('txtParentAddress').value = "";
                }

                if (optionTxt == "legalCare") {
                    this.saveAndCont = 'true';
                }
                if (optionTxt == "parentSameHouseYes") {
                    this.aboutObj.legalCareStatus = "";
                    this.aboutObj.selectedParentAddress = "";
                    this.saveAndCont = 'false';
                }

                this.submitForm = "yes";

            },
            changeDob: function (event) {
                var today = new Date();
                var selectedDate = new Date(event.target.value);
                var age = this.diff_years(today, selectedDate);
                if (age < 18) {
                    this.showBelowAge = "yes";
                }
                else {
                    this.showBelowAge = "";

                }
            },
            saveAbout: function () {
                var _self = this;
                var userid = this.getUrlVars()['userid'];
                var role = this.getUrlVars()['role'];
                this.aboutObj.editFlag = this.getUrlVars()['edt'];
                this.aboutObj.userid = userid;
                this.aboutObj.role = role;
                this.aboutObj.childAddress = _self.selectedChildAddress;
                this.aboutObj.parentAddress = _self.selectedParentAddress;
                //  console.log(this.aboutObj);

                $.ajax({
                    url: API_URI + "/about",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.aboutObj),
                    success: function (data) {
                        //  alert("section 2 saved.");                     
                        if (_self.getUrlVars()["edt"] == null) {
                            location.href = "/education?userid=" + data.userid + "&role=" + role;
                        }
                        else {
                            history.back();
                        }

                    },

                });


            },
            diff_years: function (dt2, dt1) {
                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                return Math.abs(Math.round(diff / 365.25));
            },

            convertDate: function (dbDate) {
                var date = new Date(dbDate)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth() + 1).toString();
                var dd = date.getDate().toString();

                var mmChars = mm.split('');
                var ddChars = dd.split('');
                this.fetchAgeLogic(dbDate);

                return yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
            },

            fetchAgeLogic: function (dob) {
                console.log(dob)
                var today = new Date();
                var selectedDate = new Date(dob);
                var age = this.diff_years(today, selectedDate);
                if (age < 18) {
                    this.showBelowAge = "yes";
                }
                else {
                    this.showBelowAge = "";

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

            //Adding and Updating a HouseHold logic
            upsertHouseHold() {
                this.isHouseHoldFormSubmitted = true;
                var houseHoldForm = this.houseHoldData;
                var modal = document.getElementById('closeModal');
                if (houseHoldForm.name) {
                    if (houseHoldForm.mode === 'update') {
                        this.allHouseHoldMembers = this.allHouseHoldMembers.map(function (it) {
                            if (it.mode === 'update' && it.id === houseHoldForm.id) {
                                it = JSON.parse(JSON.stringify(houseHoldForm));
                                delete it.mode;
                                return it;
                            }
                            else {
                                delete it.mode;
                                return it;
                            }
                        });

                    } else {
                        houseHoldForm.id = uuidV4();
                        houseHoldForm.mode = 'add';
                        this.allHouseHoldMembers.push(JSON.parse(JSON.stringify(houseHoldForm)));
                    }
                    this.resetModalValues();
                    modal.setAttribute("data-dismiss", "modal");

                } else {
                    modal.removeAttribute("data-dismiss", "modal");
                    return;
                }

            },
            //Patching the service logic
            patchService(houseHold) {
                var houseHoldForm = this.houseHoldData;
                houseHoldForm.name = houseHold.name;
                houseHoldForm.relationShip = houseHold.relationShip;
                houseHoldForm.dob = houseHold.dob;
                houseHoldForm.profession = houseHold.profession;
                houseHoldForm.id = houseHold.id;
                houseHoldForm.mode = 'update';
                this.allHouseHoldMembers.map(function (i) {
                    if (i.id === houseHold.id) {
                        i.mode = "update";
                    } else {
                        delete i.mode;
                    }

                });
            },

            //Delete service logic
            deleteService(service) {
                deleteLogic(this.allHouseHoldMembers, service, this, 'allHouseHoldMembers')
            },

            //Resetting the modal values of service data
            resetModalValues() {
                this.isHouseHoldFormSubmitted = false;
                this.houseHoldData.name = '';
                this.houseHoldData.relationShip = '';
                this.houseHoldData.dob = '';
                this.houseHoldData.profession = '';
                this.houseHoldData.mode = '';
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

            }
        }

    })
});