var API_URI = "/modules/admin-module";
$(document).ready(function () {
  var vueApp = new Vue({
    el: '#admin',

    data: {
      toggle: true,
      referralData: [],
      pageLimit: 10,
      pageNum: 1,
      referral_ids: [],
      dataSet: [],
      successMessage: '',
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

      selectcheck: function (checked, id) {
        if (checked) {
          this.referral_ids.push(id);
        } else {
          this.referral_ids.splice(this.referral_ids.findIndex(uuid => uuid == id), 1);
        }
      },

      fetchReferral: function () {
        var successData = apiCallGet('get', '/referral?offset=' + this.pageNum + '&limit=' + this.pageLimit, API_URI);
        if (successData && Object.keys(successData).length) {
          this.referralData = successData.data;
          this.dataSet = [];
          for (var i = 0; i < this.referralData.length; i++) {
            this.dataSet.push([
              "<input type='checkbox' id='" + this.referralData[i].uuid + "' name='" + this.referralData[i].uuid + "' value='" + this.referralData[i].uuid + "'>",
              this.referralData[i].name,
              this.referralData[i].dob,
              this.referralData[i].reference_code,
              this.referralData[i].referrer,
              this.referralData[i].gp_location,
              this.referralData[i].referrer_type,
              this.referralData[i].date,
              '<div class="input-group height-set-admin-select">' +
              '<span class="plain-select">' +
              '<select class="custom-select form-control " name="legalCare">' +
              '<option value="Nothing" selected>Nothing</option>' +
              '<option value="Accepted">Accepted</option>' +
              '<option value="Forwarded to partner agency">Forwarded to partner agency</option>' +
              '<option value="Duplicate referral">Duplicate referral</option>' +
              '<option value="Rejected referral">Rejected referral</option>' +
              '<option value="Referral to community paeds required instead">Referral to community paeds required instead</option>' +
              '<option value="Referral to other team ">Referral to other team</option>' +
              '</select>' +
              '</span>' +
              '</div>'
            ]);
          }
          $('#example').DataTable({
            destroy: true,
            data: this.dataSet
          });
          this.referral_ids = [];
        }
        $('#loader').hide();
      },

      deleteReferral: function () {
        if (this.referral_ids.length) {
          $('#loader').show();
          var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'deleted' });
          if (successData && Object.keys(successData)) {
            this.successMessage = 'Deleted successfully .'
            this.fetchReferral();
            $('#loader').hide();
            $('#deletedSuccess').modal('show');
          } else {
            $('#loader').hide();
          }
        }
      },

      archiveReferral: function () {
        if (this.referral_ids.length) {
          $('#loader').show();
          var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'archived' });
          if (successData && Object.keys(successData)) {
            this.successMessage = 'Archived successfully .';
            this.fetchReferral();
            $('#loader').hide();
            $('#deletedSuccess').modal('show');
          } else {
            $('#loader').hide();
          }
        }
      },

      closeModal: function () {
        $('#deletedSuccess').modal('hide');
        this.successMessage = '';
      },
    }
  })

  $(document).on('change', 'input', function (e) {
    vueApp.selectcheck(e.target.checked, e.target.id);
  });

});
