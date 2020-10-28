
var API_URI = "/modules/education-employment-module";

$(document).ready(function () {

    var app = new Vue({
        el: '#education-form',
        data: {
            labelToDisplay:"",
            professionObj: {},
            childEducation:""
        },
        mounted: function () {
            var _self = this;
            _self.labelToDisplay= new URL(location.href).searchParams.get('role');
            google.maps.event.addDomListener(window, 'load', _self.initialize);
        },
        methods: {

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

                if((optionText=="childProfession" && this.professionObj.childEducationPlace != undefined) || (optionText=="childProfession" && this.professionObj.childEHCP != undefined))
                {
                    this.professionObj.childEducationPlace="";
                    this.professionObj.childEHCP = "";
                    this.professionObj.childEHAT = "";
                    this.professionObj.isSocialWorker = "";
                    this.professionObj.socialWorkerName = "";
                    this.professionObj.socialWorkerContactNumber = "";
                }

                if(optionText=="childEHCP" && this.professionObj.childEHAT != undefined)
                {
                    this.professionObj.childEHAT = "";
                    this.professionObj.isSocialWorker = "";
                    this.professionObj.socialWorkerName = "";
                    this.professionObj.socialWorkerContactNumber = "";
                }


                if(optionText=="childEHAT" && this.professionObj.isSocialWorker != undefined)
                {
                    this.professionObj.isSocialWorker = "";
                    this.professionObj.socialWorkerName = "";
                    this.professionObj.socialWorkerContactNumber = "";
                }

            },
            saveEducation() {

                var _self = this;
                var userid= new URL(location.href).searchParams.get('userid');
                var role= new URL(location.href).searchParams.get('role');
                this.professionObj.userid=userid;
                this.professionObj.role=role;
                this.professionObj.childEducationPlace=_self.childEducation;

                console.log(this.professionObj);

                $.ajax({
                    url: API_URI + "/education",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.professionObj),
                    success: function (data) {
                        alert("section 3 saved.");
                        console.log(data)
                        // location.reload();
                        // console.log("/about?userid="+data.userid+"&role="+role)
                        location.href="/";

                    },

                });
            }
        }
    })

});