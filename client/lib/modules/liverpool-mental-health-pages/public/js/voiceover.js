
$(document).ready(function () {
    var userPlatform = getMobileOperatingSystem();
    if (userPlatform == 'Android') {
        alert(userPlatform);
        var ssu = new SpeechSynthesisUtterance();
        var myEvent = window.attachEvent || window.addEventListener;
        $('#c730ed34-ce14-4df1-8718-6346cd050c2b').removeClass('d-flex').addClass('d-none');
        if (localStorage.getItem('voiceOver') && localStorage.getItem('voiceOver') == 'on') {
            $('#androidContainer').removeClass('d-none').addClass('d-flex');
        } else if (localStorage.getItem('voiceOver') && localStorage.getItem('voiceOver') == 'off') {
            $('#androidContainer').removeClass('d-flex').addClass('d-none');
        } else {
            $('#androidContainer').removeClass('d-flex').addClass('d-none');
        }
        var title = $('#voiceOverTitle').text();
        title = title.trim();
        var description = $('#voiceOverDescription').text();
        description = description.trim();

        $('#playAndroidButton').on('click', function (e) {
            $('#stopAndroidButton').removeClass('active-border');
            document.getElementById('playAndroidButton').classList.remove('active-border');
            document.getElementById('stopAndroidButton').classList.add('active-border')
            document.getElementById('stopAndroidButton').style.opacity = 1;
            document.getElementById('stopAndroidButton').removeAttribute('disabled');
            document.getElementById('playAndroidButton').setAttribute('disabled', true);
            document.getElementById('playAndroidButton').classList.add('d-none');
            wrapper();
        });

        $('#stopAndroidButton').on('click', function (e) {
            document.getElementById('playAndroidButton').classList.add('active-border');
            document.getElementById('stopAndroidButton').classList.remove('active-border')
            document.getElementById('stopAndroidButton').setAttribute('disabled', true);
            document.getElementById('stopAndroidButton').style.opacity = 0.4;
            document.getElementById('playAndroidButton').removeAttribute('disabled');
            document.getElementById('playAndroidButton').classList.remove('d-none');
            $("#playAndroidButton").show();
            wrapper(true);
        });
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
            document.getElementById('playAndroidButton').classList.add('active-border');
            document.getElementById('stopAndroidButton').classList.remove('active-border')
            document.getElementById('stopAndroidButton').setAttribute('disabled', true);
            document.getElementById('stopAndroidButton').style.opacity = 0.4;
            document.getElementById('playAndroidButton').removeAttribute('disabled');
            document.getElementById('playAndroidButton').classList.remove('d-none');
        };

        myEvent(voiceAttachEvent, function (e) {
            window.speechSynthesis.cancel();
        });

        var isOnIOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i);
        var eventName = isOnIOS ? "pagehide" : "beforeunload";

        window.addEventListener(eventName, function (event) {
            console.log(eventName, "eventNameeventName");
            window.speechSynthesis.cancel();
        });


    } else {
        var isIE = false || !!document.documentMode;
        if (!isIE) {
            var ssu = new SpeechSynthesisUtterance();
            var myEvent = window.attachEvent || window.addEventListener;
            var voiceAttachEvent = window.attachEvent ? 'onbeforeunload' : 'beforeunload';
            if (localStorage.getItem('voiceOver') && localStorage.getItem('voiceOver') == 'on') {
                $('#c730ed34-ce14-4df1-8718-6346cd050c2b').removeClass('d-none').addClass('d-flex');
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
                document.getElementById('playButton').classList.add('active-border');
                document.getElementById('stopButton').classList.remove('active-border')
                document.getElementById('stopButton').setAttribute('disabled', true);
                document.getElementById('stopButton').style.opacity = 0.4;
                document.getElementById('playButton').removeAttribute('disabled');
                document.getElementById('playButton').classList.remove('d-none');
                document.getElementById('pauseButton').classList.add('d-none');
            };


            myEvent(voiceAttachEvent, function (e) {
                window.speechSynthesis.cancel();
            });

            var isOnIOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i);
            var eventName = isOnIOS ? "pagehide" : "beforeunload";

            window.addEventListener(eventName, function (event) {
                console.log(eventName, "eventNameeventName");
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

    }


});
