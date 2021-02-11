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
      referral_ids: []
    },

    beforeMount: function () {
      $('#loader').show();
    },

    mounted: function () {
      var _self = this;
      this.fetchReferral();
      $('.selectCheckBox').change(function(e) {
        // debugger
        // console.log(e);
        if (e.target.checked) {
          _self.referral_ids.push(e.target.id);
        } else {
          _self.referral_ids.splice(_self.referral_ids.findIndex(uuid => uuid == e.target.id), 1);
        }
      });
     
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

      fetchReferral: function (asd) {
        var successData = apiCallGet('get', '/referral?offset=' + this.pageNum + '&limit=' + this.pageLimit, API_URI);
        if (successData && Object.keys(successData).length) {
          this.referralData = successData.data;

          var dataSet = [];
         

        for (var i = 0; i < this.referralData.length; i++) {
          dataSet.push([
            "<input type='checkbox' id='"+ this.referralData[i].uuid +"' name='"+ this.referralData[i].uuid +"' value='"+ this.referralData[i].uuid +"' class='selectCheckBox'>",
            this.referralData[i].name,
            this.referralData[i].dob,
            this.referralData[i].reference_code,
            this.referralData[i].referrer,
            this.referralData[i].gp_location,
            this.referralData[i].referrer_type,
            this.referralData[i].date,
            '<div class="input-group height-set-admin-select">'+
              '<span class="plain-select">'+
                '<select class="custom-select form-control " name="legalCare">'+
                  '<option value="Nothing" selected>Nothing</option>'+
                  '<option value="Accepted">Accepted</option>'+
                  '<option value="Forwarded to partner agency">Forwarded to partner agency</option>'+
                  '<option value="Duplicate referral">Duplicate referral</option>'+
                  '<option value="Rejected referral">Rejected referral</option>'+
                  '<option value="Referral to community paeds required instead">Referral to community paeds required instead</option>'+
                  '<option value="Referral to other team ">Referral to other team</option>'+
                '</select>'+
              '</span>'+
            '</div>'
          ])
        }

        console.log(dataSet)

        // if ($.fn.DataTable.isDataTable("#example")) {
        //   // $('#example').DataTable().clear().destroy();
        //   $("#example").DataTable().clear().draw();
        //   $("#example").dataTable().fnDestroy();
        //   // $('#example').empty();
        // }
        $('#example').DataTable({
          destroy: true,
          data: dataSet
        });

        }
        $('#loader').hide();
      },

      deleteReferral: function () {
        var table = $('#example').DataTable();
        console.log(table)
        if (this.referral_ids.length) {
          $('#loader').show();
          var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'deleted' });
          if (successData && Object.keys(successData)) {
            //this.fetchReferral();
            // var _self = this;
            //$("#example").DataTable().destroy()
             this.fetchReferral('asd');
          } else {
            $('#loader').hide();
          }
        }
      },

      archiveReferral: function () {
        if (this.referral_ids.length) {
          $('#loader').show();
          var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'archivedr' });
          if (successData && Object.keys(successData)) {
            // this.fetchReferral();
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


