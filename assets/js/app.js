'use strict';

$(document).ready(function () {

	$('html').addClass('show');
	
	App.init();
	var id = location.hash.substr(5);

	animation.parallaxFn();

	//tan code here
	if($('section.homepage').length >0){	
		if(id == 'no-intro'){
			$('.loader').remove();
			$('.intro').remove();

			Intro.openDoor();
			setTimeout(function(){
				$('section.homepage').addClass('show');
			},300)

			window.location.hash = '';
			return;
		}
	}

	$('.loader').addClass('show');
	$('.intro').addClass('show');
	$('section.homepage').addClass('show');
	App.preload('.loader');

	if($('section.rules').length >0){	
		if(id != ""){
			var name = '.rules-body ul li:nth-child('+id+')';
			$('html,body').animate({scrollTop: $(name).offset().top},'slow');
		}

		animation.parallaxFn();
		return;
	}
	//end tan code here

	
});


function trace(txt){
	console.log(txt);
}

var CLASS = {
	_isActive: 'is-active',
	_modalOpen: 'modal-open',
	_navbarOpen: 'navbar-open'
};

var BODY = $('body'),
    WINDOW = $(window),
    DOCUMENT = $(document),
    WIN_WIDTH = WINDOW.width(),
    WIN_HEIGHT = WINDOW.height(),
    DOC_WIDTH = DOCUMENT.width(),
    DOC_HEIGHT = DOCUMENT.height();

var App = {

	init: function init() {
		App.device();
		App.resize(App.device);
		App.navbar();
		App.plugins();
		Accordion.init();
		Intro.init();
		if($(".masonry" ).length != 0) {
			Masonry.init();
		}
	},

	device: function device() {

		BODY.removeClass('mobile tablet landscape desktop');

		if (Detect.isLandscape()) {
			BODY.addClass('landscape');
		}

		if (Detect.isMobile()) {
			BODY.addClass('mobile');
		} else if (Detect.isTablet()) {
			BODY.addClass('tablet');
		} else {
			BODY.addClass('desktop');
		}
	},

	resize: function resize(name, timer) {
		var resizeTimer = 0;

		if (timer === undefined) {
			timer = 300;
		}

		WINDOW.on('resize', function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(name, timer);

			App.resizeYoutubePlayer();
		});

		
	},

	 resizeYoutubePlayer: function(){
		//tan code here
		var initH = 1200;
		var ratio = window.innerWidth/initH;
		var h = ratio*382;
		$('.homepage .slick-slide iframe').css({'height':h});

		// Anh code here
		$('.television video').css({'height':h+5.5});
		// end Anh code here

		//end tan code here
	},//resizeYoutubePlayer

	setCookie: function setCookie(key, value) {
		var expires = new Date();
		expires.setTime(expires.getTime() + 0.5 * 24 * 60 * 60 * 1000);
		document.cookie = key + '=' + value + ';path=/' + ';expires=' + expires.toUTCString();
	},

	getCookie: function getCookie(key) {
		var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
		return keyValue ? keyValue[2] : null;
	},

	getResize: function getResize() {
		WIN_WIDTH = WINDOW.width();
		WIN_HEIGHT = WINDOW.height();
		DOC_WIDTH = DOCUMENT.width();
		DOC_HEIGHT = DOCUMENT.height();
	},

	getScrollTop: function getScrollTop() {
		return BODY.scrollTop();
	},

	getScrollBarWidth: function getScrollBarWidth() {
		var outer = $('<div>').css({
			visibility: 'hidden',
			width: 100,
			overflow: 'scroll'
		}).appendTo('BODY'),
		    widthWithScroll = $('<div>').css({
			width: '100%'
		}).appendTo(outer).outerWidth();
		outer.remove();
		return 100 - widthWithScroll;
	},

	preload: function (element, callback) {
		var element = $(element) || element,
			items = [],
			onetimeLoad = false,
			current = 0,
			precent = 100,
			callback = callback || function (flag) {};

		function init() {
			if (App.getCookie('preload')) {
				animateLoad();
			} else {
				getImages();
			}
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

				trace(App.getCookie('preload'))
			}
		}

		function animateLoad() {
			TweenMax.to(element.find('.loader-2'), 1, {
				width: precent + '%',
				ease: Power3.easeOut,
				onComplete: function () {
					TweenMax.to(element, 0.3, {
						alpha: 0,
						delay: 0.3,
						ease: Power3.easeOut,
						onComplete: function () {
							element.remove();
							callback(true);
						}
					});
				}
			});
		}

		init();

	},

	imagesLoad: function imagesLoad(element, callback) {
		var el = $(element) || element,
		    images = el.find('img'),
		    items = [],
		    count = 0,
		    callback = callback || function (flag) {};

		function init() {
			getImages();
		}

		function getImages() {
			images.each(function () {
				items.push($(this).attr('src'));
			});
			items.forEach(function (e, i) {
				imageLoaded(items[i]);
			});
		}

		function imageLoaded(url) {
			var imgLoad = new Image();
			imgLoad.onload = function () {
				onComplete();
			};
			imgLoad.src = url;
		}

		function onComplete() {
			count++;
			if (count === items.length) {
				callback(true);
			}
		}

		init();
	},

	navbar: function navbar() {
		$('.navbar-toggle').on('click', function (evt) {
			evt.preventDefault();
			BODY.toggleClass(CLASS._navbarOpen);
		});

		$('.navbar-overlay').on('click', function (evt) {
			evt.preventDefault();
			BODY.removeClass(CLASS._navbarOpen);
		});
	},

	plugins: function plugins() {
		$('[data-fancybox]').fancybox({
			// Anh code here
        	afterLoad: function( instance, current ) {
        		if(typeof plyr != 'undefined'){
        			plyr.setup();
        			if(current.opts.type && current.opts.type == 'video'){
        				var initH = 1200;
        					var ratio = window.innerWidth/initH;
        				if(window.innerWidth < 768){
        					var h = ratio*600;
        				}else{
        					var h = ratio*500;
        				}
        				$('.fancybox-slide video').css({height: h});
        			}
        		}
   					
        	},
        	beforeLoad: function(){
        		
        	},
        	beforeShow: function(){
        		
        	},
        	afterShow: function(){
        		
        	},
        	// End Anh code here
			buttons: ['close']
		});
	}
};

