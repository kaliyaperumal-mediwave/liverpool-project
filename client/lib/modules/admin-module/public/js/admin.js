var API_URI = "/modules/admin-module";
$(document).ready(function () {
  $('#uniqueLogo').hide();
  $('#footer-placement').hide()
  Vue.component('fromdate-picker', VueBootstrapDatetimePicker);
  Vue.component('todate-picker', VueBootstrapDatetimePicker);
  if (window.VueMultiselect) {
    Vue.component('vue-multiselect', window.VueMultiselect.default)
  }
  var vueApp = new Vue({
    el: '#admin',
    // components: { Multiselect: window.VueMultiselect?.default },
    data: {
      searchTxt: "",
      fromcsvDate: {},
      tocsvDate: {},
      dateWrap: true,
      toggle: true,
      referralData: [],
      pageLimit: 10,
      pageNum: 1,
      referral_ids: [],
      dataSet: [],
      successMessage: '',
      draw: 1,
      searchRefObj: {},
      SelectedProviderType: 'Liverpool',
      loading: false,
      SelectedProviderStatus: '',
      statusOther: '',
      role: '',
      archivePage: '',
      urlToLoadData: '',
      dateArr: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      monthArr: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      yearArr: [],
      dateVal: "",
      monthVal: "",
      yearVal: "",
      fromdateString: "",
      todateString: "",
      dateRegex: /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
      groupByActivityDate: [],
      fromDateCsv: '',
      toDateCsv: '',
      copyFromDateCsv: '',
      copyToDateCsv: '',
      isCsvDownloadSubmitted: false,
      showInvalidToDate: false
    },

    beforeMount: function () {
      $('#loader').show();
    },

    mounted: function () {
      var date = new Date().getFullYear();
      for (var i = date; i > 1989; i--) {
        this.yearArr.push(i);
      }
      this.archivePage = document.getElementById('isItArchivePge').innerHTML;
      console.log(this.archivePage)
      if (this.archivePage == 'true') {
        this.urlToLoadData = '/modules/admin-module/getArchived'
      }
      else {
        this.urlToLoadData = '/modules/admin-module/referral'
      }
      if (localStorage.role) {
        this.role = localStorage.role;
        //console.log(this.role);
      }
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
        console.log(_self.urlToLoadData)
        $('th').on("click", function (event) {
          if ($(event.target).is("div"))
            event.stopImmediatePropagation();
        });
        var table = $('#adminReferral').DataTable({
          dom: 'lBfrtip',
          select: true,
          destroy: true,
          processing: false,
          serverSide: true,
          select: {
            style: 'multi',
            selector: 'td:first-child .idcheck'
          },
          columnDefs: [
            { targets: 0, orderable: false },
            { targets: 1, orderable: true },
            { targets: 2, orderable: true, type: 'date-uk' },
            { targets: 4, orderable: true },
            { targets: 5, orderable: true },
            { targets: 6, orderable: true },
            { targets: 7, orderable: true, type: 'date-uk' },
            {
              targets: 8,
              orderable: true,
              render: function (data, type, i) {
                return data;
              }
            },
            { targets: 9, orderable: false },
          ],
          lengthMenu: [[10, 50, 100, 250, -1], [10, 50, 100, 250, "All"]],
          order: [[10, 'desc']],
          language: {
            searchPlaceholder: 'Search referral',
            emptyTable: 'No referrals to displays',
            zeroRecords: 'No matching referrals found'
          },
          buttons: [
            {
              extend: 'csv',
              text: 'Export as CSV',
              title: 'referrals_data_export_' + (new Date().toISOString().slice(0, 10)),
              exportOptions: {
                columns: [1, 2, 3, 4, 5, 6, 7, 8]
              }
            }
          ],

          ajax: {
            url: _self.urlToLoadData,
            // url: '/modules/admin-module/getAllreferral',
            type: 'GET',
            cache: false,
            dataFilter: function (referralRes) {
              referralRes = jQuery.parseJSON(referralRes);
              console.log(referralRes, "referralRes");
              var json = {
                draw: _self.draw,
                data: [],
                recordsTotal: referralRes.data.totalReferrals,
                recordsFiltered: referralRes.data.filteredReferrals
              };
              _self.draw += 1;
              for (var i = 0; i < referralRes.data.data.length; i++) {
                json.data.push([
                  "<input type='checkbox' class='idcheck' id='" + referralRes.data.data[i].uuid + "' name='" + referralRes.data.data[i].uuid + "' value='" + referralRes.data.data[i].uuid + "'>",
                  referralRes.data.data[i].name,
                  referralRes.data.data[i].dob,
                  referralRes.data.data[i].reference_code,
                  referralRes.data.data[i].referrer,
                  referralRes.data.data[i].gp_location,
                  referralRes.data.data[i].referrer_type,
                  referralRes.data.data[i].refDate,
                  referralRes.data.data[i].referral_status == 'YPAS' ? 'Forwarded to partner agency - YPAS' :
                    referralRes.data.data[i].referral_status == 'Venus' ? 'Forwarded to partner agency - Venus' :
                      referralRes.data.data[i].referral_status == 'Accepted by' ? 'Accepted' :
                        referralRes.data.data[i].referral_status == 'Referral to other team' ? 'Referral to ' + referralRes.data.data[i].referral_provider_other : referralRes.data.data[i].referral_status,

                  "<div class='d-flex'><button onclick='viewPdf(\"" + referralRes.data.data[i].uuid + "\",\"" + referralRes.data.data[i].referrer_type + "\",\"" + referralRes.data.data[i].referral_provider_other + "\")'  class='btn-pdf'>View</button><button onclick='changeStatus(\"" + referralRes.data.data[i].uuid + "\",\"" + referralRes.data.data[i].referral_status + "\",\"" + referralRes.data.data[i].referral_provider_other + "\")' class='btn-pdf send-pdf'>Change Status</button><button onclick='openSendPopup(\"" + referralRes.data.data[i].uuid + "\",\"" + referralRes.data.data[i].referrer_type + "\" ,\"" + referralRes.data.data[i].reference_code + "\",\"" + referralRes.data.data[i].referral_provider + "\")' class='btn-pdf send-pdf'>Send</button><button onclick='actionlog(\"" + referralRes.data.data[i].uuid + "\",\"" + referralRes.data.data[i].referral_status + "\",\"" + referralRes.data.data[i].referral_provider_other + "\")' class='btn-pdf send-pdf'>Action Log</button></div>",

                  referralRes.data.data[i].date,
                ]);
              }
              return JSON.stringify(json);
            }
          }
        });

        $("#ExportReporttoExcel").on("click", function () {
          _self.isCsvDownloadSubmitted = true;
          _self.fromDateCsv = _self.fromDateCsv.replace(/\s/g, "");
          _self.toDateCsv = _self.toDateCsv.replace(/\s/g, "");
          var fromDateArr = _self.fromDateCsv.split('/');
          var toDateCsv = _self.toDateCsv.split('/');
          fromDateArr.move(0, 1);
          toDateCsv.move(0, 1);
          var finalFromRes = fromDateArr.join('/');
          var finalToRes = toDateCsv.join('/');
          console.log(finalFromRes, finalToRes)
          // finalFromRes= "08/01/2021";
          // finalToRes = "08/20/2021";
          if (_self.fromDateCsv && _self.toDateCsv) {
            if (_self.dateRegex.test(_self.fromDateCsv) && _self.dateRegex.test(_self.toDateCsv)) {
              if (new Date(finalToRes).getTime() >= new Date(finalFromRes).getTime()) {
                _self.showInvalidToDate = false;
                var getFromData = _self.fromDateCsv.split('/');
                var getToData = _self.toDateCsv.split('/');
                console.log('from and to', getFromData, getToData)
                //let result = apiCallGet('get', '/getActivity?fromDate=' + _self.fromcsvDate.mm + '/' + _self.fromcsvDate.dd + '/' + _self.fromcsvDate.yy + '&endDate=' + _self.tocsvDate.mm + '/' + _self.tocsvDate.dd + '/' + _self.tocsvDate.yy, API_URI);
                let result = apiCallGet('get', '/getActivity?fromDate=' + getFromData[1] + '/' + getFromData[0] + '/' + getFromData[2] + '&endDate=' + getToData[1] + '/' + getToData[0] + '/' + getToData[2], API_URI);
                console.log(result)
                var rows = []
                result.data.filter_referrals = _.sortBy(result.data.filter_referrals, ['date', 'reference_code', 'activity_user'])
                rows.push(['Name', 'DOB', 'Unique code', 'Referrer', 'GP location', 'Referrer type', 'Referral date', 'Status', 'Last updated', 'Activity date', 'Activity time', 'Activity user', 'Activity action'])
                for (var i = 0; i < result.data.filter_referrals.length; i++) {
                  rows.push([
                    result.data.filter_referrals[i].name,
                    result.data.filter_referrals[i].dob,
                    result.data.filter_referrals[i].reference_code,
                    result.data.filter_referrals[i].referrer,
                    result.data.filter_referrals[i].gp_location,
                    result.data.filter_referrals[i].referrer_type,
                    result.data.filter_referrals[i].refDate,
                    result.data.filter_referrals[i].referral_status == 'YPAS' ? 'Forwarded to partner agency - YPAS' :
                      result.data.filter_referrals[i].referral_status == 'Venus' ? 'Forwarded to partner agency - Venus' :
                        result.data.filter_referrals[i].referral_status == 'Accepted by' ? 'Accepted' :
                          result.data.filter_referrals[i].referral_status == 'Referral to other team' ? 'Referral to ' + result.data.filter_referrals[i].referral_provider_other : result.data.filter_referrals[i].referral_status,
                    result.data.filter_referrals[i].date,
                    result.data.filter_referrals[i].activity_date,
                    result.data.filter_referrals[i].activity_time,
                    result.data.filter_referrals[i].activity_user,
                    result.data.filter_referrals[i].activity_action,
                  ]);
                }
                //download(blob, uuid + ".pdf", "application/pdf");
                let csvContent = rows.map(function (e) { return e.join(",") }).join("\n");
                // console.log(rows.map(function (e) { return e.join(",") }).join("\n"))
                //console.log(rows)
                var encodedUri = encodeURI(csvContent);
                //console.log(csvContent)
                var blob = new Blob([csvContent], { type: "text/csv" });
                //console.log(blob)
                download(blob, "ReferralActivities" + moment().format("DD-MM-YYYY") + ".csv", "text/csv");
                table.rows().deselect();
                $('.idcheck').removeAttr('checked');
                this.referral_ids = [];
                _self.closeStatusPopup();
                _self.fromDateCsv = "";
                _self.toDateCsv = "";
                _self.isCsvDownloadSubmitted = false;
                _self.showInvalidToDate = false;

                // var link = document.createElement("a");

                // link.setAttribute("href", encodedUri);
                // link.setAttribute("download", "my_data.csv");
                // document.body.appendChild(link); // Required for FF

                // link.click(); // This will download the data file named "my_data.csv".
                // table.rows().deselect();
                // $('.idcheck').removeAttr('checked');
                // this.referral_ids = [];
                // _self.closeStatusPopup();
                // _self.fromDateCsv = "";
                // _self.toDateCsv = "";
                // _self.isCsvDownloadSubmitted = false;
                // _self.showInvalidToDate = false;
                // _self.fromcsvDate = {};
                // _self.tocsvDate = {};
              } else {
                _self.showInvalidToDate = true;
                $('#downloadCSV').modal('show');
                return false;
              }

            } else {
              $('#downloadCSV').modal('show');
              return false;
            }

          } else {
            $('#downloadCSV').modal('show');
            return false;
          }

        });

        this.referral_ids = [];
        $('#loader').hide();
      },

      selectcheck: function (checked, id) {
        if (checked) {
          this.referral_ids.push(id);
        } else {
          this.referral_ids.pop(id);
        }
      },
      resetReferral: function () {
        this.referral_ids = [];
      },
      deletePopup: function () {
        if (this.referral_ids && this.referral_ids.length) {
          $('#deletePopup').modal('show');
        }
      },
      deleteReferral: function () {
        if (this.referral_ids.length) {
          var _self = this;
          var payload = { referral_id: _self.referral_ids, status: 'deleted' }
        }
        var trimmedPayload = trimObj(payload);
        $('#loader').show();
        $.ajax({
          url: API_URI + '/referral',
          type: 'put',
          dataType: 'json',
          async: false,
          contentType: 'application/json',
          data: JSON.stringify(trimmedPayload),
          success: function (res) {
            $('#deletePopup').modal('hide');
            _self.successMessage = 'Referrals deleted successfully';
            $('#deletedSuccess').modal('show');
            _self.fetchReferral();
            $('#loader').hide();
          },
          error: function (error) {
            $('#loader').hide();
            if (error) {
              showError(error.responseJSON.message, error.status);
            }
          }
        });

      },
      getDob: function () {
        var manualHouseHoldText = document.getElementById('7a53ccec-e9fc-422b-b410-6c5ec82377d7');
        var selectedDate = this.houseHoldData.day + '/' + this.houseHoldData.month + '/' + this.houseHoldData.year
        if (this.houseHoldData.day && this.houseHoldData.month && this.houseHoldData.year) {
          if (this.getAge(selectedDate) < 19) {
            this.houseHoldData.dob = selectedDate;
            this.showHouseHoldAddress = true;
          } else {
            this.setReadonlyStateHouseHold(false, '7a53ccec-e9fc-422b-b410-6c5ec82377d7', '94a4bca4-a05e-44d6-974b-0f09e2e4c576');
            this.showManualAddressHouseHold = false;
            manualHouseHoldText.innerText = 'Enter manually';
            this.showHouseHoldAddress = false;
            this.houseHoldData.profession = "";
            this.resetHouseholdManualAddressValue();
          }

        } else {
          this.setReadonlyStateHouseHold(false, '7a53ccec-e9fc-422b-b410-6c5ec82377d7', '94a4bca4-a05e-44d6-974b-0f09e2e4c576');
          this.showManualAddressHouseHold = false;
          manualHouseHoldText.innerText = 'Enter manually';
          this.showHouseHoldAddress = false;
          this.houseHoldData.profession = "";
          this.resetHouseholdManualAddressValue();
        }

      },

      unArchive: function () {
        if (this.referral_ids.length) {
          var _self = this;
          var payload = { referral_id: _self.referral_ids, status: 'completed' }
          var trimmedPayload = trimObj(payload);
          $('#loader').show();
          $.ajax({
            url: API_URI + '/referral',
            type: 'put',
            dataType: 'json',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify(trimmedPayload),
            success: function (res) {
              _self.successMessage = 'Unarchive successful';
              $('#deletedSuccess').modal('show');
              _self.fetchReferral();
              $('#loader').hide();
            },
            error: function (error) {
              $('#loader').hide();
              if (error) {
                showError(error.responseJSON.message, error.status);
              }
            }
          });
        }
      },

      archiveReferral: function () {
        var _self = this;
        if (_self.referral_ids.length) {
          var payload = { referral_id: _self.referral_ids, status: 'archived' }
          var trimmedPayload = trimObj(payload);
          $('#loader').show();
          $.ajax({
            url: API_URI + '/referral',
            type: 'put',
            dataType: 'json',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify(trimmedPayload),
            success: function (res) {
              _self.successMessage = 'Referrals archived successfully';
              $('#deletedSuccess').modal('show');
              _self.fetchReferral();
              $('#loader').hide();
            },
            error: function (error) {
              $('#loader').hide();
              if (error) {
                showError(error.responseJSON.message, error.status);
              }
            }
          });
        }
      },

      checkValue: function (str, max) {
        if (str.charAt(0) !== '0' || str == '00') {
          var num = parseInt(str);
          if (isNaN(num) || num <= 0 || num > max) num = 1;
          str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
        };
        return str;
      },

      preventRefresh: function (e) {
        stopRefresh(e);
      },

      checkValidDate: function (id, key, duplicateKey) {
        var dateElement = document.querySelector(id);
        var input = dateElement.value;
        if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);
        var values = input.split('/').map(function (v) {
          return v.replace(/\D/g, '')
        });
        var currentDate = {
          year: new Date().getFullYear(),
          month: parseInt(new Date().getMonth()) + 1,
          date: new Date().getDate()
        }
        if ((values[2] && values[2] > 2021) || (parseInt(values[2]) === 0)) {
          values[2] = 2021;
        } else if (values[2] && values[2].length == 4 && values[2] < 1900) {
          values[2] = 1900;
        }
        if (values[1]) {
          if (values[2]) {
            values[1] = (values[1] > currentDate.month && values[2] >= currentDate.year) ? currentDate.month : values[1];
            values[1] = ("0" + values[1]).slice(-2)
          }
          values[1] = this.checkValue(values[1], 12);
        }
        if (values[0]) {
          if (values[2]) {
            values[0] = (values[0] > currentDate.date && values[1] >= currentDate.month && values[2] >= currentDate.year) ? currentDate.date : values[0];
            values[0] = ("0" + values[0]).slice(-2)
          }
          values[0] = this.checkValue(values[0], 31);
        }
        var output = values.map(function (v, i) {
          return v.length == 2 && i < 2 ? v + ' / ' : v;
        });
        copyOutput = JSON.parse(JSON.stringify(values)).map(function (v, i) {
          return v.length == 2 && i < 2 ? v + '/' : v;
        });
        dateElement.value = copyOutput.join('').substr(0, 14);
        this[key] = output.join('').substr(0, 14);
        this[duplicateKey] = copyOutput.join('').substr(0, 14);
      },


      closeModal: function () {
        $('#example').DataTable().ajax.reload();
        $('#deletedSuccess').modal('hide');
        this.successMessage = '';
      },
      closeMailSuccessPopup: function () {
        $('#example').DataTable().ajax.reload();
        $('#mailSentSuccess').modal('hide');
      },
      closeUpdateSuccessPopup: function () {
        this.SelectedProviderStatus = '';
        $('#adminReferral').DataTable().ajax.reload();
        $('#statusUpdatedSuccess').modal('hide');
      },
      closeStatusPopup: function () {
        this.SelectedProviderStatus = '';
        $('#changeStatusModal').modal('hide');
        $('#actionlogModal').modal('hide');
        $('#downloadCSV').modal('hide');
        this.fromDateCsv = "";
        this.toDateCsv = "";
        this.isCsvDownloadSubmitted = false;
        this.showInvalidToDate = false;
      },
      fetchAllRef: function () {
        var successData = apiCallGet('get', '/getAllreferral', API_URI);
        $('#loader').hide();
        //console.log()(successData)
      },
      getActivity: function (uuid, value) {
        let result = apiCallGet('get', '/getActivity', API_URI);
        let specificReferral = _.filter(result.data.activity_referrals, function (o) {
          o['date'] = moment(o.createdAt).format('DD/MM/YYYY')
          o['time'] = moment(moment(o.createdAt).tz('Europe/London')).format('H:mm:ss')

          // o['time'] = moment(o.createdAt).format('h:mm:ss')
          //console.log(moment(o.createdAt).format('h:mm:ss'))
          return o.ReferralId == uuid;
        })
        specificReferral.push({ date: value.split(" ")[0], time: value.split(" ")[1], activity: 'Referral received', userInfo: [] })
        console.log(specificReferral, "specificReferral");
        this.groupByActivityDate = _.groupBy(specificReferral, 'date');
        console.log(this.groupByActivityDate);
      }
    },
  })

  $(document).on('change', '.idcheck', function (e) {
    vueApp.selectcheck(e.target.checked, e.target.value);
  });
  $(document).on('change', '.reload', function () {
    // console.log('Datatables reload');
    vueApp.fetchReferral();
  });
  $(document).on('click', '#ExportReporttoExcel', function () {
    vueApp.resetReferral();
  });

  actionlog = function (uuid, value, other_value) {
    document.getElementById('updateStatus').setAttribute('onclick', 'updateStatus(\'' + uuid + '\')');
    vueApp.getActivity(uuid, value);
    $('#actionlogModal').modal('show');
  }
});

