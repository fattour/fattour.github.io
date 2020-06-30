$(function() {
  // Your custom JavaScript goes here
});

var auto = null; //timer variable
var carousel, currentActiveCocktail;

var home = function() {
}

var showMenu = function(isDrink) {
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

var initMenuPhotoSlider = function() {
  var init = function(sliderId) {
    $(`${sliderId} .item`).first().addClass("active");
    $(`${sliderId} .carousel-indicators > li`).first().addClass("active");
    $(sliderId).carousel();
    $(sliderId).swipe({
        swipe: function(
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

  $("#menu-photo-slider").on("slide.bs.carousel", function(e) {
      var idx = $(e.relatedTarget).data('idx');
      $(".desc-drink-wrapper").find(".desc-drink").hide()
      $(".desc-drink-wrapper").find(`.desc-drink[data-idx=${idx}]`).fadeIn(1000);  
  });
}
// var updatePhotoSliderStatus = function(showSlider, folder) {
    // if (showSlider == true) {
      // loadPhotoSlider(folder)
        // .then(function(html) {
          // $("#photo-slider-wrapper").html(html);
          // $('#photo-slider .item').first().addClass('active');
          // $('#photo-slider .carousel-indicators > li').first().addClass('active');
          // $("#photo-slider").carousel();   
          // $("#photo-slider").swipe({
              // swipe: function(
                  // event,
                  // direction,
                  // distance,
                  // duration,
                  // fingerCount,
                  // fingerData
              // ) {
                  // if (direction == "left") $(this).carousel("next");
                  // if (direction == "right") $(this).carousel("prev");
              // },
              // allowPageScroll: "vertical"
          // });          
          
          // $("#photo-slider-wrapper").show();
          // $("#sky-container").hide();
        // })
    // } else {
        // $("#photo-slider-wrapper").hide();
        // $("#sky-container").show();
    // }
// };

var startFlyingStars = function() {
  function randomInt(min, max) {
      return Math.floor(Math.random() * max + min);
  }

  function randomNum(min, max) {
      return Math.max(Math.random() * max, min).toFixed(1);
  }
  
  $("#star-layers .layer").each(function() {
      var $this = $(this),
          limit = 30,
          $star = [];

      while (limit) {
          $star = $("<span/>").addClass("star");
          $star.html('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M10.744,5.372C7.777,5.372,5.372,2.967,5.372,0c0,2.967-2.405,5.372-5.372,5.372c2.967,0,5.372,2.405,5.372,5.372 C5.372,7.777,7.777,5.372,10.744,5.372z"/></svg>');
          $star.css({
              left: randomInt(1, 100) + "%",
              top: randomInt(1, 100) + "%",
              transform: "scale(" + randomNum(0, 1) + ")",
              opacity: randomNum(0.6, 1)
          });

          $this.append($star);
          limit--;
      }
  });
}

var reloadWaterWheel = function() {
    var options = {
        startingItem: 1,
        flankingItems: 1,
        separation: 300,
        sizeMultiplier: 0.3,
        centerItemPadding: 160,
        movingToCenter: function ($item) {
            var id = $item.attr("data-id");
            currentActiveCocktail = parseInt(id);
            $('.cocktail-desc').hide();
            $(".cocktail-desc[data-id=" + id + "]").fadeIn();
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

    if (!$(".carousel-cocktail").data("initialized")) {
        $(".carousel-cocktail").data("initialized", true);
        carousel = $(".carousel-cocktail").waterwheelCarousel(options);
        console.log("Initializing Carousel");
        $(document).on("click", ".carousel-arrow .back", function() {
            carousel.prev();
        });
        $(document).on("click", ".carousel-arrow .forward", function() {
            carousel.next();
        });
        $(".cocktail-desc").hide();
        $(".cocktail-glass").css("filter", "blur(1px)");
        $(".neptune").css("filter", "");

        $(".cocktail-desc[data-id=1]").fadeIn();
        window.onresize = function() {
          if (!$(".carousel-cocktail").data("reloading")) {
              $(".carousel-cocktail").data("reloading", true);
              this.setTimeout(reloadWaterWheel, 500);
          } 
        }
    } else {
        options.startingItem = currentActiveCocktail;
        console.log(currentActiveCocktail);
        carousel.reload(options);
        $(".carousel-cocktail").data("reloading", false);
    }

    $(".carousel-cocktail").waterwheelCarousel(options);
}

function isMobile() {
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