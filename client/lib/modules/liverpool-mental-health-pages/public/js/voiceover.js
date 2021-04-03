
$(document).ready(function () {
    var isIE = false || !!document.documentMode;
    if (!isIE) {
        var ssu = new SpeechSynthesisUtterance();
        var myEvent = window.attachEvent || window.addEventListener;
        var voiceAttachEvent = window.attachEvent ? 'onbeforeunload' : 'beforeunload';
        if (localStorage.getItem('voiceOver') && localStorage.getItem('voiceOver') == 'on') {
            $('#c730ed34-ce14-4df1-8718-6346cd050c2b').show();
        } else if (localStorage.getItem('voiceOver') && localStorage.getItem('voiceOver') == 'off') {
            $('#c730ed34-ce14-4df1-8718-6346cd050c2b').removeClass('d-flex').addClass('d-none');
        } else {
            $('#c730ed34-ce14-4df1-8718-6346cd050c2b').removeClass('d-flex').addClass('d-none');
        }
        var title = $('#voiceOverTitle').text();
        title = title.trim();
        var description = $('#voiceOverDescription').text();
        description = description.trim();
        // optimisation needed
        // $("#playButton").hide();

        // document.getElementById('resumeButton').classList.add('d-none');
        // document.getElementById('playButton').classList.add('active-border');
        $('#playButton').on('click', function (e) {
            $('#stopButton').removeClass('active-border');
            document.getElementById('playButton').classList.remove('active-border');
            document.getElementById('stopButton').classList.add('active-border')
            document.getElementById('stopButton').style.opacity = 1;
            document.getElementById('stopButton').removeAttribute('disabled');
            document.getElementById('playButton').setAttribute('disabled', true);
            document.getElementById('playButton').classList.add('d-none');
            document.getElementById('pauseButton').classList.remove('d-none')

            // $("#playButton").hide();
            wrapper();
        });

        $('#stopButton').on('click', function (e) {
            document.getElementById('playButton').classList.add('active-border');
            document.getElementById('stopButton').classList.remove('active-border')
            document.getElementById('stopButton').setAttribute('disabled', true);
            document.getElementById('stopButton').style.opacity = 0.4;
            document.getElementById('playButton').removeAttribute('disabled');
            document.getElementById('resumeButton').classList.add('d-none');
            document.getElementById('pauseButton').classList.add('d-none');
            document.getElementById('playButton').classList.remove('d-none');
            $("#playButton").show();
            // $("#playButton").hide();

            wrapper(true);
        });

        $('#pauseButton').on('click', function (e) {
            document.getElementById('resumeButton').classList.remove('d-none');
            document.getElementById('pauseButton').classList.add('d-none')
            document.getElementById('stopButton').classList.add('active-border')
            document.getElementById('stopButton').style.opacity = 1;
            document.getElementById('stopButton').removeAttribute('disabled');
            $("#playButton").hide();

            window.speechSynthesis.pause();

        });
        $('#resumeButton').on('click', function (e) {
            document.getElementById('resumeButton').classList.add('d-none');
            document.getElementById('pauseButton').classList.remove('d-none');
            document.getElementById('stopButton').classList.add('active-border')
            document.getElementById('stopButton').style.opacity = 1;
            document.getElementById('stopButton').removeAttribute('disabled');
            $("#playButton").hide();

            window.speechSynthesis.resume();
        });
        var ssu = new SpeechSynthesisUtterance();
        function wrapper(stopFlag) {
            if (stopFlag) {
                ssu.text = ""
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(ssu);
                return false;
            }
            ssu.text = description;
            ssu.lang = "en-US";
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(ssu);
        }
        ssu.onend = function (e) {
            console.log('2 Finished in ' + e.elapsedTime + ' seconds.');
            document.getElementById('playButton').classList.add('active-border');
            document.getElementById('stopButton').classList.remove('active-border')
            document.getElementById('stopButton').setAttribute('disabled', true);
            document.getElementById('stopButton').style.opacity = 0.4;
            document.getElementById('playButton').removeAttribute('disabled');
            document.getElementById('playButton').classList.remove('d-none');
            document.getElementById('pauseButton').classList.add('d-none');
        };
        // ssu.onend = function (e) {
        //     console.log('Finished in ' + e.elapsedTime + ' seconds.');
        // };
        // async function wrapper(stopFlag) {
        //     console.log("called========");
        //     var text = description;
        //     var result = text.match(/[^\.!\?]+[\.!\?]+/g);
        //     console.log(result.length, "result.length");
        //     for (var i = 0; i < result.length; i++) {
        //         sentence = result[i];
        //         ssu.text = sentence;
        //         ssu.lang = "en-US";
        //         await new Promise(function (resolve) {
        //             if (stopFlag) {
        //                 ssu.text = ""
        //                 window.speechSynthesis.cancel();
        //                 window.speechSynthesis.speak(ssu);
        //                 return false;
        //             } else {
        //                 window.speechSynthesis.cancel();
        //                 window.speechSynthesis.speak(ssu);
        //             }
        //         });

        //     }
        // }


        // $(window).on('beforeunload', function () {
        //     console.log(" page end");
        //     ssu.text = ""
        //     window.speechSynthesis.cancel();
        //     window.speechSynthesis.speak(ssu);
        //     return false;
        //     // window.speechSynthesis.pause();
        //     // wrapper(true)
        // });

        myEvent(voiceAttachEvent, function (e) {
            window.speechSynthesis.cancel();
        });

        if ($('.checkEmpty').is(':visible')) {
            $(".replaceClass").addClass('col-6 col-lg-9');
            $(".replaceClass").removeClass('col-12');
            $(".checkEmpty").show();
        } else {
            var replace = $(".replaceClass");
            $(".replaceClass").removeClass('col-6 col-lg-9');
            $(".replaceClass").addClass('col-12');
            $(".checkEmpty").hide();
        }

    } else {
        $('#c730ed34-ce14-4df1-8718-6346cd050c2b').removeClass('d-flex').addClass('d-none')
    }

});
