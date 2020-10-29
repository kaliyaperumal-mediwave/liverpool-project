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
            empClgSchool:"",
            saveAndCont:""
        },
        mounted: function () {
            var _self = this;
            _self.labelToDisplay = new URL(location.href).searchParams.get('role');
            google.maps.event.addDomListener(window, 'load', _self.initialize);
        },
        methods: {
            initialize() {
                var _self = this;
                var autoCompleteChild;
                autoCompleteChild = new google.maps.places.Autocomplete((document.getElementById('txtChildAddress')), {
                    types: ['geocode'],
                });
                google.maps.event.addListener(autoCompleteChild, 'place_changed', function () {
                    console.log('place chnaged ', autoCompleteChild.getPlace().formatted_address)
                    _self.selectedChildAddress = autoCompleteChild.getPlace().formatted_address;
                    console.log(_self.selectedChildAddress)
                    console.log('========')
                });
                var autoCompleteParent;
                autoCompleteParent = new google.maps.places.Autocomplete((document.getElementById('txtParentAddress')), {
                    types: ['geocode'],
                });
                google.maps.event.addListener(autoCompleteParent, 'place_changed', function () {
                    _self.selectedParentAddress = autoCompleteParent.getPlace().formatted_address;
                    document.getElementById("showAdToast").style.display = "block";
                    document.getElementById("showAdBtn").style.display = "block";
                });

                // var autoCompleteSchClg;
                // autoCompleteSchClg = new google.maps.places.Autocomplete((document.getElementById('txtEmpClg')), {
                //     types: ['geocode'],
                // });
                // google.maps.event.addListener(autoCompleteSchClg, 'place_changed', function () {
                //     _self.empClgSchool = autoCompleteSchClg.getPlace().formatted_address;
                // });

            },

            onChange(event) {
                var optionTxt=event.target.name;

                if(optionTxt=="parentialResponsibility")
                {
                    this.aboutObj.parentContactName="";
                    this.aboutObj.childParentRelationship="";
                    this.aboutObj.parentContactNumber="";
                    this.aboutObj.parentEmail = "";
                }

                if(optionTxt=="parentialResponsibility" && this.aboutObj.parentSameHouse != undefined)
                {
                    this.aboutObj.parentSameHouse="";
                    this.aboutObj.legalCareStatus = "";
                    this.saveAndCont='false';
                    document.getElementById("showAdToast").style.display = "none";
                    document.getElementById("showAdBtn").style.display = "none";
                    document.getElementById('txtParentAddress').value="";
                }
                if(optionTxt=="parentSameHouseYes")
                {
                    document.getElementById("showAdToast").style.display = "none";
                    document.getElementById("showAdBtn").style.display = "none";
                    document.getElementById('txtParentAddress').value="";
                }

                if(optionTxt=="legalCare")
                {
                    this.saveAndCont='true';
                }
                if(optionTxt=="parentSameHouseYes")
                {
                    this.aboutObj.legalCareStatus = "";
                    this.saveAndCont='false';
                }

                this.submitForm = "yes";

            },
            changeDob(event) {



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
            saveAbout() {
                var _self = this;
                var userid = new URL(location.href).searchParams.get('userid');
                var role = new URL(location.href).searchParams.get('role');
                this.aboutObj.userid = userid;
                this.aboutObj.role = role;
                this.aboutObj.childAddress = _self.selectedChildAddress;
                this.aboutObj.parentAddress = _self.selectedParentAddress;
                console.log(this.aboutObj);
                $.ajax({
                    url: API_URI + "/about",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.aboutObj),
                    success: function (data) {
                        alert("section 2 saved.");
                        console.log(data)
                        // location.reload();
                        // console.log("/about?userid="+data.userid+"&role="+role)
                        location.href = "/education?userid=" + data.userid + "&role=" + role;

                    },

                });


            },
            diff_years(dt2, dt1) {
                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60 * 24);
                return Math.abs(Math.round(diff / 365.25));
            }
        }
    })


    var app1 = new Vue({
        el: '#about-form-header',
        data: {
            headerToDisplay: "",
        },
        mounted: function () {
            this.headerToDisplay = new URL(location.href).searchParams.get('role');
            console.log(this.labelToDisplay)
        },
    })

});