var Detect = {

	isMobile: function isMobile() {
		if (navigator.userAgent.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i)) return true;else return false;
	},

	isTablet: function isTablet() {
		if (navigator.userAgent.match(/Tablet|iPad/i)) return true;else return false;
	},

	isDesktop: function isDesktop() {
		if (!this.isMobile() && !this.isTablet()) return true;else return false;
	},

	isLandscape: function isLandscape() {
		if (WIN_HEIGHT < WIN_WIDTH) return true;else return false;
	}

};


var animation = {
		init:function(){
			animation.animateUpDown();
			animation.fadeEff();
			setTimeout(function(){
				animation.bookScroll();
			},1000);

			// 
		},//init

		parallaxFn:function(){
			var item =  $('.elements img');
			item.each(function(e){
				var sp = Math.random()*2 + 1;
				$(this).attr({'sp':sp});
			})

			$(window).scroll(function() {
				var scrollTop = $('html, body').scrollTop();
				item.each(function(e){
					var item = $(this);
					var sp = Number(item.attr('sp'));
					var top = item.offset().top - scrollTop;

					if(top <= window.innerHeight){
						var dy = (($('.elements').offset().top - scrollTop)/5)*sp + "px";
						TweenMax.to($(this),.5,{y:dy,ease:Sine.easeOut });
					}
				})
			});
		},//parallaxFn

		bookScroll:function(){
			var book = $('.rule-core');
			var book3 = $('.library-body .book-3');
			var desY = 0;
			var timeout = 0;
			var slider = $('.rule-core .slick-slider');
			var minSC= .11;

			resizefn();

			 $(window).on('resize',function(){
			 	resizefn();
			 })

			 function resizefn(){
			 	resetFn();
			 	desY = book3.offset().top - book.offset().top;
			 	setDy();
			 }

			$(document).on('scroll', function(e){
				book.addClass('easing');
			   setDy()
			});

			function setDy(){

				//
			   var top = $('html, body').scrollTop();
			   var wh = window.innerHeight;

			   var t = desY - (book3.offset().top  - top - wh/2);

			   if(t >=0) t= 0;
			   if(t < desY) t = desY;

				var sc = 1 - Math.abs(t/desY);
				if(sc <minSC) sc = minSC;

				var scValue = 'scale('+sc+', '+sc+')';

				if(sc >=.8) slider.addClass('show')
				else slider.removeClass('show')

				book.css({
					 'top':t,
					'transform': scValue
				});
			}

			function resetFn(){
				book.removeClass('easing');
				var scValue = 'scale('+minSC+', '+minSC+')';
				book.css({
					 'top':0,
					'transform': scValue
				});
			}
		},//bookScroll

		fadeEff:function(){
			$('.animateFade').each(function(e){
				eff($(this));
			});

			function eff(item){
			   setTimeout(function(){
			   		if(item.hasClass('dot')) item.addClass("animate-fade-dot");
			   		else item.addClass("animate-fade");
			   },1000*Math.random()*2)
			}
		},//fadeEff

		animateUpDown:function(){
			$('.animateUpDown img').each(function(e){
				eff($(this));
			});

			function eff(item){
			   setTimeout(function(){
			   		item.addClass("animateUpDown-eff");
			   },1000*Math.random()*2)
			}
		},//fadeEff
	}

