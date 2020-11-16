
//const apiUrl = "/user/eligibility"
var API_URI = "/modules/auth-module";
$(document).ready(function () {
    var _self = this;
    var app = new Vue({
        el: '#role-form',

        data: {
            gpListShow: [],
            elgibilityObj: {"childDob":"2020-09-29T00:00:00.000Z"},
            submitForm: "",
            submitProfForm: "",
            belowAgeLimit: "",
            aboveLimit: "",
            profBelowAgeLimit: "",
            profaboveLimit: "",
            hasNameReqError: false,
            hasContactReqError: false,
            hasNameInvalidError: false,
            hasContactInvalidError: false,
            hasEmailInvalidError: false,
            isSubmitted: false,
            edFlag:false,
            sendObj:{},
            maxDate:""
        },

        mounted: function () {

            this.getGP();
         // this.maxDate=this.restrictDate();
        
         this.elgibilityObj.maxDate = "2020-10-29";
       
          //  console.log( this.elgibilityObj.maxDate);
          //  document.getElementById("txtDate").setAttribute("max", this.restrictDate());
          
           // document.getElementsByName("date")[0].setAttribute('max', this.restrictDate())
           // this.getUrlVars()["edt"]
         //   console.log(this.getUrlVars()["edt"]);
           
           // location.href = "/about?userid=" + "11444" + "&role=" + "child"; 
            if(this.getUrlVars()["edt"]==1)
            {
                this.fetchSavedData()
            }
            else
            {
                console.log("if else")
            }
        },

        methods: {

            

            fetchSavedData:function (){
                console.log("if")
                this.sendObj.uuid=this.getUrlVars()["userid"];
                this.sendObj.role=this.getUrlVars()["role"];
                console.log(this.sendObj);
                //var roleType=new URL(location.href).searchParams.get('role')
                $.ajax({
                    url: API_URI + "/fetchEligibility",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        //alert("section 1 saved.");
                  //   console.log(data);
                     app.setValues(data);
                        
                    },
                });
            },

            setValues :function(data) {
                console.log(data);
                var roleType = this.getUrlVars()["role"]
                if(roleType=="child")
                {
                    Vue.set(this.elgibilityObj,"role",this.getUrlVars()["role"]);
                    Vue.set(this.elgibilityObj,"interpreter",data.need_interpreter);
                    Vue.set(this.elgibilityObj,"childDob",this.convertDate(data.child_dob));
                    this.fetchAgeLogic(data.child_dob,this.getUrlVars()["role"]) 
                    Vue.set(this.elgibilityObj,"contactParent",data.contact_parent);
                    Vue.set(this.elgibilityObj,"isInformation",data.consent_child);
                    Vue.set(this.elgibilityObj,"registerd_gp",this.bindGpAddress(data.registerd_gp));
                    $('input[name=role]').attr("disabled",true);
                    this.getGP();
                }
                else if(roleType=="parent")
                {
                    console.log(data);

                    Vue.set(this.elgibilityObj,"role",this.getUrlVars()["role"]);
                    Vue.set(this.elgibilityObj,"interpreter",data[0].need_interpreter);
                    Vue.set(this.elgibilityObj,"childDob",this.convertDate(data[0].parent[0].child_dob));
                    this.fetchAgeLogic(data.child_dob,this.getUrlVars()["role"]) 
                    Vue.set(this.elgibilityObj,"contactParent",data[0].contact_parent);
                    Vue.set(this.elgibilityObj,"isInformation",data[0].consent_child);
                    Vue.set(this.elgibilityObj,"registerd_gp",this.bindGpAddress(data[0].parent[0].registerd_gp,this.getUrlVars()["role"]));
                    $('input[name=role]').attr("disabled",true);
                    this.getGP();
                }
                else if(roleType=="professional")
                {
                    console.log(data);
                    Vue.set(this.elgibilityObj,"role",this.getUrlVars()["role"]);
                    Vue.set(this.elgibilityObj,"profName",data[0].professional_name);
                    Vue.set(this.elgibilityObj,"profEmail",data[0].professional_email);
                    Vue.set(this.elgibilityObj,"profContactNumber",data[0].professional_contact_number);
                    Vue.set(this.elgibilityObj,"profChildDob",this.convertDate(data[0].professional[0].child_dob));
                    this.fetchAgeLogic(data[0].professional[0].child_dob,this.getUrlVars()["role"]) 
                    Vue.set(this.elgibilityObj,"contactProfParent",data[0].consent_parent);
                    Vue.set(this.elgibilityObj,"parentConcernInformation",data[0].consent_child);
                    Vue.set(this.elgibilityObj,"profRegisterd_gp",this.bindGpAddress(data[0].professional[0].registerd_gp,this.getUrlVars()["role"]));
                    this.getProfGP();
                }
                
            },
            getGP :function() {
                var _self = this;
                console.log("Er");
                gpList = [];
                $.ajax({
                    url: "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177",
                    type: 'get',
                    success: function (response) {
                        this.gpListShow = response.Organisations;
                        for (i = 0; i < this.gpListShow.length; i++) {
                            gpList.push(this.gpListShow[i].Name)
                        }
                        $("#gpLocation").autocomplete({
                            source: gpList
                        });
                        return;
                    },
                    error: function (err) {
                        console.log(err)
                    },
                })
            },

            getProfGP :function() {
                console.log("Er");
                gpList = [];
                $.ajax({
                    url: "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?PrimaryRoleId=RO177",
                    type: 'get',
                    success: function (response) {
                        this.gpListShow = response.Organisations;
                        for (i = 0; i < this.gpListShow.length; i++) {
                            gpList.push(this.gpListShow[i].Name)
                        }
                        $("#gpProfLocation").autocomplete({
                            source: gpList
                        });
                        return;
                    },
                    error: function (err) {
                        console.log(err)
                    },
                })
            },

            onChange :function(event) {

                var optionText = event.target.name;
                console.log(this.elgibilityObj.role);
                var today = this.restrictDate();
                if(optionText=="interpreter" && this.elgibilityObj.role=="child")
                {
                    document.getElementById("txtDateChild").setAttribute("max", today);
                }
                else if(optionText=="interpreter" && this.elgibilityObj.role=="parent")
                {
                   
                    document.getElementById("txtDateParent").setAttribute("max", today);
                }
                else if(this.elgibilityObj.role=="professional")
                {
                   
                     document.getElementById("txtDateProf").setAttribute("max", today);
                }
                var fType = this.getUrlVars()["role"];
                console.log(fType);
                if (optionText == "role" && this.elgibilityObj.interpreter != undefined) {
                    console.log(optionText);
                    this.elgibilityObj.interpreter = "";
                    this.elgibilityObj.childDob = "";
                    this.belowAgeLimit = "";
                    this.aboveLimit = "";
                    this.elgibilityObj.camhs = "";
                    this.elgibilityObj.isInformation = "";
                    this.elgibilityObj.registerd_gp = "";
                    this.elgibilityObj.contactParent = "";
                    this.submitForm = "false";
                }

                if (optionText == "interpreter" && this.elgibilityObj.camhs != undefined) {
                    this.elgibilityObj.childDob = "";
                    this.belowAgeLimit = "";
                    this.aboveLimit = "";
                    this.elgibilityObj.camhs = "";
                    this.elgibilityObj.camhsSelect = "";
                    this.elgibilityObj.isInformation = "";
                    this.elgibilityObj.registerd_gp = "";
                    this.elgibilityObj.contactParent = "";
                    this.submitForm = "false";
                }

                if (optionText == "belowAgeParent" && this.elgibilityObj.isInformation != undefined) {
                    this.elgibilityObj.isInformation = "";
                    this.elgibilityObj.registerd_gp = "";
                    this.submitForm = "false";
                }

                if (optionText == "camhsSelect") {
                    console.log(this.elgibilityObj.isInformation);
                    console.log(this.elgibilityObj.role);
                    this.getGP();
                   
                }
                if (optionText == "camhsSelect" && this.submitForm != undefined) {
                    this.elgibilityObj.registerd_gp = "";
                    this.submitForm = "false";
                }

                //reset fields for prof
                if (optionText == "role" && this.elgibilityObj.parentConcernInformation != undefined) {
                    this.elgibilityObj.profName = "";
                    this.elgibilityObj.profEmail = "";
                    this.elgibilityObj.profContactNumber = "";
                    this.elgibilityObj.profChildDob = "";
                    this.elgibilityObj.parentConcern = "";
                    this.elgibilityObj.parentConcernInformation = "";
                    this.elgibilityObj.childConcernInformation = "";
                    this.elgibilityObj.profRegisterd_gp = "";
                    this.profBelowAgeLimit = "";
                    this.profaboveLimit = "";
                    this.elgibilityObj.contactProfParent = "";
                    this.submitProfForm = "false";
                }
                
                if (optionText == "contactProfParent" && this.elgibilityObj.parentConcernInformation != undefined) {
                    this.elgibilityObj.profRegisterd_gp = "";
                    this.elgibilityObj.parentConcernInformation = "";
                    this.submitProfForm = "false";
                }

                if (optionText == "parentConcernSelect") {
                    this.getProfGP();
                    var selectTxt = event.target.value
                    if (selectTxt == "no") {
                        console.log("--");
                      //  this.elgibilityObj.childConcernInformation = "";
                        this.elgibilityObj.profRegisterd_gp = "";
                   //     this.profBelowAgeLimit = "";
                        this.elgibilityObj.profaboveLimit = "";
                       // this.profBelowAgeLimit = "";
                      //  this.profaboveLimit = "";
                     // this.elgibilityObj.parentConcernInformation
                        this.submitProfForm = "false";
                    }
                }

        

                // if (optionText == "parentConcernSelect") {
                //     this.getProfGP();
                //     var selectTxt = event.target.value
                //     if (selectTxt == "no") {
                //         console.log("--");
                //         this.elgibilityObj.registerd_gp = "";
                //         this.profBelowAgeLimit = "";
                //         this.profaboveLimit = "";
                //         this.submitProfForm = "false";
                //     }
                // }
            },

            getAddress:function(e) {
                $("#gpLocation").on("autocompleteselect", function (event, ui) {

                    console.log(ui.item.label);
                    if (e.target.value === '') {
                        app.submitForm = "false";
                    } else {
                        console.log(e.target.value);
                        app.elgibilityObj.registerd_gp = ui.item.label
                        app.submitForm = "true";
                    }
                });
            },

            getProfAddress:function(e) {
                $("#gpProfLocation").on("autocompleteselect", function (event, ui) {
                    console.log('this', _self, app);
                    if (e.target.value === '') {
                        app.submitProfForm = "false";
                    } else {
                        app.elgibilityObj.profRegisterd_gp = e.target.value
                        app.submitProfForm = "true";
                    }
                });
            },

            changeDob:function(event) {
                var today = new Date();
                var selectedDate = new Date(event.target.value);
                var age = this.diff_years(today, selectedDate);
                var roleText = event.target.name;
                if(this.elgibilityObj.isInformation != undefined)
                {
                    this.elgibilityObj.isInformation="";
                }
                console.log(age);
                if (roleText == 'child') {
                    if (age < 15) {
                        this.belowAgeLimit = "yes";
                        this.aboveLimit = "";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else if (age > 25) {
                        this.aboveLimit = "yes";
                        this.belowAgeLimit = "";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else {
                        this.elgibilityObj.camhs = "show";
                            this.belowAgeLimit = "";
                            this.aboveLimit = "";
                        this.submitForm = "false";
                    }
                }
                else if (roleText == 'prof') {
                    if (age < 15) {
                        this.profBelowAgeLimit = "yes";
                        this.profaboveLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.submitProfForm = "false";
                    }
                    else if (age > 25) {
                        this.profaboveLimit = "yes";
                        this.profBelowAgeLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.submitProfForm = "false";
                    }
                    else {
                        this.elgibilityObj.parentConcern = "show";
                        this.profBelowAgeLimit = "";
                        this.profaboveLimit = "";
                        this.submitProfForm = "false";
                    }
                }

                else if (roleText == 'parent') {
                    if (age > 25) {
                        this.aboveLimit = "yes";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else {
                        this.elgibilityObj.camhs = "show";
                        this.belowAgeLimit = "";
                        this.aboveLimit = "";
                        this.submitForm = "false";
                    }

                }

            },

            changeGP:function() {
                this.submitForm = "true";
            },

            onVaueChange:function(e, type) {
                if (this.isSubmitted) {
                    var phoneRegex = /^[0-9,-]{10,15}$|^$/;
                    var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
                    var emailRegex = new RegExp(/^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i);
                    if (type === 'fullName') {
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
                }
            },

            save:function() {
                console.log("3334");
                console.log(this.elgibilityObj);
                ///this.elgibilityObj.editFlag=new URL(location.href).searchParams.get('edt');
                // this.elgibilityObj.uuid=new URL(location.href).searchParams.get('userid');

                 this.elgibilityObj.editFlag=this.getUrlVars()["edt"];
                 this.elgibilityObj.uuid=this.getUrlVars()["userid"];
                 this.elgibilityObj.editFlag=this.getUrlVars()['edt'];
                var phoneRegex = /^[0-9,-]{10,15}$|^$/;
                var nameRegex = new RegExp(/^[a-zA-Z0-9 ]{1,50}$/);
                var emailRegex = new RegExp(/^[a-z-0-9_+.-]+\@([a-z0-9-]+\.)+[a-z0-9]{2,7}$/i);
                this.isSubmitted = true;
                console.log(this.elgibilityObj.role);
                var role = this.elgibilityObj.role;
                if (role === 'professional') {
                    if (this.elgibilityObj.profName && this.elgibilityObj.profContactNumber) {
                        if (nameRegex.test(this.elgibilityObj.profName) && phoneRegex.test(this.elgibilityObj.profContactNumber)) {
                            if (this.elgibilityObj.profEmail) {
                                if (emailRegex.test(this.elgibilityObj.profEmail)) {
                                    this.apiRequest(this.elgibilityObj, role);

                                } else {
                                    this.hasEmailInvalidError = true;
                                }

                            } else {
                                this.apiRequest(this.elgibilityObj, role);
                            }
                        }
                        else {
                            if (!nameRegex.test(this.elgibilityObj.profName)) {
                                this.hasNameInvalidError = true;
                            } else {
                                this.hasNameInvalidError = false;
                            }
                            if (!phoneRegex.test(this.elgibilityObj.profContactNumber)) {
                                this.hasContactInvalidError = true;
                            } else {
                                this.hasContactInvalidError = false;
                            }
                            if (this.elgibilityObj.profEmail) {
                                if (!emailRegex.test(this.elgibilityObj.profEmail)) {
                                    this.hasEmailInvalidError = true;
                                }
                            }
                            window.scrollTo(0, 0)
                        }
                    } else {
                        if (this.elgibilityObj.profName === undefined) {
                            this.hasNameReqError = true;
                        } else {
                            this.hasNameReqError = false;
                        }
                        if (this.elgibilityObj.profContactNumber === undefined) {
                            this.hasContactReqError = true;
                        } else {
                            this.hasContactReqError = false;
                        }
                        if (this.elgibilityObj.profEmail) {
                            if (!emailRegex.test(this.elgibilityObj.profEmail)) {
                                this.hasEmailInvalidError = true;
                            }
                        }
                        window.scrollTo(0, 0)
                    }
                } else if (role === 'parent') {
                    this.apiRequest(this.elgibilityObj, role);
                }
                else if (role === 'child') {
                    this.apiRequest(this.elgibilityObj, role);
                }
            },

            apiRequest:function(payload, role) {
                console.log(payload)
                var _self = this;
                $.ajax({
                    url: API_URI + "/eligibility",
                    type: 'post',
                     dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(payload),
                    success: function (data) {
                        //alert("section 1 saved.");
                        console.log(data);
                        _self .isSubmitted = false;
                        if (role === 'professional') {
                            _self .resetValidation();
                        }
                      console.log("edt",_self.getUrlVars()["edt"]);

                        if(_self.getUrlVars()["edt"]==null)
                        {
                            location.href = "/about?userid=" + data.userid + "&role=" + role; 
                        }
                        else
                        {
                           history.back();
                        }
                        
                    },
                });
            },


            resetValidation:function() {
                this.hasNameInvalidError = false;
                this.hasNameReqError = false;
                this.hasEmailInvalidError = false;
                this.hasContactInvalidError = false;
                this.hasContactReqError = false;
            },

            diff_years:function(dt2, dt1) {
                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                return Math.abs(Math.round(diff / 365.25));
            },

             convertDate:function(dbDate) {
                 var date= new Date(dbDate)
                var yyyy = date.getFullYear().toString();
                var mm = (date.getMonth()+1).toString();
                var dd  = date.getDate().toString();
              
                var mmChars = mm.split('');
                var ddChars = dd.split('');
              
                return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
              },

              fetchAgeLogic:function(dbdob,roleText) {
                  console.log(dbdob);
                var today = new Date();
                var selectedDate = new Date(dbdob);
                var age = this.diff_years(today, selectedDate);
                console.log(age);
                if (roleText == 'child') {
                    if (age < 15) {
                        this.belowAgeLimit = "yes";
                        this.aboveLimit = "";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else if (age > 25) {
                        this.aboveLimit = "yes";
                        this.belowAgeLimit = "";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else {
                        this.elgibilityObj.camhs = "show";
                            this.belowAgeLimit = "";
                            this.aboveLimit = "";
                        this.submitForm = "false";
                    }
                }
                else if (roleText == 'professional') {
                    if (age < 15) {
                        this.profBelowAgeLimit = "yes";
                        this.profaboveLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.submitProfForm = "false";
                    }
                    else if (age > 25) {
                        this.profaboveLimit = "yes";
                        this.profBelowAgeLimit = "";
                        this.elgibilityObj.parentConcern = "";
                        this.submitProfForm = "false";
                    }
                    else {
                        this.elgibilityObj.parentConcern = "show";
                        this.profBelowAgeLimit = "";
                        this.profaboveLimit = "";
                        this.submitProfForm = "false";
                    }
                }

                else if (roleText == 'parent') {
                    if (age > 25) {
                        this.aboveLimit = "yes";
                        this.elgibilityObj.camhs = "";
                        this.submitForm = "false";
                    }
                    else
                    {
                        this.elgibilityObj.camhs = "show";
                        this.belowAgeLimit = "";
                        this.aboveLimit = "";
                        this.submitForm = "false";
                    }

                }

            },

            bindGpAddress:function(gpAddress,role)
            {
                if(role=="professional")
                {
                    if(gpAddress!=undefined || gpAddress!="")
                    {
                        this.submitProfForm = "true";
                        return gpAddress;
                    }
                }
                else
                {
                    if(gpAddress!=undefined || gpAddress!="")
                    {
                        this.submitForm = "true";
                        return gpAddress;
                    }
                }
            },

            getUrlVars:function () {
                var vars = {};
                var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
                function(m,key,value) {
                  vars[key] = value;
                });

              
                return vars;
              },

            restrictDate:function(){

                var dtToday = new Date();

                var month = dtToday.getMonth() + 1;
                var day = dtToday.getDate();
                var year = dtToday.getFullYear();

                if(month < 10)
                    month = '0' + month.toString();
                if(day < 10)
                    day = '0' + day.toString();

                var currentDate = year + '-' + month + '-' + day;

                return currentDate;

            }

        }
    })

});