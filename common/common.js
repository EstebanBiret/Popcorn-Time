function motusma() {
    const url = 'https://motusma.biret-toscano.fr/'
    window.open(url, '_blank');  
}

$(document).ready(function() {
    $(window).scroll(function() {
        // navbar and scroll-btn appears on scroll
        if (this.scrollY > 20) {
            $('.navbar').addClass("sticky");
            $('.scroll-up-btn').addClass("show");
        } else {
            $('.navbar').removeClass("sticky");
            $('.scroll-up-btn').removeClass("show");
        }
    });

    // Go to the top of the page on click
    $('.scroll-up-btn').click(function() {
        $('html').animate({ scrollTop: 0 });

        $('html').css("scrollBehavior", "auto");
    });

    $('.navbar .menu li a').click(function() {

        $('html').css("scrollBehavior", "smooth");
    });

    // Menu navigation responsive
    $('.menu-btn').click(function() {
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");

         // Check if the menu is active and change the image src accordingly
         if ($('.navbar .menu').hasClass("active")) {
            $('#menu-icon').attr("src", "../../assets/cross.svg");
        } else {
            $('#menu-icon').attr("src", "../../assets/bars.svg");
        }
    });
});

//clic droit malotru !
document.addEventListener('contextmenu', event => {
    event.preventDefault();
    window.open('https://cours-informatique-gratuit.fr/dictionnaire/clic-droit/', '_blank'); 
});