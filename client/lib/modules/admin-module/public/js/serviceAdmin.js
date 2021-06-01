var API_URI = "/modules/admin-module";
$(document).ready(function () {
    $('#uniqueLogo').hide();
    $('#footer-placement').hide()
    var vueApp = new Vue({
        el: '#serviceAdmin',
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
            searchRefObj: {},
            SelectedProviderType: 'Liverpool',
            SelectedProviderStatus: '',
            statusOther: '',
            role: ''
        },

        beforeMount: function () {
            $('#loader').show();
        },

        mounted: function () {
            // this.fetchAllRef();
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

                $('th').on("click", function (event) {
                    if ($(event.target).is("div"))
                        event.stopImmediatePropagation();
                });
                $('#adminReferral').DataTable({
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
                        { targets: 8, orderable: true },
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
                            title: 'Referrals Data export',
                            exportOptions: {
                                columns: [1, 2, 3, 4, 5, 6, 7, 8]
                            }
                        }
                    ],
                    ajax: {
                        url: '/modules/admin-module/referral',
                        // url: '/modules/admin-module/getAllreferral',
                        type: 'GET',
                        dataFilter: function (referralRes) {

                            referralRes = jQuery.parseJSON(referralRes);
                              //console.log(referralRes);
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
                                    referralRes.data.data[i].refDate,
                                    referralRes.data.data[i].referral_status == 'YPAS' ? 'Forwarded to partner agency - YPAS' : 
                                    referralRes.data.data[i].referral_status == 'Venus' ? 'Forwarded to partner agency - Venus' : 
                                    referralRes.data.data[i].referral_status == 'Accepted by' ? 'Accepted by '+ referralRes.data.data[i].referral_provider_other : 
                                    referralRes.data.data[i].referral_status == 'Referral to other team' ? 'Referral to '+ referralRes.data.data[i].referral_provider_other : referralRes.data.data[i].referral_status,
                                    "<div class='d-flex'><button onclick='viewPdf(\"" + referralRes.data.data[i].uuid + "\",\"" + referralRes.data.data[i].referrer_type + "\",\"" + referralRes.data.data[i].referral_provider_other + "\")'  class='btn-pdf'>View</button><button onclick='openSendPopup(\"" + referralRes.data.data[i].uuid + "\",\"" + referralRes.data.data[i].referrer_type + "\" ,\"" + referralRes.data.data[i].reference_code + "\",\"" + referralRes.data.data[i].referral_provider + "\")' class='btn-pdf send-pdf'>Send</button><button onclick='changeStatus(\"" + referralRes.data.data[i].uuid + "\",\"" + referralRes.data.data[i].referral_status + "\",\"" + referralRes.data.data[i].referral_provider_other + "\")' class='btn-pdf send-pdf'>Change Status</button></div>",
                                    referralRes.data.data[i].date,
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
                    this.referral_ids.pop(id);
                }
            },

            deleteReferral: function () {
                if (this.referral_ids.length) {
                    $('#loader').show();
                    var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'deleted' });
                    $('#loader').hide();
                    if (successData && Object.keys(successData)) {
                        this.successMessage = 'Referrals deleted successfully'
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
                        this.successMessage = 'Referrals archived successfully';
                        $('#deletedSuccess').modal('show');
                    }
                }
            },
            unArchive: function () {
                if (this.referral_ids.length) {
                    $('#loader').show();
                    var successData = apiCallPut('put', '/referral', { referral_id: this.referral_ids, status: 'completed' });
                    $('#loader').hide();
                    if (successData && Object.keys(successData)) {
                        this.successMessage = 'Referrals unarchive successfully';
                        $('#deletedSuccess').modal('show');
                    }
                }
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
            },
            fetchAllRef: function () {
                var successData = apiCallGet('get', '/getAllreferral', API_URI);
                $('#loader').hide();
                //console.log()(successData)
            },
        },

    })

    $(document).on('change', '.tableCheckbox', function (e) {
        vueApp.selectcheck(e.target.checked, e.target.id);
    });

    $(document).on('change', '.reload', function () {
        console.log('Datatables reload');
        vueApp.fetchReferral();
    });
});

function viewPdf(uuid, role) {
    $('#loader').show();
    var _self = this;
    setTimeout(function () {
        var successData = apiCallGet('get', '/downloadReferral/' + uuid + "/" + role, API_URI);
        if (successData && Object.keys(successData)) {
            var blob = new Blob([_self.toArrayBuffer(successData.data.data)], { type: "application/pdf" });
            var isIE = false || !!document.documentMode;
            var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
            if (!isIE && !isSafari) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.target = '_blank'
                link.click();
                setTimeout(function () {
                    $('#loader').hide();
                }, 500);
            } else {
                download(blob, uuid + ".pdf", "application/pdf");
                setTimeout(function () {
                    $('#loader').hide();
                }, 500);
            }
        }
    }, 500);
}

function changeStatus(uuid, value, other_value) {
    if (value === 'Referral to other team' || value === 'Accepted by' && other_value != null) {
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

function updateStatus(uuid) {
    $('#loader').show();
    setTimeout(function () {
        var status = $('#SelectedProviderStatus').val();
        var postData = {
        referral_id: uuid,
        status: status
        }
        if (status === 'Referral to other team' || status === 'Accepted by') {
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

function openSendPopup(uuid, role, refCode, referral_provider) {
    $('#sendProviderModal').modal('show');
    $("#SelectedProvider option[value='" + referral_provider + "']").remove();
    document.getElementById('sendRef').setAttribute('onclick', 'sendPdf(\'' + uuid + '\',\'' + role + '\',\'' + refCode + '\',\'' + referral_provider + '\')');
}

function sendPdf(uuid, role, refCode) {
    $('#loader').show();
    setTimeout(function () {
      var selectedProvider = document.getElementById('SelectedProvider').value;
      var successData = apiCallGet('get', '/sendReferral/' + uuid + "/" + role + "/" + selectedProvider + "/" + refCode, API_URI);
      if (successData && Object.keys(successData)) {
        $('.reload').trigger('click');
        $('#sendProviderModal').modal('hide');
        $('#mailSentSuccess').modal('show');
        setTimeout(function () {
          $('#loader').hide();
        }, 500);
      }
      else {
        setTimeout(function () {
          $('#loader').hide();
        }, 500);
        $('#sendProviderModal').modal('hide');
      }
    }, 500);
  }

function closeAlreadySentPopup() {
    $('#referralAlreadySent').modal('hide');
}
$(document).on('change', '#SelectedProviderStatus', function (e) {
    if (e.target.value === 'Referral to other team' || e.target.value === 'Accepted by') {
      $('#otherTeam').show();
    } else {
      $('#otherTeam').hide();
    }
});