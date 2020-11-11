
var API_URI = "/modules/education-employment-module";

$(document).ready(function () {
    var app = new Vue({
        el: '#education-form',
        data: {
            labelToDisplay: "",
            professionObj: {},
            childEducation: "",
            hasNameReqError: false,
            hasContactReqError: false,
            hasNameInvalidError: false,
            hasContactInvalidError: false,
            isSubmitted: false,
            sendObj:{}
        },
        mounted: function () {
            var _self = this;
            _self.labelToDisplay = new URL(location.href).searchParams.get('role');
            console.log(_self.labelToDisplay);
            google.maps.event.addDomListener(window, 'load', _self.initialize);

            if(new URL(location.href).searchParams.get('edt')==1)
            {
                this.fetchSavedData()
            }
            else
            {
                console.log("if else")
            }

        },
        methods: {
            fetchSavedData(){
                console.log("if")
                this.sendObj.uuid=new URL(location.href).searchParams.get('userid');
                this.sendObj.role=new URL(location.href).searchParams.get('role');
                console.log(this.sendObj);
          //     var roleType=new URL(location.href).searchParams.get('role')
                $.ajax({
                    url: API_URI + "/fetchProfession",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        //alert("section 1 saved.");
                   //  console.log(data);
                     app.setValues(data);
                        
                    },
                });
            },

            setValues(data) {
                console.log(data);
                if(new URL(location.href).searchParams.get('role')=="child")
                {
                
                    Vue.set(this.professionObj,"childProfession",data.child_profession);
                    Vue.set(this.professionObj,"childEducationPlace",data.child_education_place);
                    Vue.set(this.professionObj,"childEHCP",data.child_EHAT);
                    Vue.set(this.professionObj,"childEHAT",data.child_EHCP);
                    Vue.set(this.professionObj,"isSocialWorker",data.child_socialworker);
                    Vue.set(this.professionObj,"socialWorkerName",data.child_socialworker_name);
                    Vue.set(this.professionObj,"socialWorkerContactNumber",data.child_socialworker_contact);
                }
                else if(new URL(location.href).searchParams.get('role')=="parent")
                {
                    console.log(data);

                    Vue.set(this.professionObj,"childProfession",data[0].parent[0].child_profession);
                    Vue.set(this.professionObj,"childEducationPlace",data[0].parent[0].child_education_place);
                    Vue.set(this.professionObj,"childEHCP",data[0].parent[0].child_EHAT);
                    Vue.set(this.professionObj,"childEHAT",data[0].parent[0].child_EHCP);
                    Vue.set(this.professionObj,"isSocialWorker",data[0].parent[0].child_socialworker);
                    Vue.set(this.professionObj,"socialWorkerName",data[0].parent[0].child_socialworker_name);
                    Vue.set(this.professionObj,"socialWorkerContactNumber",data[0].parent[0].child_socialworker_contact);
                }
                else if(new URL(location.href).searchParams.get('role')=="professional")
                {
                     
                     Vue.set(this.professionObj,"childProfession",data[0].professional[0].child_profession);
                       Vue.set(this.professionObj,"childEducationPlace",data[0].professional[0].child_education_place);
                       Vue.set(this.professionObj,"childEHCP",data[0].professional[0].child_EHAT);
                       Vue.set(this.professionObj,"childEHAT",data[0].professional[0].child_EHCP);
                       Vue.set(this.professionObj,"isSocialWorker",data[0].professional[0].child_socialworker);
                       Vue.set(this.professionObj,"socialWorkerName",data[0].professional[0].child_socialworker_name);
                       Vue.set(this.professionObj,"socialWorkerContactNumber",data[0].professional[0].child_socialworker_contact);
                }
                
            },

            backToAbout(){
                var uid= new URL(location.href).searchParams.get('userid');
                var role =  new URL(location.href).searchParams.get('role');
                location.href = "/about?userid=" + uid + "&role=" + role + "&edt=1";
            },
            initialize() {
                var _self = this;
                var autoCompleteChild;
                autoCompleteChild = new google.maps.places.Autocomplete((document.getElementById('childEducationPlace')), {
                    types: ['geocode'],
                });
                google.maps.event.addListener(autoCompleteChild, 'place_changed', function () {
                    _self.childEducation = autoCompleteChild.getPlace().formatted_address;
                });
            },

            onChange(event) {
                var optionText = event.target.name;
                if ((optionText == "childProfession" && this.professionObj.childEducationPlace != undefined) || (optionText == "childProfession" && this.professionObj.childEHCP != undefined)) {
                    this.professionObj.childEducationPlace = "";
                    this.professionObj.childEHCP = "";
                    this.professionObj.childEHAT = "";
                    this.professionObj.isSocialWorker = "";
                    this.professionObj.socialWorkerName = "";
                    this.professionObj.socialWorkerContactNumber = "";
                }

                if (optionText == "childEHCP" && this.professionObj.childEHAT != undefined) {
                    this.professionObj.childEHAT = "";
                    this.professionObj.isSocialWorker = "";
                    this.professionObj.socialWorkerName = "";
                    this.professionObj.socialWorkerContactNumber = "";
                }

                if (optionText == "childEHAT" && this.professionObj.isSocialWorker != undefined) {
                    this.professionObj.isSocialWorker = "";
                    this.professionObj.socialWorkerName = "";
                    this.professionObj.socialWorkerContactNumber = "";
                }
            },

            onVaueChange(e, type) {
                if (this.isSubmitted) {
                    var phoneRegex = /^[0-9,-]{10,15}$|^$/;
                    var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
                    if (type === 'name') {
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

                    } else if (type === 'contact') {
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
                }
            },

            saveEducation() {
                var _self = this;
                var phoneRegex = /^[0-9,-]{10,15}$|^$/;
                var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
                this.isSubmitted = true;
                var userid = new URL(location.href).searchParams.get('userid');
                var role = new URL(location.href).searchParams.get('role');
                this.professionObj.userid = userid;
                this.professionObj.role = role;
                this.professionObj.childEducationPlace = _self.childEducation;
                console.log(this.professionObj);
                if (this.professionObj.isSocialWorker === 'yes') {
                    if (this.professionObj.socialWorkerName && this.professionObj.socialWorkerContactNumber) {
                        if (nameRegex.test(this.professionObj.socialWorkerName) && phoneRegex.test(this.professionObj.socialWorkerContactNumber)) {
                            this.apiRequest(this.professionObj, this.professionObj.isSocialWorker);
                        } else {
                            if (!nameRegex.test(this.professionObj.socialWorkerName)) {
                                this.hasNameInvalidError = true;
                            } else {
                                this.hasNameInvalidError = false;
                            }
                            if (!phoneRegex.test(this.professionObj.socialWorkerContactNumber)) {
                                this.hasContactInvalidError = true;
                            } else {
                                this.hasContactInvalidError = false;
                            }
                        }
                    } else {
                        if (this.professionObj.socialWorkerName === undefined) {
                            this.hasNameReqError = true;
                        } else {
                            this.hasNameReqError = false;
                        }
                        if (this.professionObj.socialWorkerContactNumber === undefined) {
                            this.hasContactReqError = true;
                        } else {
                            this.hasContactReqError = false;
                        }
                    }
                } else {
                    this.apiRequest(this.professionObj, this.professionObj.isSocialWorker);
                }
            //    this.apiRequest(this.professionObj, role);
            },

            apiRequest(payload, role) {
                $.ajax({
                    url: API_URI + "/education",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    success: function (data) {
                        alert("section 3 saved.");
                        this.isSubmitted = false;
                        console.log(data);
                        // if (role === 'yes') {
                        //     this.resetValidation();
                        // }
                        if(new URL(location.href).searchParams.get('edt')==null)
                        {
                            location.href = "/referral?userid=" + data.userid + "&role=" + new URL(location.href).searchParams.get('role');
                        }
                        else
                        {
                           history.back();
                        }
                    },
                });
            },
            resetValidation() {
                this.hasNameInvalidError = false;
                this.hasNameReqError = false;
                this.hasContactInvalidError = flase;
                this.hasContactReqError = false;
            },
        }
    })
});