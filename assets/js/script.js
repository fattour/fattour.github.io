const BODY = $('body'),
    WINDOW = $(window),
    DOCUMENT = $(document),
    WIN_WIDTH = WINDOW.width(),
    WIN_HEIGHT = WINDOW.height(),
    DOC_WIDTH = DOCUMENT.width(),
    DOC_HEIGHT = DOCUMENT.height(),
    SKY_PAGE = $('#sky-slider'),
    IS_MOBILE = isMobile(),
    NAV_MENU = $('#nav-menus');

$(document).ready(function () {
    App.init();
    App.preload('.loader', App.afterload());
})

const App = {

    init: function init() {
        // App.inputmask();
        $.ajaxSetup({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
            }
        });
        App.initAjaxForm();
    },
    afterload: function () {
        if(!IS_MOBILE){
            SKY_PAGE.css({
                'width': SKY_PAGE.children('.section').length * 100 + '%'
            })
        }
        
        let anchors = [];
        $.each(NAV_MENU.find('.menu-item'), function(el){
            const anchor = $(el).attr('data-menuanchor');
            if(anchor){
                anchors.push(anchor);
            }            
        });

        SKY_PAGE.fullpage({
            anchors: anchors,
            normalScrollElements: '.scroll-content',
            slideSelector: '.fp-slide',
            navigation: true,
            navigationPosition: "right",
            responsiveHeight: 567,
            controlArrows: false,
            lazyLoading: true,
            verticalCentered: false,
            css3: true,
            scrollY: !IS_MOBILE
        });

        $(".emg-menu").click(function () {
            toggleMenu(true);
        })
        $(".menu-close, .nav-mobile .menu-item").click(function () {
            toggleMenu(false);
        })
        $(".contact-form>.email-box, .contact-form>.msg-box").click(function () {
            $(this).focus();
        })

        // $(".gal-collection").click(function(e) {
        // updatePhotoSliderStatus(true, $(e.currentTarget).data("folder"));
        // })

        startFlyingStars();
        reloadWaterWheel();
        initMenuPhotoSlider();

        $('.modal').on('shown.bs.modal', function () {
            if($('#sky-slider').length){
               $.fn.fullpage.setAllowScrolling(false);
                $.fn.fullpage.setKeyboardScrolling(false); 
            }            
        })

        $('.modal').on('hide.bs.modal', function () {
            if($('#sky-slider').length){
                $.fn.fullpage.setAllowScrolling(true);
                $.fn.fullpage.setKeyboardScrolling(true);
            }
        })
    },

    setCookie: function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + 0.5 * 24 * 60 * 60 * 1000);
        document.cookie = key + '=' + value + ';path=/' + ';expires=' + expires.toUTCString();
    },

    getCookie: function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    },

    preload: function (element, callback) {
        var element = $(element) || element,
            items = [],
            onetimeLoad = false,
            current = 0,
            precent = 100,
            callback = callback || function (flag) {};

        function init() {
            // if (App.getCookie('preload')) {
            // 	animateLoad();
            // } else {
            // 	getImages();
            // }
            getImages();
        }

        function getImages() {
            BODY.find('*:not(script)').each(function (i, e) {
                var url = '';
                if ($(e).css('background-image').indexOf('none') == -1 && $(e).css('background-image').indexOf('-gradient') == -1) {
                    url = $(this).css('background-image');
                    if (url.indexOf('url') != -1) {
                        var temp = url.match(/url\((.*?)\)/);
                        url = temp[1].replace(/\"/g, '');
                    }
                } else if ($(e).get(0).nodeName.toLowerCase() == 'img' && typeof ($(e).attr('src')) != 'undefined') {
                    url = $(e).attr('src');
                }

                if (url.length > 0) {
                    items.push(url);
                }

            });

            items.forEach(function (e, i) {
                loadImg(e);
            });
        }

        function loadImg(url) {
            var imgLoad = new Image();
            imgLoad.onload = function () {
                completeLoad();
            }
            imgLoad.src = url;
        }

        function completeLoad() {
            current++;
            precent = Math.round((current / items.length) * 100);

            animateLoad();

            if (current >= items.length) {
                current = items.length;
                App.setCookie('preload', 'loaded');
            }
        }

        function animateLoad() {
            setTimeout(function(){
                $('.loader .wrapBorder1').fadeOut();
            }, 1000);

            setTimeout(function(){
                $('.loader').removeClass('show');
            }, 1500);

            setTimeout(function(){
                $('.loader').remove();
            }, 2000);
        }

        init();
    },
    inputmask: function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        today = dd + '-' + mm + '-' + yyyy + ' 00:00';
        $('input.datetime').inputmask("datetime", {
            inputFormat: "dd-mm-yyyy HH:MM",
            "placeholder": "dd-mm-yyyy hh:mm",
            min: today,
            // max: today,
            disablePredictiveText: true
        });
    },
    initAjaxForm: function () {
        $('body').on('submit', '.ajax-form', function (event) {
            event.preventDefault();

            $form = $(this);
            $form.find('.has-error .help-block').html('');
            $form.find('.form-group').removeClass('has-error');
            App.ajaxForm($form);
        });
    },
    ajaxForm: function () {

        const formData = new FormData($form.get(0));
        const button = $form.find('button[type=submit]');
        button.attr('disabled', true);
        const url = $form.attr('action');

        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (response, textStatus, jqXHR) {
                response.level = response.error ? 'error' : 'success'
                App.handleAjaxSubmitSuccess(response, textStatus, jqXHR, $form, button);
            },
            error: function (response, textStatus, jqXHR) {
                App.handleAjaxSubmitError(response, textStatus, jqXHR, $form, button)
            }
        });
    },
    handleAjaxSubmitSuccess: function (response, textStatus, jqXHR, $form, button) {
        if (response.message) {
            App.themeNotify(response);
        }
        if ($form.data('clear-form') && response.error == false) {
            $form[0].reset();
        }
        if (button.attr('disabled')) {
            button.attr('disabled', false);
        }
    },
    handleAjaxSubmitError: function (response, textStatus, jqXHR, $form, button) {
        if (response.status === 422) {
            var errors = $.parseJSON(response.responseText)['errors'];
            // Iterate through errors object.
            $.each(errors, function (field, message) {
                //console.error(field+': '+message);
                //handle arrays
                if (field.indexOf('.') !== -1) {
                    field = field.replace('.', '[');
                    //handle multi dimensional array
                    for (i = 1; i <= (field.match(/./g) || []).length; i++) {
                        field = field.replace('.', '][');
                    }
                    field = field + "]";
                }
                var formGroup = $('[name="' + field + '"]', $form).closest('.form-group');
                //Try array name
                if (formGroup.length === 0) {
                    formGroup = $('[name="' + field + '[]"]', $form).closest('.form-group');
                }

                // try data-name
                if (formGroup.length === 0) {
                    formGroup = $('[data-name="' + field + '"]', $form).closest('.form-group');
                }

                if (formGroup.length === 0) {
                    field = field.replace(/[0-9]/, '');
                    formGroup = $('[name="' + field + '"]', $form).closest('.form-group');
                }

                var tabIndex = formGroup.closest('.tab-pane').index();

                var panel = formGroup.closest('.panel').find('.panel-title').addClass('c-red');
                if (tabIndex >= 0) {
                    $('.nav.nav-tabs li').eq(tabIndex).find('a').addClass('c-red');
                }
                formGroup.removeClass('hidden');

                formGroup.addClass('has-error').append('<p class="help-block">' + message + '</p>');
            });
        }
        var data = response || {};
        data.message = $.parseJSON(response.responseText)['message'];
        data.level = 'error';
        App.themeNotify(data);
        if (button.attr('disabled')) {
            button.attr('disabled', false);
        }
    },
    themeNotify: function (data) {

        if (undefined === data.level && undefined === data.message) {

            if (undefined !== data.responseJSON) {
                data = data.responseJSON;
            }

            var level = 'error';
            var message = data.message;
            var errors = data.errors;
        } else {
            level = data.level;
            message = data.message;
        }

        if (undefined !== errors) {
            message += "<br>";
            $.each(errors, function (key, val) {
                message += val + "<br>";
            });
        }
        if (undefined === level && undefined === message) {
            level = 'error';
            message = 'Something went wrong!!';
        }

        if (level === 'error') {
            level = 'danger';
        }

        var icon = 'fas fa-bell';

        if (level === 'success') {
            icon = 'far fa-check-circle';
        }

        iziToast.show({
            class: "iziToast-" + level,
            icon: icon,
            timeout: 4000,
            buttons: [],
            transitionIn: "fadeInLeft",
            transitionInMobile: "fadeIn",
            transitionOut: "fadeOut",
            transitionOutMobile: "fadeOut",
            message: message,
            position: 'bottomRight'
        });
    }
}


