$(document).ready(function () {
    setVideoTime();

    function setVideoTime() {
        let todayDate = moment().format('DD-MM-YYYY HH:MM:SS');
        let videoCount = document.getElementsByClassName('videoDateInput').length;
        for(let index = 0; index < videoCount; index++) {
            let videoTime = moment(document.getElementsByClassName('videoDateInput')[index].value).format('DD-MM-YYYY HH:MM:SS');
            // let dateE = moment().subtract(60, 'days');
            // let videoTime = moment(dateE).format('DD-MM-YYYY HH:MM:SS');
            let value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'days');
            let mydiv = document.getElementById('videoTime' + (parseInt(index) + 1));
            let time = '';
            if(value < 1) {
                value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'hours');
                if(value == 1) {
                    value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'minutes');
                    time = 'minute';
                } else {
                    time = 'hour';
                }
            } else if(value < 30) {
                time = 'day';
            } else if(value < 365) {
                value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'months');
                time = 'month';
            } else {
                value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'years');
                time = 'year';
            }
            mydiv.appendChild(document.createTextNode(setVideoValue(value, time)));
        }
    }

    function setVideoValue(value, time) {
        if(value == 1) {
            return `${value} ${time} ago`;
        } else {
            return `${value} ${time}s ago`;
        }
    }

});