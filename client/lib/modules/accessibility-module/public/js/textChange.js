$(document).ready(function () {
    setTextSize();
    $('input[type=radio][name=font]').on('change', function () {
        var change = $(this).val();
        if (Number(change) >= 16) {
          //  console.log(currentTextSize, "current value")
            if (Number(change) >= Number(currentTextSize)) {
                var inc = Number(change) - Number(currentTextSize);
               // console.log('---inc', inc)
                $('p,h1,h2,h3,h4,h5,h6,label,span,button,input,a,textarea,select,option,li').each(function (res) {
                    var fontsize = parseInt($(this).css('font-size'));
                    var setLineHeight = Number(fontsize + inc) + 6;
                    var newFontsize = (fontsize + inc) + 'px';
                    $(this).css('font-size', newFontsize);
                   // $(this).css('line-height', setLineHeight + 'px')
                });
                currentTextSize = change;
            }
            else {
                var dec = Number(currentTextSize) - Number(change);
           //     console.log('dec---', dec)
                $('p,h1,h2,h3,h4,h5,h6,label,span,button,input,a,textarea,select,option,li').each(function (res) {
                    var fontsize = parseInt($(this).css('font-size'));
                    var setLineHeight = Number(fontsize + inc) + 6;
                    var newFontsize = (fontsize - dec) + 'px';
                    $(this).css('font-size', newFontsize);
                   // $(this).css('line-height', setLineHeight + 'px')
                });
                currentTextSize = change;
            }
        }
    });
});