var auto = null; //timer variable
var carousel, currentActiveDrinkMenu;


var showMenu = function (isDrink) {
    var $drink = $(".desc-footer .drink");
    var $food = $(".desc-footer .food");
    var $drinkWrapper = $(".desc-drink-wrapper");
    var $foodWraper = $(".desc-food");
    var $drinkSlider = $("#menu-photo-slider");
    var $foodSlider = $("#menu-food-photo-slider");

    $drink.removeClass("active");
    $food.removeClass("active");
    $drinkWrapper.hide();
    $foodWraper.hide();
    $drinkSlider.hide();
    $foodSlider.hide();
    if (isDrink) {
        $drink.addClass("active");
        $drinkWrapper.fadeIn(1000);
        $drinkSlider.show();
    } else {
        $food.addClass("active");
        $foodWraper.fadeIn(1000);
        $foodSlider.show();
    }
}

var initMenuPhotoSlider = function () {
    var init = function (sliderId) {
        $(`${sliderId} .item`).first().addClass("active");
        $(`${sliderId} .carousel-indicators > li`).first().addClass("active");
        $(sliderId).carousel();
        $(sliderId).swipe({
            swipe: function (
                event,
                direction,
                distance,
                duration,
                fingerCount,
                fingerData
            ) {
                if (direction == "left") $(this).carousel("next");
                if (direction == "right") $(this).carousel("prev");
            },
            allowPageScroll: "vertical"
        });
    }
    init("#menu-photo-slider");
    init("#menu-food-photo-slider");

    $("#menu-photo-slider").on("slide.bs.carousel", function (e) {
        var idx = $(e.relatedTarget).data('idx');
        $(".desc-drink-wrapper").find(".desc-drink").hide()
        $(".desc-drink-wrapper").find(`.desc-drink[data-idx=${idx}]`).fadeIn(1000);
    });
}

