var uploadedDoc = null;

var data = $("#piecesvalue").text();
this.pdata_resources = JSON.parse(data);
console.log("------------", this.pdata_resources);

window.downloadPDF = function downloadPDF() {
  var dlnk = document.getElementById("document");
  dlnk.href = $("#uploadedDoc").attr("src");
  dlnk.click();
};

function doPrint() {
  $("#uploadedDoc")[0].contentWindow.print();
}

function clickPdf(url) {
  console.log('*******************', url);

  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    var link = document.createElement('a');
    link.href = url;
    link.target = '_blank'
    link.download = 'file.pdf';
    link.dispatchEvent(new MouseEvent('click'));
  }
  else{
    var _self = this;
    // if (_self.pdata_resources[index].doc_pdf.extension == 'docx') {
    //   $("iframe").addClass("d-none");
    //   $('#docxFileRemove').removeClass('d-none');
    // }
    // else {
    //   $("iframe").removeClass("d-none");
    //   $('#docxFileRemove').addClass('d-none');
    // }
    var url = url
    var isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i)
    console.log(url);
    $("#uploadedDoc").attr("src", url);
    $(".pdf-overlay").removeClass("d-none");
    if (
      navigator.userAgent.indexOf("MSIE") > -1 ||
      navigator.userAgent.indexOf("rv:") > -1 || isSamsungBrowser
    ) {
      if (isSamsungBrowser) {
        $("#MobileFormatRemove").removeClass("d-none");
        $("iframe").addClass("d-none");
      }
      else {
  
        $("#IEFormatRemove").removeClass("d-none");
        $("iframe").addClass("d-none");
      }
    }
  }
 
}


$(document).on("click", ".close_pdf", function () {
  $(".pdf-overlay").addClass("d-none");
});
