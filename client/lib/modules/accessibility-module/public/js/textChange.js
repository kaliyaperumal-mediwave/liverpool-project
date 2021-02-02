$(document).ready(function () {
    var current = 18;
    setTextSize();
    $('input[type=radio][name=font]').on('change', function () {
        console.log(" vacurrentlue", $(this).val())
        var change = $(this).val();
        if (Number(change) >= 16) {
            console.log(current, "current value")
            if (Number(change) >= Number(current)) {
                var inc = Number(change) - Number(current);
                console.log('---inc', inc)
                $('p,h1,h2,h3,h4,h5,label,span,button,input,a').each(function (res) {
                    var fontsize = parseInt($(this).css('font-size'));
                    var newFontsize = (fontsize + inc) + 'px';
                    $(this).css('font-size', newFontsize);
                });
                console.log('if change', change)
                console.log('if current', current)
                current = change;
            }
            else {
                var dec = Number(current) - Number(change);
                console.log('dec---', dec)
                $('p,h1,h2,h3,h4,h5,label,span,button,input,a').each(function (res) {
                    var fontsize = parseInt($(this).css('font-size'));
                    var newFontsize = (fontsize - dec) + 'px';
                    $(this).css('font-size', newFontsize);
                });
                console.log('else change', change)
                console.log('else current', current)
                current = change;
            }
        }
    });

    function setTextSize() {
        var textSize = localStorage.getItem('textSize');
        if(textSize && (Number(textSize) >= 16)) {
            $('p,h1,h2,h3,h4,h5,label,span,button,input,a').each(function (res) {
                var newFontsize = textSize + 'px';
                $(this).css('font-size', newFontsize);
            });
        }
    }
});