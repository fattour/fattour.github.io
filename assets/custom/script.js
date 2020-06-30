// start slide videos home
if($('.slideMainVideosHome').length){
    $('.slideMainVideosHome').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        dots: false,
        asNavFor: '.sliderNavVideosHome',
        autoplay:true
    });

    $('.slideMainVideosHome').on('afterChange', function(event, slick, currentSlide){
        hiddenIconVideo();
    });

    $('.sliderNavVideosHome').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.slideMainVideosHome',
        dots: false,
        centerMode: false,
        arrows: false,
        focusOnSelect: true,
        autoplay:true
    });
}

function hiddenIconVideo() {
    if($('.slideMainVideosHome').length) {
        var dataVideo = $('.slideMainVideosHome .slick-current .wrapImgHidden').attr('data-video');
        if(dataVideo) $('.cover-skylounge .slider .entertainment .wrapMainVideosHome').removeClass('hidden-icon-video');
        else $('.cover-skylounge .slider .entertainment .wrapMainVideosHome').addClass('hidden-icon-video');
    }
}
// end start slide videos home

// img 16 and 9
function setHeightImg16And9(){
    if($('.img16And9').length){
        setTimeout(function(){
            $('.img16And9').each(function(){
                var heightItem = $(this).width() * 9 / 16;
                $(this).attr('style', 'height:'+ heightItem +'px;');    
                $(this).find('img').attr('style', 'min-height:'+ heightItem +'px;max-height:'+ heightItem +'px;');
            });
        }, 500);      
    }
}
// end img 16 and 9

// set height block introduction
function setHeightIntroduction(){
    if($('.colImgIntroduction').length){
        var widthWindow = $(window).width();
        if(widthWindow > 991){
            setTimeout(function(){
                var heightItem = $('.colImgIntroduction').height();
                $('.colTextIntroduction').attr('style', 'height:'+ heightItem +'px;');
            }, 1000);
        }else $('.colTextIntroduction').attr('style', '');        
    }
}
// end set height block introduction

// set height text event detail
function setHeightTextEventDetail(){
    if($('.textDetailEvent').length){
        var widthWindow = $(window).width();

        if(widthWindow > 991){
            setTimeout(function(){
                var heightItem = $('.wrapAvatarEvent').height();

                $('.mediaEventDetail .wrapTextEventDetail').attr('style', 'height:'+ heightItem +'px;')
            }, 500);
        }else $('.mediaEventDetail .wrapTextEventDetail').attr('style', '');
    }        
}
// end set height text event detail

// img square
function setHeightImgSquare(){
    if($('.imgSquare').length){
        setTimeout(function(){
            $('.imgSquare').each(function(){
                var heightItem = $(this).width();
                $(this).attr('style', 'height:'+ heightItem +'px;');    
                $(this).find('img').attr('style', 'min-height:'+ heightItem +'px;max-height:'+ heightItem +'px;');
            });
        }, 500); 
    }
}
// end img square

// start gallery images
if(jQuery('#showGalleryImg').length && window.lightGallery) lightGallery(document.getElementById('showGalleryImg'));
// end start gallery images

// form book
var languagePage = $('html').attr('lang');

if($('.dialogReservations').length){
    var formatedDateNow = moment().format("ddd, MMM DD YYYY, h:mm:ss a");
    $('.dialogReservations #input-checkin').val(formatedDateNow);
    
    $('.dialogReservations .boxDateCheckin').datetimepicker({
        inline: true,
        sideBySide: true,
        minDate:moment(),
        locale: languagePage
    }).on('dp.change', function(e){
        var formatedValue = e.date.format("ddd, MMM DD YYYY, h:mm:ss a");
        $('.dialogReservations #input-checkin').val(formatedValue);
    });
}

$('.dialogReservations #input-checkin').click(function(){
    $('.dialogReservations .boxDateCheckin, .dialogReservations .btnDoneBookDate').toggleClass('showDateTimePicker');
});

$('.dialogReservations .btnDoneBookDate').click(function(){
    $('.dialogReservations .boxDateCheckin, .dialogReservations .btnDoneBookDate').removeClass('showDateTimePicker');
});

$('.dialogReservations').click(function(e){
    var target = $(e.target);
    if(
        e.type == "focusin" ||
        target.closest(this.element).length ||
        target.closest(this.container).length ||
        target.closest('.dialogReservations .boxDateCheckin').length||
        target.closest('.dialogReservations #input-checkin').length||
        target.closest('.dialogReservations .btnDoneBookDate').length
    ) return;

    if($('.dialogReservations .boxDateCheckin').hasClass('showDateTimePicker')){
        $('.dialogReservations .boxDateCheckin, .dialogReservations .btnDoneBookDate').removeClass('showDateTimePicker');
    }
});
// end form book

// set height breadcrumbs
function setHeightBreadcrumbs(){
    if($('.wrapBreacrumbs .wrapImgHidden').length){
        var widthWindow = $(window).width();

        if(widthWindow <= 991){
            var heightItem = widthWindow * 9 / 16;
            $('.wrapBreacrumbs .wrapImgHidden').attr('style', 'height:'+ heightItem +'px;');
            $('.wrapBreacrumbs .wrapImgHidden img').attr('style', 'min-height:'+ heightItem +'px;max-height:'+ heightItem +'px;');
        }else{
            $('.wrapBreacrumbs .wrapImgHidden').attr('style', '');
            $('.wrapBreacrumbs .wrapImgHidden img').attr('style', '');
        }
    }
}
// end set height breadcrumbs

// slide drink menu on page home
if($('.cover-skylounge .slider .drinks-menu').length){
    if (!$(".carousel-drink-menu").data("reloading")) {
        $(".carousel-drink-menu").data("reloading", true);
        this.setTimeout(reloadWaterWheel, 500);
    }
}
// end slide drink menu on page home

// check page sub
if(!$('#section-home').length) $('#sky-container').addClass('pageSub');

// set position btn slide frink menu
function setPositionBtnDrinkMenu(){
    if($('#section-drinks-menu .carousel-arrow').length){
        var widthWindow = $(window).width();
        if(widthWindow >= 1200){
            setTimeout(function(){
                var leftSideBar = $('.left-sidebar .content-wrapper').offset().left;
                $('#section-drinks-menu .carousel-arrow').attr('style', 'padding:0 '+ leftSideBar +'px;');
            }, 1000);
        }else $('#section-drinks-menu .carousel-arrow').attr('style', '');      
    }
}
// end set position btn slide frink menu

// show menu sub
$('.nav .nav-item .dropdown-toggle').click(function(){
    var itemLi = $(this).parents('.has-child');
    setTimeout(function(){     
        if(itemLi.hasClass('open')) itemLi.find('.dropdown-menu').slideDown();
        else itemLi.find('.dropdown-menu').slideUp();
    }, 200);
});
// end show menu sub

// entertainment
$('.cover-skylounge .slider .entertainment .wrapMainVideosHome .itemSlideVideosHome .wrapImgHidden').click(function() {
    var dataVideo = $(this).attr('data-video');
    if(dataVideo) {
        $('.modalWatchVideoHome .wrapVideoHome').html(dataVideo);
    } else return false;
});
// end entertainment

setHeightImg16And9();
setHeightIntroduction();
setHeightTextEventDetail();
setHeightImgSquare();
setHeightBreadcrumbs();
setPositionBtnDrinkMenu();
hiddenIconVideo();

$(window).resize(function(){
    setHeightImg16And9();
    setHeightIntroduction();
    setHeightTextEventDetail();
    setHeightImgSquare();
    setHeightBreadcrumbs();
    setPositionBtnDrinkMenu();
});