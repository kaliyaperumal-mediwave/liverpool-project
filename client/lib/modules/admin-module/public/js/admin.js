var API_URI = "/modules/admin-module";
$(document).ready(function () {
  //var table = $('#example').DataTable();
  new Vue({
    el: '#admin',

    data: {
      toggle: true,
      referralData: [],
      pageLimit: 10,
      pageNum: 1,
      referral_ids: [],
    },

    beforeMount: function () {
      $('#loader').show();
    },

    mounted: function () {
      this.fetchReferral();
      $('#example').DataTable();
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
        var successData = apiCallGet('get', '/referral?offset=' + this.pageNum + '&limit=' + this.pageLimit, API_URI);
        if (successData && Object.keys(successData).length) {
          this.referralData = successData.data;
        }
        $('#loader').hide();
      },

      deleteReferral: function () {
        if (this.referral_ids.length) {
          $('#loader').show();
          var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'delete' });
          if (successData && Object.keys(successData)) {
            this.fetchReferral();
          } else {
            $('#loader').hide();
          }
        }
      },

      archiveReferral: function () {
        if (this.referral_ids.length) {
          $('#loader').show();
          var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'archive' });
          if (successData && Object.keys(successData)) {
            this.fetchReferral();
          } else {
            $('#loader').hide();
          }
        }
      },

      selectData: function (e, id) {
        if (e.target.checked) {
          this.referral_ids.push(id);
        } else {
          this.referral_ids.splice(this.referral_ids.findIndex(uuid => uuid == id), 1);
        }
      }
    }
  })
});


