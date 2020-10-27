
const apiUrl = "http://0.0.0.0:3001/user/about"

$(document).ready(function () {


    var _self = this;
    var app = new Vue({
        el: '#about-form',
        mounted: function () {
            console.log("vue js loaded");
        },
        data: {
            aboutObj: {},
            childDob: "",
            showBelowAge: "",
            submitForm:""
        },
        methods: {
            onChange(event){
                console.log(event.target.value);

              this.submitForm="yes";
                
            },
            changeDob(event) {

                

                var today=new Date();
                var selectedDate=new Date(event.target.value);
                var age = this.diff_years(today,selectedDate);
                if(age<18)
                {
                    this.showBelowAge = "yes";
                }
                else
                {
                    this.showBelowAge = "";
                  
                }
            },
            saveAbout() {

                var userid= new URL(location.href).searchParams.get('userid');
                var role= new URL(location.href).searchParams.get('role');
                this.aboutObj.userid=userid;
                this.aboutObj.role=role;
                console.log(this.aboutObj);
                $.ajax({
                    url: apiUrl,
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.aboutObj),
                    success: function (data) {
                        alert("section 2 saved.");
                       // location.reload();
                       location.href="/education?userid="+data.userid+"&role="+role;
                    },

                });
            },
            diff_years(dt2, dt1)
            {
                var diff =(dt2.getTime() - dt1.getTime()) / 1000;
                diff /= (60 * 60 * 24);
               return Math.abs(Math.round(diff/365.25));
            }
        }
    })

});