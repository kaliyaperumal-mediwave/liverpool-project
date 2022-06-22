$(document).ready(function () {
    // to make the slider visible
    $("div.swiper-wrapper").css("visibility", "visible");
    var swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: false,
        loopedSlides: 0,
        slidesPerView: '3',
        slidesOffsetAfter: 0,
        spaceBetween: 30,
        grabCursor: true,

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        //scrollbar: '.swiper-scrollbar',

        breakpoints: {
            1024: {
                spaceBetween: 30,
                slidesPerView: 3,

            },
            992: {
                spaceBetween: 30,
                slidesPerView: 2,

            },
            768: {
                spaceBetween: 30,
                slidesPerView: 2,

            },
            600: {
                spaceBetween: 30,
                slidesPerView: 2,

            },
            424: {
                spaceBetween: 10,
                slidesPerView: 1.5,

            },

        }
    });
});
