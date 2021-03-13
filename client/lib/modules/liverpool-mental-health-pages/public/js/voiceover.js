$(document).ready(function () {
    var togglePause = false;
    var ssu = new SpeechSynthesisUtterance();
    var title = $('#voiceOverTitle').text();
    title = title.trim();
    var description = $('#voiceOverDescription').text();
    description = description.trim();
    $('#togglePlayIcon').on('click', function (e) {

        if ($(this).hasClass('fa fa-play-circle-o')) {
            $(this).removeClass('fa fa-play-circle-o').addClass('fa fa-pause-circle-o');
            wrapper();
        } else if ($(this).hasClass('fa fa-pause-circle-o')) {
            window.speechSynthesis.cancel();
            $(this).removeClass('fa fa-pause-circle-o').addClass('fa fa-play-circle-o');
            $('#togglePlay').text('Pause');
        } else {
            $(this).removeClass('fa fa-pause-circle-o').addClass('fa fa-play-circle-o');
            $('#togglePlay').text('Play');
        }

    });


    async function wrapper() {
        var text = description;
        var result = text.match(/[^\.!\?]+[\.!\?]+/g);
        var ssu = new SpeechSynthesisUtterance();
        for (var i = 0; i < result.length; i++) {
            sentence = result[i];
            ssu.text = sentence;
            ssu.lang = "en-US";
            await new Promise(function (resolve) {
                ssu.onend = resolve;
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(ssu);

            });
        }
        $('#togglePlayIcon').removeClass('fa fa-pause-circle-o').addClass('fa fa-play-circle-o');
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

});