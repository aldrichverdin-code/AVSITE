$(document).ready(function () {
    $('.item').slick({
        dots: true,
        infinite: true,
        speed: 800,
        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('#experience-btn').on('click', function (e) {
        e.preventDefault();
        $('#new-experience').addClass('active');
        $('body').addClass('blur-background');
    });

    $('#close-experience, #btn-no').on('click', function () {
        $('#new-experience').removeClass('active');
        $('body').removeClass('blur-background');
    });

    $('#new-experience').on('click', function (e) {
        if (e.target === this) {
            $(this).removeClass('active');
            $('body').removeClass('blur-background');
        }
    });

    $('#btn-yes').on('click', function () {
        $('#new-experience').removeClass('active');
        $('#loading-screen').addClass('active');

        let progress = 0;
        const progressBar = $('#progress-bar');
        const progressInterval = setInterval(function () {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);

                setTimeout(function () {
                    window.location.href = "./components/default/Mantenimiento.html";
                }, 800);
            }
            progressBar.css('width', progress + '%');
        }, 300);
    });
});