$(document).ready(function () {

  new Vue({
    el: '#admin',
    components: {
      'BootstrapTable': BootstrapTable
    },
    data: {
      toggle: true,
      columns: [
        {
          field: 'state',
          checkbox: true,
          align: "center"
        },
        {
          title: 'Patient <i class="fa fa-caret-down select-drop-down-icon" aria-hidden="true"></i>',
          field: 'Patient',
          align: "center"
        },
        {
          field: 'Code',
          title: 'Code',
          align: "center"
        },
        {
          field: 'Treatment',
          title: 'Treatment ',
          align: "center"
        },
        {
          field: 'Location',
          title: 'Location',
          align: 'center',
        },
        {
          field: 'Date',
          title: 'Date',
          align: 'center',
        },
        {
          field: 'Referrer',
          title: 'Referrer',
          align: 'center',
        },
        {
          field: 'Status',
          title: 'Status',
          align: 'center',
          class: "custom-color-field",
          event: {
            'click': () => { alert("ss") },
            'mouseenter': () => { },
            'mouseleave': () => { }
          }
        }
      ],
      data: [
        {
          Patient: "Abigail Tone",
          Code: 'HDJ2123F',
          Treatment: 'Psychotherapy',
          Location: 'Sefton',
          Date: '25/11/2020',
          Referrer: 'Molly Rail',
          Status: '<div class="dropdown" @click="selva()"><button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Active</button><div class="dropdown-menu" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" href="#">Active</a><a class="dropdown-item" href="#">Inactive</a></div></div>',
        },
        {
          Patient: "Bob Mines",
          Code: 'HDJ2453F',
          Treatment: 'Private health',
          Location: 'Liverpool',
          Date: '25/11/2020',
          Referrer: 'Molly Rail',
          Status: 'Not completed',
        },
        {
          Patient: "Candy Litch",
          Code: 'HDJ21235',
          Treatment: 'Private health',
          Location: 'Sefton',
          Date: '30/11/2020',
          Referrer: 'Richard Son',
          Status: 'Completed',
        },
        {
          Patient: "Esther Done",
          Code: 'HDJ21245',
          Treatment: 'Psychotherapy',
          Location: 'Liverpool',
          Date: '25/11/2020',
          Referrer: 'Molly Rail',
          Status: 'Completed',
        },

      ],
      options: {
        search: false,
        showColumns: false,
        pagination: true,
        sortStable: true,
      }
    },
    methods: {
      openToggle: function (toggle) {
        if (toggle) {
          this.toggle=false;
          document.getElementById('admin-slider').style.display = "block";
          document.getElementById('admin-rest').classList.add("added-js-slider")
          document.getElementById('admin-arrow-left').classList.add("rotate-icon")
          document.getElementById('toggle-cont').classList.add("toggle-extra-css")
        }
        else {
          this.toggle=true;
          document.getElementById('admin-slider').style.display = "none";
          document.getElementById('admin-rest').classList.remove("added-js-slider")
          document.getElementById('admin-arrow-left').classList.remove("rotate-icon")
          document.getElementById('toggle-cont').classList.remove("toggle-extra-css")
        }
      },
    }
  })
});