var Intro = {
	
	_intro: {},
	_lock: {},
	_key: {},
	_doorLeft: {},
	_doorRight: {},
	_homepage: {},
	_lockW: 0,
	_lockH: 0,
	_lockX: 0,
	_lockY: 0,
	_offsetX: 0,
	_offsetY: 0,
	_keyX: 0,
	_keyY: 0,

	// pauseYoutube:function(target){
	// 	$('.controls').on('click',function(){
	// 				console.log($("#ytplayer")[0]);
	// 				$("#ytplayer").attr({'src':""});
	// 			})
	// }

	init: function () {
		
		Intro._intro = $('.intro');
		Intro._homepage = $('.homepage');
		Intro._lock = Intro._intro.find('.lock');
		Intro._key = Intro._intro.find('.key');
		Intro._doorLeft = Intro._intro.find('.door-left');
		Intro._doorRight = Intro._intro.find('.door-right');


		//start [move to top of page]
	    scrollFn($(window));

	    $('.moveTopBtn').on('click',function(e){
		 	$("html, body").animate({scrollTop:0},"slow");
		});

	    $(window).scroll(function() {
			scrollFn($(this));
		});

		function scrollFn(item){
			if (item.scrollTop()) {
				$('.moveTopBtn').fadeIn(300);
			} else {
				$('.moveTopBtn').fadeOut(300);
			}
		}//end scrollFn

		
		if (BODY.hasClass('unlock')) {
			
			Intro.posLock();
			App.resize(Intro.posLock);

			//for testing
			// unlockFn(725,273);
			
			$('.unlock').off('touchmove mousemove');
			$('.unlock').on('touchmove mousemove', function(evt) {
				var posX = evt.pageX !== undefined ? evt.pageX : evt.originalEvent.touches[0].pageX,
					posY = evt.pageY !== undefined ? evt.pageY : evt.originalEvent.touches[0].pageY;
					posY -= $('html, body').scrollTop();

				unlockFn(posX,posY);
			});

			

			
		}

		function unlockFn(posX,posY){
				
			TweenMax.to(Intro._key, 0.3, {
				'left': Math.floor(posX) - (Intro._lock.width() / 2),
				'top': Math.floor(posY) - (Intro._lock.height() / 2)
			});

			var dx = $('.lock').offset().left + $('.lock').width()/2;
			var dy = $('.lock').offset().top - $('html, body').scrollTop() + $('.lock').height()/2;;

			function dist (x1, y1, x2, y2) {
			  var a = x1 - x2
				var b = y1 - y2
				return Math.sqrt( a*a + b*b );
			};

			var dis = dist(dx,dy, posX, posY);
			if (dis <=5) Intro.openDoor();				
		}

	},

	openDoor:function(){
		
		//tan code here
		// $('.moveTopBtn').css({'display':'block'})
		$('html, body').scrollTop(0);
		$('.unlock').off('touchmove mousemove');
		
		setTimeout(function(){
			App.resizeYoutubePlayer();
		},500)

		if(window.innerWidth >767) animation.init();
		//tan code here


		TweenMax.set('.homepage', {
			display: 'block'
		});
		
		BODY.on('touchend mouseup', function (evt) {
			BODY.off('touchmove mousemove');
		});
		
		BODY.removeClass('unlock');
		Intro._key.remove();

		
		
		if ($('.homepage').length > 0 && BODY.hasClass('desktop')) {
			var treasure = $('.treasure'),
				treasureH2 = treasure.find('h2'),
				treasureP = treasure.find('.treasure-left p'),
				content = treasure.find('.content'),
				contentBody = treasure.find('.content-body'),
				boxgold = treasure.find('.box');

				

			TweenMax.set(treasureH2, {
				autoAlpha: 0,
				y: -50
			});

			TweenMax.set(treasureP, {
				autoAlpha: 0,
				y: -50
			});

			TweenMax.set(content, {
				autoAlpha: 0,
				x: 50
			});


			TweenMax.set(contentBody, {
				autoAlpha: 0,
				x: 50
			});

			TweenMax.set(boxgold, {
				autoAlpha: 0,
				x: -50
			});

			treasure.waypoint(function(direction) {
				if (direction === 'down') {
					TweenMax.to(treasureP, 0.6, {
						autoAlpha: 1,
						y: 0,
						ease: Quad.easeOut
					});

					TweenMax.to(treasureH2, 0.6, {
						autoAlpha: 1,
						y: 0,
						delay: 0.15,
						ease: Quad.easeOut
					});

					TweenMax.to(content, 0.6, {
						autoAlpha: 1,
						x: 0,
						delay: 0.3,
						ease: Quad.easeOut
					});

					TweenMax.to(contentBody, 0.6, {
						autoAlpha: 1,
						x: 0,
						delay: 0.4,
						ease: Quad.easeOut
					});

					TweenMax.to(boxgold, 0.6, {
						autoAlpha: 1,
						x: 0,
						delay: 0.5,
						ease: Quad.easeOut
					});
				} else {
					TweenMax.to(treasureH2, 0.6, {
						autoAlpha: 0,
						y: -50,
						ease: Circ.easeOut
					});

					TweenMax.to(treasureP, 0.6, {
						autoAlpha: 0,
						y: -50,
						ease: Quad.easeOut
					});

					TweenMax.to(content, 0.6, {
						autoAlpha: 0,
						x: 50,
						ease: Quad.easeOut
					});

					TweenMax.to(contentBody, 0.6, {
						autoAlpha: 0,
						x: 50,
						ease: Quad.easeOut
					});

					TweenMax.to(boxgold, 0.6, {
						autoAlpha: 0,
						x: -50,
						ease: Quad.easeOut
					});
				}
			}, {
			  offset: '50%'
			});


		}
		

		TweenMax.to(Intro._lock, 0.3, {
			autoAlpha: 0,
			ease: Power0.easeOut,
			onComplete: function () {
				
				Intro.plugins();
				
				TweenMax.to(Intro._doorLeft, 0.8, {
					x: '-100%',
					ease: Power2.easeIn
				});
				TweenMax.to(Intro._doorRight, 0.8, {
					x: '100%',
					ease: Power2.easeIn,
					onComplete: function () {
						
					}
				});

				TweenMax.to(Intro._intro, 0.8, {
					scale: 3,
					delay: .7,
					ease: Power0.easeOut,
					onComplete: function () {
						Intro._intro.remove();
					}
				});
				
			}
		});
	},//openDoor
	
	posLock: function () {
		Intro._lockW = Intro._lock.width();
		Intro._lockH = Intro._lock.height();
		Intro._offsetX = Math.floor(Intro._lock.offset().left);
		Intro._offsetY = Math.floor(Intro._lock.offset().top);
		Intro._keyX = Intro._offsetX + (Intro._lockW / 2);
		Intro._keyY = Intro._offsetY + (Intro._lockH / 2);
	},
	
	plugins: function () {
		// $('.countdown').countdown('2018/02/26', function (event) {
		// 	$(this).html(event.strftime('<p><span>Ngày</span><span>%D</span></p>' + '<p><span>Giờ</span><span>%H</span></p>' + '<p><span>Phút</span><span>%M</span></p>' + '<p><span>Giây</span><span>%S</span></p>'));
		// });

		// Anh code here
		$('.countdown').countdown($('.countdown').data('countdown') || '2018/04/01', function (event) {
			$(this).html(event.strftime('<p><span>%D</span><span>Ngày</span></p>' + '<p><span>%H</span><span>Giờ</span></p>' + '<p><span>%M</span><span>Phút</span></p>' + '<p><span>%S</span><span>Giây</span></p>'));
		});

		$('.nano').nanoScroller();

		var banner = $('.banner'),
			rankingListing = $('.ranking-listing'),
		    library = $('.library-body ul'),
		    rule = $('.rule-body ul');

		banner.slick({
			arrows: false,
			autoplay: false,
			autoplaySpeed: 5000
		});


		var slickArr = [];
		var lastSlideID = 0;
		$('.banner .item').each(function(e){
			if(!$(this).hasClass('slick-cloned')) slickArr.push($(this));
			var item = $(this);
			if(item.hasClass('video')){
				var iframe =item.find('iframe');
				var src = "https://www.youtube.com/embed/" + iframe.attr('videoID') + "?autoplay=0&modestbranding=0&showinfo=0&rel=0&origin=http://example.com";
					iframe.attr({'src':src});
			}
		})

		banner.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			var total = slick.$slides.length,
			    current = nextSlide + 1;
			$('.dots .dot').removeClass(CLASS._isActive);
			$('.dots .dot').eq(nextSlide).addClass(CLASS._isActive);
			$('.current').text(current);
			$('.total').text(total);
			lastSlideID = currentSlide;
			var iframe = slickArr[nextSlide].find('iframe');
			var src = "https://www.youtube.com/embed/" + iframe.attr('videoID') + "?autoplay=0&modestbranding=0&showinfo=0&rel=0&origin=http://example.com";
				iframe.attr({'src':src});
		});
		banner.on('afterChange', function (event, slick, currentSlide, nextSlide) {
			var iframe = slickArr[lastSlideID].find('iframe');
				iframe.attr({'src':""});
		});
		$('.next').on('click', function (evt) {
			evt.preventDefault();
			banner.slick('slickNext');
		});
		$('.prev').on('click', function (evt) {
			evt.preventDefault();
			banner.slick('slickPrev');
		});
		$('.dots .dot').eq(0).addClass(CLASS._isActive);
		$('.dots .dot').on('click', function (evt) {
			var index = $(this).index();
			$('.dots .dot').removeClass(CLASS._isActive);
			$(this).addClass(CLASS._isActive);
			banner.slick('slickGoTo', index);
		});

		rankingListing.slick({
			arrows: false,
			autoplay: false,
			autoplaySpeed: 5000,
			draggable: false,
		});
		$('.next-ranking').on('click', function (evt) {
			evt.preventDefault();
			rankingListing.slick('slickNext');
		});
		$('.prev-ranking').on('click', function (evt) {
			evt.preventDefault();
			rankingListing.slick('slickPrev');
		});
		$('.names .name').eq(0).addClass(CLASS._isActive);
		rankingListing.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			var total = slick.$slides.length,
			    current = nextSlide + 1;
			$('.names .name').removeClass(CLASS._isActive);
			$('.names .name').eq(nextSlide).addClass(CLASS._isActive);
		});

		rankingListing.find('.item.slick-slide').mCustomScrollbar({
	        theme: "minimal-dark",
	        scrollButtons: {
	            enable: true
	        },        
		});

		//animation for history
		$('.tree_history li').each(function(e){
			var item = $(this);
			item.find('.item').waypoint(function(direction) {
				trace(direction);
				if (direction === 'down') {
					item.addClass('show')
				}else{
					item.removeClass('show')
				}
			}, {
			  offset: '50%'
			});
		});

		library.slick({
			arrows: false,
			slidesToShow: 4,
			slidesToScroll: 4,
			centerMode: true,
			responsive: [{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}]
		});


		rule.slick({
			arrows: false,
			slidesToShow: 4,
			slidesToScroll: 4,
			centerMode: true,
			responsive: [{
				breakpoint: 640,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}]
		});
	}
};

