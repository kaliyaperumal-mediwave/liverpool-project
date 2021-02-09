var API_URI = "/modules/admin-module";
$(document).ready(function () {
  $('#example').DataTable();
  new Vue({
    el: '#admin',

    data: {
      toggle: true,
      referralData: [],
    },

    beforeMount: function () {
      $('#loader').show();
    },

    mounted: function () {
      this.fetchReferral();
    },

    methods: {
      openToggle: function (toggle) {
        if (toggle) {
          this.toggle = false;
          document.getElementById('admin-slider').style.display = "block";
          document.getElementById('admin-rest').classList.add("added-js-slider")
          document.getElementById('admin-arrow-left').classList.add("rotate-icon")
          document.getElementById('toggle-cont').classList.add("toggle-extra-css")
        }
        else {
          this.toggle = true;
          document.getElementById('admin-slider').style.display = "none";
          document.getElementById('admin-rest').classList.remove("added-js-slider")
          document.getElementById('admin-arrow-left').classList.remove("rotate-icon")
          document.getElementById('toggle-cont').classList.remove("toggle-extra-css")
        }
      },

      fetchReferral: function () {
        var _self = this;
        $.ajax({
          url: API_URI + "/referral/",
          type: 'get',
          dataType: 'json',
          contentType: 'application/json',
          cache: false,
          success: function (data) {
            _self.referralData = data.data;
            console.log(this.referralData);
            $('#loader').hide();
          },
          error: function (error) {
            $('#loader').hide();
            console.log(error);
          }
        });
      }
    }
  })
});