var startFlyingStars = function () {
    function randomInt(min, max) {
        return Math.floor(Math.random() * max + min);
    }

    function randomNum(min, max) {
        return Math.max(Math.random() * max, min).toFixed(1);
    }

    $("#star-layers .layer").each(function () {
        var $this = $(this),
            limit = 18,
            $star = [];

        while (limit) {
            $star = $("<span/>").addClass("star");
            $star.html($('.star-content').html());
            const width = randomInt(7, 30) + "px"
            $star.css({
                left: randomInt(1, 100) + "%",
                top: randomInt(1, 100) + "%",
                transform: "scale(" + randomNum(0, 1) + ")",
                opacity: randomNum(0.6, 1),
                width: width,
                height: width
            });

            $this.append($star);
            limit--;
        }
    });
}

var reloadWaterWheel = function () {
    var options = {
        startingItem: 1,
        flankingItems: 1,
        separation: 300,
        sizeMultiplier: 0.3,
        centerItemPadding: 160,
        movingToCenter: function ($item) {
            var id = $item.attr("data-id");
            currentActiveDrinkMenu = parseInt(id);
            $('.drink-menu-desc').hide();
            $(".drink-menu-desc[data-id=" + id + "]").fadeIn();
        },
        movedToCenter: function ($item) {
            $item.css("filter", "");
        },
        movingFromCenter: function ($item) {
            $item.css("filter", "blur(1px)");
        },
        movedFromCenter: function ($item) {},
    };
    var windowWidth = $(window).width();
    if (windowWidth < 801) {
        options.flankingItems = 0
        options.centerItemPadding = 100;
    } else if (windowWidth < 1024) {
        options.separation = 300;
    }

    if (!$(".carousel-drink-menu").data("initialized")) {
        $(".carousel-drink-menu").data("initialized", true);
        carousel = $(".carousel-drink-menu").waterwheelCarousel(options);

        $(document).on("click", ".carousel-arrow .back", function () {
            carousel.prev();
        });
        $(document).on("click", ".carousel-arrow .forward", function () {
            carousel.next();
        });
        $(".drink-menu-desc").hide();
        $(".drink-menu-glass").css("filter", "blur(1px)");
        $(".neptune").css("filter", "");

        $(".drink-menu-desc[data-id=1]").fadeIn();
        window.onresize = function () {
            if (!$(".carousel-drink-menu").data("reloading")) {
                $(".carousel-drink-menu").data("reloading", true);
                this.setTimeout(reloadWaterWheel, 500);
            }
        }
    } else {
        options.startingItem = currentActiveDrinkMenu;
        carousel.reload(options);
        $(".carousel-drink-menu").data("reloading", false);
    }

    $(".carousel-drink-menu").waterwheelCarousel(options);
}

// device detection
function isMobile()
{
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)));
}

function _isMobile() {
    return ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1))
}

function toggleMenu(show) {
    if (show) {
        $(".nav-mobile").css("display", "flex");
    } else {
        $(".nav-mobile").css("display", "none");
    }
}


function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}