var Accordion = {

	_accordion: {},
	_accordionHeader: {},
	_accordionItem: {},
	_accordionBody: {},

	init: function init() {
		Accordion._accordion = $('.accordion');
		Accordion._accordionHeader = Accordion._accordion.find('.accordion-header');
		Accordion._accordionItem = Accordion._accordion.find('.accordion-item');
		Accordion._accordionBody = Accordion._accordion.find('.accordion-body');

		Accordion._accordionHeader.on('click', Accordion.toggle);
	},

	toggle: function toggle(evt) {
		evt.preventDefault();
		var obj = $(this),
		    parent = obj.parent(),
		    content = obj.next();

		if (parent.hasClass(CLASS._isActive)) {
			parent.removeClass(CLASS._isActive);
			TweenMax.to(content, 0.3, {
				height: 0,
				immediateRender: false,
				ease: Power1.easeOut
			});
		} else {
			Accordion._accordionItem.removeClass(CLASS._isActive);
			TweenMax.to(Accordion._accordionBody, 0.3, {
				height: 0,
				immediateRender: false,
				ease: Power1.easeOut
			});
			parent.addClass(CLASS._isActive);
			TweenMax.set(content, { height: 'auto' });
			TweenMax.from(content, 0.6, {
				height: 0,
				immediateRender: false,
				ease: Back.easeOut
			});
		}
	}
};

