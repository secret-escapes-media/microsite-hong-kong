(function ($, root, undefined) {$(function () {'use strict'; // on ready start
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////
//        general
///////////////////////////////////////

  // css tricks snippet - http://css-tricks.com/snippets/jquery/smooth-scrolling/
  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 500);
          return false;
        }
      }
    });
  });

  // inserts current year
  $('.js-year').html(new Date().getFullYear());

  // detects touch device
  if ("ontouchstart" in document.documentElement){
    $('html').addClass('touch');
  }


///////////////////////////////////////
//        Navigation
///////////////////////////////////////

  // mobile nav toggle open & close
  $('.js-toggle-mobile-nav').on('click', function(e) {
    $('.mobile-nav').toggleClass('is-open').toggleClass('is-closed');
  });

  // current page nav highlight
  var currentPage = $('body').data('current-page');
  $('.' + currentPage + ' .site-nav__item--' + currentPage).addClass('site-nav__item--current');


///////////////////////////////////////
//      SVG image swap
///////////////////////////////////////

  // finds image with class and swaps .png with .svg in img source string
  if (Modernizr.svgasimg) {
    var svgSwap = $('img.js-svg-swap');
    svgSwap.each( function() {
      var currentSrc = $(this).attr('src'),
          newSrc = currentSrc.replace('.png', '.svg');
      $(this).attr('src', newSrc);
    });
  }



///////////////////////////////////////
//    Generic modal
///////////////////////////////////////

var modal          = $('.js-modal'),
    modalLaunchBtn = $('.js-open-modal'),
    modalCloseBtn  = $('.js-close-modal'),
    modalCloseAreas  = $('.modal__content, .modal__wrap, .js-modal');

modalLaunchBtn.click(function(){

  var targetModal = $(this).attr('data-modal');
  var modalItem = $(this).attr('data-modal-item');

  if(modalItem){
    $('.modal__item').addClass('modal__item-inactive');
    $('#modal__item-' + modalItem ).removeClass('modal__item-inactive');
  }

  // disable scrolling on background content (doesn't work iOS)
  $('body').addClass('disable-scroll');
  // // open modal
  $('#modal-' + targetModal).fadeIn('250', function(){
    $(this).removeClass('is-closed').addClass('is-open');
    if(!modalItem){
      $(this).find('.modal__item').removeClass('modal__item-inactive');
    }
  });

  $('#modal-' + targetModal).find('.decoration').addClass('animate');

});

// closes modal
function modalClose(event){
  event.preventDefault();
  // enable scrolling
  $('body').removeClass('disable-scroll');
  // close modal with fade
  modal.fadeOut('250', function(){
    $(this).removeClass('is-open').addClass('is-closed');
  });
}

// closes modal on close icon click
modalCloseBtn.on('click', function(event) {
  modalClose(event);
});

// closes modal on background click
modalCloseAreas.on('click', function(event) {
  if (event.target !== this){
    return;
  }
  modalClose(event);
});

// closes modal on escape key press
$(document).keyup(function(event) {
   if (event.keyCode == 27) {
     modalClose(event);
    }
});


// Launches modal from query string

function GetQueryStringParams(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++){
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam){
      return sParameterName[1];
    }
  }
}​

var modalQuery = GetQueryStringParams('modal');

if (modalQuery) {
  var targetModal = modalQuery;
  $('body').addClass('disable-scroll');
  $('#modal-' + targetModal).fadeIn('250', function(){
    $(this).removeClass('is-closed').addClass('is-open');
  });
}


///////////////////////////////////////
//    Modal Carousel
///////////////////////////////////////

function modal_slider_next(){
  var parent    = $('#modal__slider');
  var current   = parent.find('.slide').not(".modal__item-inactive");
  var next = current.next('.slide');

  if( next.length == 0 ) {
    var next = parent.find('.slide').first();
  }
  current.addClass('modal__item-inactive');
  next.removeClass('modal__item-inactive');
}

function modal_slider_previous(){
  var parent    = $('#modal__slider');
  var current   = parent.find('.slide').not(".modal__item-inactive");
  var previous = current.prev('.slide');

  if( previous.length == 0 ) {
    var previous = parent.find('.slide').last();
  }
  current.addClass('modal__item-inactive');
  previous.removeClass('modal__item-inactive');
}


$('#modal_slider--next').click(function(){ modal_slider_next(); });
$('#modal_slider--previous').click(function(){ modal_slider_previous(); });

$(document).on('keyup', function(e) {
  if(e.which === 37){
    modal_slider_previous();
  }else if(e.which === 39) {
    modal_slider_next();
  }
});



///////////////////////////////////////
//       Background overlay fade
///////////////////////////////////////

function overlay_bg(){
	var st = $(document).scrollTop();
	var wh = $(window).height();

  $('.js-bg-fade').each(function(){

    var distance = $(this).offset().top;
    var start = distance - wh;
    var progress = st - start;

    $(this).find('.js-bg-fade__overlay').css({
      "opacity": progress / wh
    });

  });

}

$(document).scroll(function() {
	overlay_bg();
});

$(document).scroll(function() {
	var st = $(document).scrollTop();
	var wh = $(window).height();

	$('.title-banner__overlay').css({
    "opacity": st / (wh*1.5) + 0.15
	});
});



///////////////////////////////////////
//       Accordion
///////////////////////////////////////

function accordion(target,label,altLabel){
  var targetAccordion = $('#' + target);
  var btn = $(event.target);

  if(targetAccordion.hasClass('accordion--open')){
    targetAccordion.slideUp().removeClass('accordion--open').addClass('accordion--closed');
    if(label){ btn.html(label); }
  }else{
    targetAccordion.slideDown().removeClass('accordion--closed').addClass('accordion--open');
    if(altLabel){ btn.html(altLabel); }
  }
}


$('.accordion').each(function(){
  $(this).slideUp().addClass('accordion--closed');
});

$('.accordion__trigger').click(function(event){

  var label = $(this).attr('data-label');
  var altLabel = $(this).attr('data-alt-label');
  var target = $(this).attr('data-target');

  if( altLabel ){
    accordion(target,label,altLabel);
  }else{
    accordion(target);
  }

});


///////////////////////////////////////
//       In page nav
///////////////////////////////////////

function stickNav(){
  var st = $(document).scrollTop();
  var trigger = $('.intro.has-nav');
  var triggerH = $('.intro__content').outerHeight();
  var distance = triggerH + trigger.offset().top;
  var nav = $('.intro__nav');

  if( st > distance ){
    nav.addClass('stuck');
  }else{
    nav.removeClass('stuck');
  }
}

if( $('.intro').hasClass('has-nav') ){
  $(document).ready(function() { stickNav(); });
  $(document).scroll(function() { stickNav(); });
}




///////////////////////////////////////////////////////////////////////////////
});})(jQuery, this); // on ready end