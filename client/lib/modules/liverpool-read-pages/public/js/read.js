var uploadedDoc = null;

var data = $("#piecesvalue").text();
this.pdata_resources = JSON.parse(data);
console.log("------------",this.pdata_resources);

window.downloadPDF = function downloadPDF() {
  var dlnk = document.getElementById("document");
  dlnk.href = $("#uploadedDoc").attr("src");
  dlnk.click();
};

function doPrint() {
  $("#uploadedDoc")[0].contentWindow.print();
}

function clickPdf (index) {
  // console.log('*******************',index);
  var _self = this;
  if (_self.pdata_resources[index].doc_pdf.extension == 'docx') {
    $("iframe").addClass("d-none");
    $('#docxFileRemove').removeClass('d-none');
  }
  else {
    $("iframe").removeClass("d-none");
    $('#docxFileRemove').addClass('d-none');
  }
  var url =
    "/liverpool/attachments/" +
    _self.pdata_resources[index].doc_pdf._id +
    "-" +
    _self.pdata_resources[index].doc_pdf.name +
    "." +
    _self.pdata_resources[index].doc_pdf.extension;
    // console.log(url);
  $("#uploadedDoc").attr("src", url);
  $(".pdf-overlay").removeClass("d-none");
  if (
    navigator.userAgent.indexOf("MSIE") > -1 ||
    navigator.userAgent.indexOf("rv:") > -1
  )
  {
    $("#IEFormatRemove").removeClass("d-none");
    $("iframe").addClass("d-none");
  }
  _self.favHide = _self.pdata_resources[index].fav ? true : false;
}


$(document).on("click", ".close_pdf", function () {
  $(".pdf-overlay").addClass("d-none");
});