var Masonry = {

	_this: {},
	_item: {},
	_addItem: {},

	init: function init() {

		Masonry._this = $('.masonry');
		Masonry._item = Masonry._this.find('li');

		App.imagesLoad(Masonry._this, function () {
			Masonry.show();
		});

		Masonry.show();
		App.resize(Masonry.show);
	},

	show: function show() {
		var itemInfo = Masonry.getInfoItem(Masonry._item[0]),
		    itemWidth = itemInfo['width'],
		    columns = itemInfo['number'],
		    matrix = Masonry.initialRange(columns);

		TweenMax.set(Masonry._item, {
			position: 'absolute'
		});

		Masonry._item.each(function (index, element) {
			var el = $(element),
			    height = el.outerHeight(true),
			    addToCol = Masonry.minIndex(matrix),
			    leftPos = addToCol * itemWidth;

			TweenMax.to(el, 0.3, {
				left: leftPos + '%',
				top: matrix[addToCol],
				ease: Power1.easeOut
			});

			matrix[addToCol] += height;
		});

		TweenMax.to(Masonry._this, 0.3, {
			height: Masonry.maxCols(matrix)
		});
	},

	add: function add() {
		TweenMax.set('.add-item', {
			display: 'block',
			scale: 0,
			autoAlpha: 0
		});

		TweenMax.to('.add-item', 0.4, {
			scale: 1,
			autoAlpha: 1,
			delay: 0.3,
			ease: Power1.easeOut,
			onComplete: function onComplete() {
				Masonry._item.removeClass('add-item');
			}
		});

		Masonry.init();
	},

	maxCols: function maxCols(array) {
		return Math.max.apply(Math, array);
	},

	minIndex: function minIndex(array) {
		var minValue = Math.min.apply(Math, array);
		return $.inArray(minValue, array);
	},

	initialRange: function initialRange(number) {
		var array = [];

		for (var i = 0; i < number; i++) {
			array.push(0);
		}

		return array;
	},

	getInfoItem: function getInfoItem(item) {

		var itemWidth = $(item).width(),
		    parentWidth = Masonry._this.width(),
		    number = Math.round(parentWidth / itemWidth),
		    width = (100 / number).toFixed(5);

		return {
			'width': width,
			'number': number
		};
	}
};