function viewPdf(uuid, role) {
  createActivity("Referral viewed", uuid);
  var _self = this;
  $('#loader').show();
  setTimeout(function () {
    var successData = apiCallGet('get', '/downloadReferral/' + uuid + "/" + role, API_URI);
    if (successData && Object.keys(successData)) {
      var blob = new Blob([_self.toArrayBuffer(successData.data.data)], { type: "application/pdf" });
      var isIE = false || !!document.documentMode;
      var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
      var isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i)
      var iphone = navigator.userAgent.match(/iPhone/i);
      var ipad = navigator.userAgent.match(/iPad/i);
      if (!isIE && !isSafari && !isSamsungBrowser && !iphone && !ipad) {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.target = '_blank'
        link.click();
        setTimeout(function () {
          $('#loader').hide();
        }, 500);
      }
      else {
        download(blob, uuid + ".pdf", "application/pdf");
        setTimeout(function () {
          $('#loader').hide();
        }, 500);
      }
    }
  }, 500);
}

function changeStatus(uuid, value, other_value) {
  if (value === 'Referral to other team' && other_value != null) {
    $('#SelectedProviderStatus').val(value);
    document.getElementById("statusOther").value = other_value;
  } else {
    $('#otherTeam').hide();
  }
  document.getElementById('updateStatus').setAttribute('onclick', 'updateStatus(\'' + uuid + '\')');
  $('#changeStatusModal').modal('show');
  setTimeout(function () {
    $("#SelectedProviderStatus").val(value);
  }, 500);
}



