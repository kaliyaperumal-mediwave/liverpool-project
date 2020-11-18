$(document).ready(function () {
    var app = new Vue({
        el: '#review-form',
        data: {
            isToggled: true,
            userId: '',
            userMode: '',
            userRole: '',
            dynamicLabelsSection1: {
                interpreterNeeded: '',
                userDob: '',
                consentGiven: '',
                gp: '',
                fullName:'',
                emailAddress:'',
                contactNumber:''
            }
        },
        mounted: function () {
            console.log('loaded');
            this.userMode = this.getQueryStringValue('mode');
            this.userRole = this.getQueryStringValue('role');
            this.userId = this.getQueryStringValue('userId');
            if(userRole === 'parent') {
                var labels = this.dynamicLabelsSection1;
                labels.interpreterNeeded = ''

            }
        },
        methods: {
            toggleArrow(e) {
                console.log(e);
                var ele = e.target;
                var classList = Array.from(e.target.classList)
                if (classList.indexOf('fa-chevron-circle-up') > -1) {
                    $(ele).removeClass('fa-chevron-circle-up').addClass('fa-chevron-circle-down');
                } else {
                    $(ele).removeClass('fa-chevron-circle-down').addClass('fa-chevron-circle-up');
                }
            },

            // Get Query Params value
            getQueryStringValue(key) {
                return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
            },

            save:function () {
                console.log("save");
                this.sendObj.userid=this.getQueryStringValue()["userid"];
                this.sendObj.role=this.getUrlVars()["role"];
                console.log(this.sendObj);
                console.log(API_URI);
                //var roleType=new URL(location.href).searchParams.get('role')
                $.ajax({
                    url: API_URI + "/saveReview",
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(this.sendObj),
                    success: function (data) {
                        alert("section 1 saved.");
                     console.log(data);
                   //  app.setValues(data);
                    },
                });
               },
               getUrlVars:function () {
                var vars = {};
                var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
                function(m,key,value) {
                  vars[key] = value;
                });
    
              
                return vars;
              },

        }
    })

})