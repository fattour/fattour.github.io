if ($(".slideMainVideosHome").length)
{
	$(".slideMainVideosHome").slick(
	{
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		fade: true,
		dots: false,
		asNavFor: ".sliderNavVideosHome",
		autoplay: true
	});
	$(".slideMainVideosHome").on("afterChange", function (event, slick, currentSlide)
	{
		hiddenIconVideo()
	});
	$(".sliderNavVideosHome").slick(
	{
		slidesToShow: 4,
		slidesToScroll: 1,
		asNavFor: ".slideMainVideosHome",
		dots: false,
		centerMode: false,
		arrows: false,
		focusOnSelect: true,
		autoplay: true
	})
}

function hiddenIconVideo()
{
	if ($(".slideMainVideosHome").length)
	{
		var dataVideo = $(".slideMainVideosHome .slick-current .wrapImgHidden").attr("data-video");
		if (dataVideo) $(".cover-skylounge .slider .entertainment .wrapMainVideosHome").removeClass("hidden-icon-video");
		else $(".cover-skylounge .slider .entertainment .wrapMainVideosHome").addClass("hidden-icon-video")
	}
}

function setHeightImg16And9()
{
	if ($(".img16And9").length)
	{
		setTimeout(function ()
		{
			$(".img16And9").each(function ()
			{
				var heightItem = $(this).width() * 9 / 16;
				$(this).attr("style", "height:" + heightItem + "px;");
				$(this).find("img").attr("style", "min-height:" + heightItem + "px;max-height:" + heightItem + "px;")
			})
		}, 500)
	}
}

function setHeightIntroduction()
{
	if ($(".colImgIntroduction").length)
	{
		var widthWindow = $(window).width();
		if (widthWindow > 991)
		{
			setTimeout(function ()
			{
				var heightItem = $(".colImgIntroduction").height();
				$(".colTextIntroduction").attr("style", "height:" + heightItem + "px;")
			}, 1e3)
		}
		else $(".colTextIntroduction").attr("style", "")
	}
}

function setHeightTextEventDetail()
{
	if ($(".textDetailEvent").length)
	{
		var widthWindow = $(window).width();
		if (widthWindow > 991)
		{
			setTimeout(function ()
			{
				var heightItem = $(".wrapAvatarEvent").height();
				$(".mediaEventDetail .wrapTextEventDetail").attr("style", "height:" + heightItem + "px;")
			}, 500)
		}
		else $(".mediaEventDetail .wrapTextEventDetail").attr("style", "")
	}
}

function setHeightImgSquare()
{
	if ($(".imgSquare").length)
	{
		setTimeout(function ()
		{
			$(".imgSquare").each(function ()
			{
				var heightItem = $(this).width();
				$(this).attr("style", "height:" + heightItem + "px;");
				$(this).find("img").attr("style", "min-height:" + heightItem + "px;max-height:" + heightItem + "px;")
			})
		}, 500)
	}
}
if (jQuery("#showGalleryImg").length && window.lightGallery) lightGallery(document.getElementById("showGalleryImg"));
var languagePage = $("html").attr("lang");

$(".dialogReservations #input-checkin").click(function ()
{
	$(".dialogReservations .boxDateCheckin, .dialogReservations .btnDoneBookDate").toggleClass("showDateTimePicker")
});
$(".dialogReservations .btnDoneBookDate").click(function ()
{
	$(".dialogReservations .boxDateCheckin, .dialogReservations .btnDoneBookDate").removeClass("showDateTimePicker")
});
$(".dialogReservations").click(function (e)
{
	var target = $(e.target);
	if (e.type == "focusin" || target.closest(this.element).length || target.closest(this.container).length || target.closest(".dialogReservations .boxDateCheckin").length || target.closest(".dialogReservations #input-checkin").length || target.closest(".dialogReservations .btnDoneBookDate").length) return;
	if ($(".dialogReservations .boxDateCheckin").hasClass("showDateTimePicker"))
	{
		$(".dialogReservations .boxDateCheckin, .dialogReservations .btnDoneBookDate").removeClass("showDateTimePicker")
	}
});

function setHeightBreadcrumbs()
{
	if ($(".wrapBreacrumbs .wrapImgHidden").length)
	{
		var widthWindow = $(window).width();
		if (widthWindow <= 991)
		{
			var heightItem = widthWindow * 9 / 16;
			$(".wrapBreacrumbs .wrapImgHidden").attr("style", "height:" + heightItem + "px;");
			$(".wrapBreacrumbs .wrapImgHidden img").attr("style", "min-height:" + heightItem + "px;max-height:" + heightItem + "px;")
		}
		else
		{
			$(".wrapBreacrumbs .wrapImgHidden").attr("style", "");
			$(".wrapBreacrumbs .wrapImgHidden img").attr("style", "")
		}
	}
}
if ($(".cover-skylounge .slider .drinks-menu").length)
{
	if (!$(".carousel-drink-menu").data("reloading"))
	{
		$(".carousel-drink-menu").data("reloading", true);
		this.setTimeout(reloadWaterWheel, 500)
	}
}
if (!$("#section-home").length) $("#sky-container").addClass("pageSub");

function setPositionBtnDrinkMenu()
{
	if ($("#section-drinks-menu .carousel-arrow").length)
	{
		var widthWindow = $(window).width();
		if (widthWindow >= 1200)
		{
			setTimeout(function ()
			{
				var leftSideBar = $(".left-sidebar .content-wrapper").offset().left;
				$("#section-drinks-menu .carousel-arrow").attr("style", "padding:0 " + leftSideBar + "px;")
			}, 1e3)
		}
		else $("#section-drinks-menu .carousel-arrow").attr("style", "")
	}
}
$(".nav .nav-item .dropdown-toggle").click(function ()
{
	var itemLi = $(this).parents(".has-child");
	setTimeout(function ()
	{
		if (itemLi.hasClass("open")) itemLi.find(".dropdown-menu").slideDown();
		else itemLi.find(".dropdown-menu").slideUp()
	}, 200)
});
$(".cover-skylounge .slider .entertainment .wrapMainVideosHome .itemSlideVideosHome .wrapImgHidden").click(function ()
{
	var dataVideo = $(this).attr("data-video");
	if (dataVideo)
	{
		$(".modalWatchVideoHome .wrapVideoHome").html(dataVideo)
	}
	else return false
});
setHeightImg16And9();
setHeightIntroduction();
setHeightTextEventDetail();
setHeightImgSquare();
setHeightBreadcrumbs();
setPositionBtnDrinkMenu();
hiddenIconVideo();
$(window).resize(function ()
{
	setHeightImg16And9();
	setHeightIntroduction();
	setHeightTextEventDetail();
	setHeightImgSquare();
	setHeightBreadcrumbs();
	setPositionBtnDrinkMenu()
});