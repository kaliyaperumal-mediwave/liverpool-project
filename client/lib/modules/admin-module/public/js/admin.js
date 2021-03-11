var API_URI = "/modules/admin-module";
$(document).ready(function () {
  var vueApp = new Vue({
    el: '#admin',
    data: {
      searchTxt: "",
      toggle: true,
      referralData: [],
      pageLimit: 10,
      pageNum: 1,
      referral_ids: [],
      dataSet: [],
      successMessage: '',
      draw: 1,
      searchRefObj: {}
    },

    beforeMount: function () {
      $('#loader').show();
    },

    mounted: function () {
      // this.fetchAllRef();
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
        $('#example').DataTable({
          destroy: true,
          processing: false,
          serverSide: true,
          columnDefs: [
            { targets: 0, orderable: false },
            { targets: 1, orderable: true },
            { targets: 2, orderable: true, type: 'date-uk' },
            { targets: 4, orderable: true },
            { targets: 5, orderable: true },
            { targets: 6, orderable: true },
            { targets: 7, orderable: true, type: 'date-uk' },
            { targets: 8, orderable: false },
          ],
          order: [[7, 'desc']],
          language: {
            searchPlaceholder: 'Search referral',
            emptyTable: 'No referrals to displays',
            zeroRecords: 'No matching referrals found'
          },
          ajax: {
            url: '/modules/admin-module/referral',
            // url: '/modules/admin-module/getAllreferral',
            type: 'GET',
            dataFilter: function (referralRes) {

              referralRes = jQuery.parseJSON(referralRes);
              console.log(referralRes);
              var json = {
                draw: _self.draw,
                data: [],
                recordsTotal: referralRes.data.totalReferrals,
                recordsFiltered: referralRes.data.filteredReferrals
              };
              _self.draw += 1;
              for (var i = 0; i < referralRes.data.data.length; i++) {
                json.data.push([
                  "<input type='checkbox' class='tableCheckbox' id='" + referralRes.data.data[i].uuid + "' name='" + referralRes.data.data[i].uuid + "' value='" + referralRes.data.data[i].uuid + "'>",
                  referralRes.data.data[i].name,
                  referralRes.data.data[i].dob,
                  referralRes.data.data[i].reference_code,
                  referralRes.data.data[i].referrer,
                  referralRes.data.data[i].gp_location,
                  referralRes.data.data[i].referrer_type,
                  referralRes.data.data[i].date,
                  "completed",
                  "<div class='d-flex'><button  onclick='sendPdf(\"" + referralRes.data.data[i].uuid + "\",\"" + referralRes.data.data[i].referrer_type + "\")'  class='btn-pdf'>View</button><button class='btn-pdf'>Send</button></div>"
                ]);
              }
              return JSON.stringify(json);
            }
          }
        });
        this.referral_ids = [];
        $('#loader').hide();
      },

      selectcheck: function (checked, id) {
        if (checked) {
          this.referral_ids.push(id);
        } else {
          this.referral_ids.splice(this.referral_ids.findIndex(uuid => uuid == id), 1);
        }
      },

      deleteReferral: function () {
        if (this.referral_ids.length) {
          $('#loader').show();
          var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'deleted' });
          $('#loader').hide();
          if (successData && Object.keys(successData)) {
            this.successMessage = 'Referrals deleted successfully .'
            this.fetchReferral();
            $('#deletedSuccess').modal('show');
          }
        }
      },

      archiveReferral: function () {
        if (this.referral_ids.length) {
          $('#loader').show();
          var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'archived' });
          $('#loader').hide();
          if (successData && Object.keys(successData)) {
            this.successMessage = 'Referrals archived successfully .';
            $('#deletedSuccess').modal('show');
          }
        }
      },

      closeModal: function () {
        $('#example').DataTable().ajax.reload();
        $('#deletedSuccess').modal('hide');
        this.successMessage = '';
      },
      fetchAllRef: function () {
        var successData = apiCallGet('get', '/getAllreferral', API_URI);
        $('#loader').hide();
        console.log(successData)
      },
      sendAttachment: function () {
        console.log("successData")
        var successData = apiCallGet('get', '/sendAttachment', API_URI);
        console.log(successData)
        var blob = new Blob([this.toArrayBuffer(successData.data.data)], { type: "application/pdf" });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = "test.pdf";
        link.download = fileName;
        link.click();
      },

      saveByteArray: function (reportName, byte) {
        var blob = new Blob([byte], { type: "application/pdf" });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = reportName;
        link.download = fileName;
        link.click();
      },
      toArrayBuffer: function (buf) {
        console.log(buf);
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
          view[i] = buf[i];
        }
        return ab;
      }
    },

  })

  $(document).on('change', '.tableCheckbox', function (e) {
    vueApp.selectcheck(e.target.checked, e.target.id);
  });

});

function sendPdf(uuid, role) {
  
  $('#loader').show();
  var successData = apiCallGet('get', '/downloadReferral/' + uuid + "/" + role, API_URI);
  var blob = new Blob([this.toArrayBuffer(successData.data.data)], { type: "application/pdf" });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.target = '_blank'
  var fileName = "test.pdf";
  //link.download = fileName;
  link.click();
  setTimeout(function () {
    $('#loader').hide();
  }, 1000);
  //link.click();
}
function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}