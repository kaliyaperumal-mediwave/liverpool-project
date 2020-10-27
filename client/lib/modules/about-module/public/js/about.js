var API_URI = "/modules/about-module";
$(document).ready(function () {


    var _self = this;
    var app = new Vue({
        el: '#about-form',
        data: {
            labelToDisplay:"",
            aboutObj: {},
            childDob: "",
            showBelowAge: "",
            submitForm:""
        },
        mounted: function () {
            this.labelToDisplay= new URL(location.href).searchParams.get('role');
            console.log(this.labelToDisplay)
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


    var app1 = new Vue({
        el: '#about-form-header',
        data: {
            headerToDisplay:"",
        },
        mounted: function () {
            this.headerToDisplay= new URL(location.href).searchParams.get('role');
            console.log(this.labelToDisplay)
        },
    })

});