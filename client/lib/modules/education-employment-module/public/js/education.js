
var API_URI = "/modules/education-employment-module";

$(document).ready(function () {


    var _self = this;
    var app = new Vue({
        el: '#education-form',
        mounted: function () {
            console.log("vue js loaded");
        },
        data: {
            professionObj: {},
        },
        methods: {

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

                console.log(this.professionObj);
                var userid= new URL(location.href).searchParams.get('userid');
                var role= new URL(location.href).searchParams.get('role');
                this.professionObj.userid=userid;
                this.professionObj.role=role;

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