function downloadCSV(uuid, value, other_value) {
  document.getElementById('updateStatus').setAttribute('onclick', 'updateStatus(\'' + uuid + '\')');
  $('#downloadCSV').modal('show');
}

function updateStatus(uuid) {
  $('#loader').show();
  setTimeout(function () {
    var status = $('#SelectedProviderStatus').val();
    var postData = {
      referral_id: uuid,
      status: status
    }
    if (status === 'Referral to other team') {
      postData.other = $('#statusOther').val();
    }
    var successData = apiCallPut('put', '/referralStatusUpdate', postData);
    if (successData && Object.keys(successData)) {
      document.getElementById("statusOther").value = '';
      $('#changeStatusModal').modal('hide');
      $('#statusUpdatedSuccess').modal('show');
      setTimeout(function () {
        $('#loader').hide();
      }, 500);
    }
    else {
      setTimeout(function () {
        $('#loader').hide();
      }, 500);
      $('#changeStatusModal').modal('hide');
    }
  }, 500);
}


function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
function sendPdf(uuid, role, refCode) {
  var useAPI = true;
  if (document.querySelector('.messageCheckbox:checked') != null) {
    useAPI = document.querySelector('.messageCheckbox:checked').value;
  }
  $('#loader').show();
  var apiToSend;
  var selectedProvider = document.getElementById('SelectedProvider').value;
  // if (useAPI && (selectedProvider == "YPAS" || selectedProvider == "Venus")) {
  //   apiToSend = '/sendReferralByApi/' + uuid + "/" + role + "/" + selectedProvider + "/" + refCode
  // }
  // else {
  //   apiToSend = '/sendReferral/' + uuid + "/" + role + "/" + selectedProvider + "/" + refCode
  // }
  if (selectedProvider == "YPAS") {
    apiToSend = '/sendReferralByApi/' + uuid + "/" + role + "/" + selectedProvider + "/" + refCode
  }
  else {
    apiToSend = '/sendReferral/' + uuid + "/" + role + "/" + selectedProvider + "/" + refCode
  }
  $.ajax({
    url: API_URI + apiToSend,
    type: 'get',
    dataType: 'json',
    async: false,
    contentType: 'application/json',
    success: function (res) {
      createActivity("Referral sent - " + selectedProvider, uuid);
      $('.reload').trigger('click');
      $('#sendProviderModal').modal('hide');
      $('#mailSentSuccess').modal('show');
      $('#loader').hide();
    },
    error: function (error) {
      $('#loader').hide();
      console.log(error)
      console.log(error.responseJSON.data.data)
      $('#sendProviderModal').modal('hide');
      if (error) {
        showError(error.responseJSON.message, error.status);
      }
    }
  });
}
function openSendPopup(uuid, role, refCode, referral_provider) {
  $('#sendProviderModal').modal('show');
  document.getElementById('sendRef').setAttribute('onclick', 'sendPdf(\'' + uuid + '\',\'' + role + '\',\'' + refCode + '\')');
}

function closeAlreadySentPopup() {
  $('#referralAlreadySent').modal('hide');
}
$(document).on('change', '#SelectedProviderStatus', function (e) {
  if (e.target.value === 'Referral to other team') {
    $('#otherTeam').show();
  } else {
    $('#otherTeam').hide();
  }
});

function createActivity(activity, referral) {
  let postData = {};
  postData.activity = {
    activity: activity,
    referral: referral
  }
  apiCallPut('put', '/referralStatusUpdate', postData);
}
