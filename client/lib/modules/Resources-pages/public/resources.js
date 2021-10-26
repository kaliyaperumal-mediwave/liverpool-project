$(document).ready(function(){
$( ".swiper-slide.swiper-slide-next" ).next().addClass("slide-show-frame");

$('.swiper-button-next.custom-control-next, .swiper-button-prev.custom-control-prev').click(function (){
$( ".swiper-slide.swiper-slide-next" ).next().addClass("slide-show-frame");
})
});
