$(document).ready(function() {

    /* Inpu Label */
    $('input').on('focusin', function() {
        $(this).parent().find('label').addClass('active');
    });

    $('input').on('focusout', function() {
        if (!this.value) {
            $(this).parent().find('label').removeClass('active');
        }
    });

    /* Password show & hidden */
    $(".toggle-password").click(function() {

        $(this).toggleClass("eye-open");
        var input = $($(this).attr("toggle"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    /* Slick carousel */
    $('.js-gallery').slick({
        slidesToShow: 15,
        slidesToScroll: 1,
        prevArrow: '<span class="gallery-arrow mod-prev"></span>',
        nextArrow: '<span class="gallery-arrow mod-next"></span>'
    });

    $('.js-gallery').slickLightbox({
        src: 'src',
        itemSelector: '.js-gallery-popup img',
        background: 'rgba(0, 0, 0, .7)'
    });

});