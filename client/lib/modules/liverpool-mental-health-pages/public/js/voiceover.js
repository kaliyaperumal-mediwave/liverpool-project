$(document).ready(function () {
    var ssu = new SpeechSynthesisUtterance();
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

    $('#playButton').on('click', function (e) {
        $('#stopButton').removeClass('active-border');
        document.getElementById('playButton').classList.remove('active-border');
        document.getElementById('stopButton').classList.add('active-border')
        document.getElementById('stopButton').style.opacity = 1;
        document.getElementById('stopButton').removeAttribute('disabled');
        document.getElementById('playButton').setAttribute('disabled', true);
        wrapper();
    });

    $('#stopButton').on('click', function (e) {
        document.getElementById('playButton').classList.add('active-border');
        document.getElementById('stopButton').classList.remove('active-border')
        document.getElementById('stopButton').setAttribute('disabled', true);
        document.getElementById('stopButton').style.opacity = 0.4;
        document.getElementById('playButton').removeAttribute('disabled');
        wrapper(true);
    });

    async function wrapper(stopFlag) {
        var text = description;
        var result = text.match(/[^\.!\?]+[\.!\?]+/g);
        var ssu = new SpeechSynthesisUtterance();
        for (var i = 0; i < result.length; i++) {
            sentence = result[i];
            ssu.text = sentence;
            ssu.lang = "en-US";
            await new Promise(function (resolve) {
                ssu.onend = resolve;
                if (stopFlag) {
                    ssu.text = ""
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(ssu);
                    return false;
                } else {
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(ssu);
                }
            });

        }
    }

    // var awaitVoices = new Promise(function (done) {
    //     return speechSynthesis.onvoiceschanged = done
    // });

    // function synthVoice(text) {
    //     const awaitVoices = new Promise(resolve =>
    //         window.speechSynthesis.onvoiceschanged = resolve)
    //         .then(() => {
    //             const synth = window.speechSynthesis;
    //             var voices = synth.getVoices();
    //             console.log(voices)
    //             const utterance = new SpeechSynthesisUtterance();
    //             utterance.voice = voices[3];
    //             utterance.text = text;
    //             synth.speak(utterance);
    //         });
    // }


    // function listVoices() {
    //     awaitVoices.then(function () {
    //         var msg = new SpeechSynthesisUtterance(title)
    //         let voices = speechSynthesis.getVoices();
    //         msg.voice = voices[1];
    //         window.speechSynthesis.speak(msg)
    //         $('#togglePlay').text('Pause');
    //     });
    // }

    $(window).on('beforeunload', function () {
        window.speechSynthesis.pause();
        wrapper(true)
    });

});