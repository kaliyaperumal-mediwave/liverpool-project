$(document).ready(function () {
    setTextSize();
    $('input[type=radio][name=font]').on('change', function () {
        console.log(" vacurrentlue", $(this).val())
        var change = $(this).val();
        if (Number(change) >= 16) {
            console.log(currentTextSize, "current value")
            if (Number(change) >= Number(currentTextSize)) {
                var inc = Number(change) - Number(currentTextSize);
                console.log('---inc', inc)
                $('p,h1,h2,h3,h4,h5,label,span,button,input,a').each(function (res) {
                    var fontsize = parseInt($(this).css('font-size'));
                    var newFontsize = (fontsize + inc) + 'px';
                    $(this).css('font-size', newFontsize);
                });
                currentTextSize = change;
            }
            else {
                var dec = Number(currentTextSize) - Number(change);
                console.log('dec---', dec)
                $('p,h1,h2,h3,h4,h5,label,span,button,input,a').each(function (res) {
                    var fontsize = parseInt($(this).css('font-size'));
                    var newFontsize = (fontsize - dec) + 'px';
                    $(this).css('font-size', newFontsize);
                });
                currentTextSize = change;
            }
        }
    });
});