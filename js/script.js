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
//    POIs modal
///////////////////////////////////////

var modal          = $('.js-modal'),
    modalLaunchBtn = $('.js-open-modal'),
    modalCloseBtn  = $('.js-close-modal');

// opens modal with specific content
function modalOpen(event){
  event.preventDefault();
  // hides all modal content
  $('.modal__content').hide();
  // show specific modal content from element data attribute
  var modalContent   = $(event.currentTarget).data('modal-id'),
      modalContentId = '.modal__content--' + modalContent;
  $(modalContentId).show().addClass('is-open');
  // disable scrolling on background content (doesn't work iOS)
  $('body').addClass('disable-scroll');
  // open modal
  modal.fadeIn('250', function(){
    $(this).removeClass('is-closed').addClass('is-open');
  });
}

// closes modal and hides all content
function modalClose(event){
  event.preventDefault();
  // enable scrolling
  $('body').removeClass('disable-scroll');
  // reset scroll position
  // This is a bit hacky, but visually hides the scroll position resetting
  setTimeout(function() {
    $('.modal__content-wrap').scrollTop(0);
  }, 280);
  // close modal with fade
  modal.fadeOut('250', function(){
    $(this).removeClass('is-open').addClass('is-closed');
    // Remove status class from modal content
    $('.modal__content.is-open').removeClass('is-open');
  });
}

// launches modal when offer is clicked
modalLaunchBtn.on('click', function(event) {
  modalOpen(event);
});

// closes modal on close icon click
modalCloseBtn.on('click', function(event) {
  modalClose(event);
});

// closes modal on background click
modal.on('click', function(event) {
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


///////////////////////////////////////
//    Modal Nav - next & previous
///////////////////////////////////////

function launchNextModal(){
  var currentModal          = $('.modal__content.is-open'),
      currentModalCategory  = currentModal.data('content-category'),
      nextModal             = currentModal.next('.modal__content'),
      nextModalCategory     = nextModal.data('content-category'),
      firstModal            = $('.modal__content[data-content-category="'+ currentModalCategory +'"]:first'),
      lastModal             = $('.modal__content[data-content-category="'+ currentModalCategory +'"]:last');

  // hides the current modal
  currentModal.hide().removeClass('is-open');
  // reset scroll position
  $('.modal__content-wrap').scrollTop(0);
  if (nextModal && currentModalCategory === nextModalCategory ) {
    // shows next in category
    nextModal.show().addClass('is-open');
  } else {
    // isn't another modal in category so goes back to beginning
    firstModal.show().addClass('is-open');
  }
}

function launchPreviousModal(){
  var currentModal          = $('.modal__content.is-open'),
      currentModalCategory  = currentModal.data('content-category'),
      previousModal         = currentModal.prev('.modal__content'),
      previousModalCategory = previousModal.data('content-category'),
      firstModal            = $('.modal__content[data-content-category="'+ currentModalCategory +'"]:first'),
      lastModal             = $('.modal__content[data-content-category="'+ currentModalCategory +'"]:last');
  // hides the current modal
  currentModal.hide().removeClass('is-open');
  // reset scroll position
  $('.modal__content-wrap').scrollTop(0);
  if (previousModal && currentModalCategory === previousModalCategory ) {
    // shows next in category
    previousModal.show().addClass('is-open');
  } else {
    // isn't another modal in category so goes back to beginning
    lastModal.show().addClass('is-open');
  }
}

$('.js-modal-nav').on('click', function(event) {
  event.preventDefault();
  var navDirection = $(this).data('nav-direction');

  // checks which button has been clicked and runs function
  switch (navDirection) {
    case 'next':
      launchNextModal();
      break;
    case 'previous':
      launchPreviousModal();
      break;
  }
});

$(document).on('keyup', function(e) {
  if(e.which === 37){
    launchPreviousModal();
  }else if(e.which === 39) {
    launchNextModal();
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